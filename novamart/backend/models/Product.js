const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:    String,
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  mrp:         { type: Number, required: true },
  category:    { type: String, required: true },
  brand:       { type: String, required: true },
  image:       { type: String, default: '📦' },
  badge:       { type: String, default: '' },
  tags:        [String],
  stock:       { type: Number, default: 0 },
  sold:        { type: Number, default: 0 },
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  reviews:     [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
