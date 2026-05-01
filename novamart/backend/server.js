const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/ai',       require('./routes/ai'));
app.use('/api/admin',    require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: '✅ NovaMart API is running!' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running → http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n📌 Fix: Open backend/.env and update MONGODB_URI with your MongoDB Atlas connection string');
    console.log('📌 Get it free at: https://www.mongodb.com/atlas\n');
    // Start anyway so frontend can still partially work
    app.listen(PORT, () => {
      console.log(`⚠️  Server started WITHOUT database on http://localhost:${PORT}`);
    });
  });
