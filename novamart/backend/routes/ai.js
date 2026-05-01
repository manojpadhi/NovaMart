const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ai/chat  — Sarvam Chat Completion
router.post('/chat', async (req, res) => {
  try {
    const { messages, product } = req.body;
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return res.json({ reply: '⚠️ AI not configured. Add SARVAM_API_KEY in backend/.env' });
    }

    const systemPrompt = `You are a sharp, helpful AI shopping assistant for NovaMart, an Indian e-commerce platform.
${product ? `Product: ${product.name} | Price: ₹${product.price?.toLocaleString()} (MRP ₹${product.mrp?.toLocaleString()}) | Brand: ${product.brand} | Rating: ${product.rating}/5 (${product.numReviews} reviews) | Stock: ${product.stock} | ${product.description}` : 'Help users shop wisely.'}
Be concise (under 100 words), friendly, use bullet points for lists. Hindi-English mix is fine.`;

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ message: data.message || 'Sarvam API error' });
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
});

// POST /api/ai/speak  — Sarvam Text-to-Speech
router.post('/speak', async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) return res.status(400).json({ message: 'SARVAM_API_KEY not set' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'No text provided' });

    // Strip markdown bold/bullets for cleaner speech
    const clean = text.replace(/\*\*/g, '').replace(/^[•\-*] /gm, '').slice(0, 500);

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
      body: JSON.stringify({
        inputs: [clean],
        target_language_code: 'hi-IN',
        speaker: 'meera',
        model: 'bulbul:v1',
        enable_preprocessing: true,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ message: data.message || 'TTS error' });
    res.json({ audio: data.audios[0] }); // base64 WAV
  } catch (err) {
    res.status(500).json({ message: 'TTS error: ' + err.message });
  }
});

// POST /api/ai/transcribe  — Sarvam Speech-to-Text
router.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) return res.status(400).json({ message: 'SARVAM_API_KEY not set' });
    if (!req.file) return res.status(400).json({ message: 'No audio file provided' });

    const form = new FormData();
    form.append('file', req.file.buffer, { filename: 'audio.wav', contentType: req.file.mimetype });
    form.append('model', 'saaras:v3');
    form.append('mode', 'transcribe');

    const response = await fetch('https://api.sarvam.ai/v1/speech-to-text', {
      method: 'POST',
      headers: { 'api-subscription-key': apiKey, ...form.getHeaders() },
      body: form,
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ message: data.message || 'Transcription error' });
    res.json({ transcript: data.transcript });
  } catch (err) {
    res.status(500).json({ message: 'Transcription error: ' + err.message });
  }
});

module.exports = router;
