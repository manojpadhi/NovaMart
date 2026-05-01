const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:  String,
    image: String,
    price: Number,
    qty:   Number,
  }],
  shippingAddress: {
    name:    String,
    phone:   String,
    address: String,
    city:    String,
    pincode: String,
  },
  paymentMethod: { type: String, default: 'UPI' },
  totalPrice:    { type: Number, required: true },
  savedAmount:   { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  isPaid:      { type: Boolean, default: false },
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
