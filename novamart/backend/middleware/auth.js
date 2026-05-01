const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, no user ID' });
    }
    req.user = await User.findById(userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, admin };
