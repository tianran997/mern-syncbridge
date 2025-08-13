const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/syncbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Clean up expired messages every hour
setInterval(async () => {
  try {
    const Message = require('./models/Message');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await Message.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} expired messages`);
    }
  } catch (error) {
    console.error('Error cleaning up messages:', error);
  }
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});