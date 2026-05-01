const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const SEED = [
  { name:'AeroFlow Pro Headphones', description:'Noise-cancelling wireless headphones with 40hr battery, premium 40mm drivers and spatial audio. Bluetooth 5.3, foldable, USB-C fast charge.', price:12499, mrp:19999, category:'Electronics', brand:'SoundCore', image:'🎧', badge:'Bestseller', tags:['wireless','noise-cancel','premium'], stock:24, sold:1820, rating:4.7, numReviews:3241 },
  { name:'CloudStep Running Shoes', description:'Responsive foam midsole with breathable mesh upper. Perfect for long runs and everyday training.', price:4299, mrp:7499, category:'Footwear', brand:'VeloRun', image:'👟', badge:'Trending', tags:['running','lightweight','breathable'], stock:42, sold:3100, rating:4.5, numReviews:1087 },
  { name:'ThermoVault Steel Bottle', description:'Double-wall vacuum insulation keeps cold 24hr, hot 12hr. BPA-free, leak-proof lid. 6 colours.', price:1199, mrp:2299, category:'Kitchen', brand:'HydroVault', image:'🫙', badge:'Top Rated', tags:['insulated','eco','bpa-free'], stock:112, sold:8900, rating:4.8, numReviews:6521 },
  { name:'LumbarElite Office Chair', description:'Fully adjustable ergonomic chair with lumbar support, adjustable armrests and breathable mesh back.', price:17999, mrp:32000, category:'Furniture', brand:'PostureX', image:'🪑', badge:'Premium', tags:['ergonomic','office','lumbar'], stock:8, sold:420, rating:4.6, numReviews:512 },
  { name:'ClearVision 4K Webcam', description:'Sony sensor, autofocus, dual-mic noise cancellation. Plug-and-play. Perfect for streaming & calls.', price:5999, mrp:8999, category:'Electronics', brand:'VidClear', image:'📷', badge:'New', tags:['4k','autofocus','streaming'], stock:19, sold:760, rating:4.4, numReviews:1203 },
  { name:'WheyMax Protein Bundle', description:'25g protein per serving, 5g BCAA, zero sugar. 6 flavours. Lab-tested purity guaranteed.', price:2099, mrp:3499, category:'Health', brand:'NutriLab', image:'💪', badge:'AI Pick', tags:['protein','fitness','supplement'], stock:200, sold:14000, rating:4.9, numReviews:9820 },
  { name:'TactilePro Mech Keyboard', description:'Cherry MX Brown switches, per-key RGB, aluminium frame, USB-C detachable cable. 104 keys.', price:8299, mrp:11999, category:'Electronics', brand:'KeyForge', image:'⌨️', badge:'Trending', tags:['mechanical','rgb','typing'], stock:15, sold:2300, rating:4.7, numReviews:4210 },
  { name:'ZenFlow Bamboo Yoga Mat', description:'Natural bamboo fibre, anti-slip base, 6mm joint cushioning. Includes carry strap and bag.', price:1699, mrp:3200, category:'Fitness', brand:'ZenFlow', image:'🧘', badge:'Eco', tags:['yoga','eco','natural'], stock:78, sold:4200, rating:4.6, numReviews:2100 },
  { name:'NightOwl Ring Light 18"', description:'3200K-5600K adjustable colour temp, 10 brightness levels, phone holder & tripod included.', price:3499, mrp:5999, category:'Electronics', brand:'LumiPro', image:'💡', badge:'Deal', tags:['lighting','photography','streaming'], stock:33, sold:1100, rating:4.5, numReviews:892 },
  { name:'SmartFit Pro Watch', description:'AMOLED display, SpO2, ECG, sleep tracking, GPS, 7-day battery. IP68 waterproof rating.', price:9499, mrp:14999, category:'Electronics', brand:'FitTrack', image:'⌚', badge:'AI Pick', tags:['smartwatch','fitness','health'], stock:29, sold:3800, rating:4.6, numReviews:5430 },
  { name:'ColdBrew Coffee Kit', description:'1L borosilicate glass jar, ultra-fine stainless mesh filter, recipe booklet. Perfect cold brew.', price:1899, mrp:3199, category:'Kitchen', brand:'BrewLab', image:'☕', badge:'Trending', tags:['coffee','cold-brew','kitchen'], stock:65, sold:5600, rating:4.7, numReviews:3210 },
  { name:'AirPurify HEPA Compact', description:'True HEPA + activated carbon filtration. Covers 400 sq ft. Ultra-quiet 25dB sleep mode.', price:6799, mrp:10999, category:'Home', brand:'BreathePure', image:'🌬️', badge:'Bestseller', tags:['hepa','air','home'], stock:22, sold:980, rating:4.8, numReviews:1540 },
];

// Auto-seed on startup
const seedIfEmpty = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(SEED);
    console.log('✅ Products seeded to MongoDB');
  }
};
seedIfEmpty().catch(() => {});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
    if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-low')  sort = { price: 1 };
    if (req.query.sort === 'price-high') sort = { price: -1 };
    if (req.query.sort === 'rating')     sort = { rating: -1 };

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const already = product.reviews.find(r => r.user?.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: 'Already reviewed this product' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(req.body.rating), comment: req.body.comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Create
router.post('/', protect, admin, async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Update
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Delete
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
