const express = require('express');
const router  = express.Router();
const fetch   = require('node-fetch');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages, product } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey.includes('YOUR_KEY')) {
      return res.json({ reply: '⚠️ AI not configured. Add your Anthropic API key in backend/.env to enable AI chat. Get a free key at console.anthropic.com' });
    }

    const system = `You are a sharp, helpful AI shopping assistant for NovaMart, an Indian e-commerce platform.
${product ? `Product: ${product.name} | Price: ₹${product.price?.toLocaleString()} (MRP ₹${product.mrp?.toLocaleString()}) | Brand: ${product.brand} | Rating: ${product.rating}/5 (${product.numReviews} reviews) | Stock: ${product.stock} | ${product.description}` : 'Help users shop wisely.'}
Be concise (under 100 words), friendly, use bullet points for lists. Hindi-English mix is fine.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 400, system, messages }),
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ message: data.error.message });
    res.json({ reply: data.content[0].text });
  } catch (err) {
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
});

module.exports = router;
