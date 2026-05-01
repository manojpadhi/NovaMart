const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// POST /api/orders  — create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice, savedAmount } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const order = await Order.create({ user: req.user._id, items, shippingAddress, paymentMethod, totalPrice, savedAmount });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { sold: item.qty, stock: -item.qty } });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders  — admin all orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status  — admin update
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const upd = { status: req.body.status };
    if (req.body.status === 'Delivered') { upd.isPaid = true; upd.deliveredAt = Date.now(); }
    const order = await Order.findByIdAndUpdate(req.params.id, upd, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
