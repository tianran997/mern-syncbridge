import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Import routes and models
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();
const uri = process.env.MONGODB_URI;

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// // Database connection
// mongoose.connect(process.env.MONGODB_URI , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Database connection events
// mongoose.connection.on('connected', () => {
//   console.log('✅ Connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('MongoDB disconnected');
// });
if (!uri) {
  console.error('❌ MONGODB_URI is not set in .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // 强制 TLS 连接
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error(error.message);
    console.error('💡 Make sure your IP is whitelisted in MongoDB Atlas and your URI is correct.');
    process.exit(1);
  }
};

connectDB();

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

app.use(express.static(path.join(__dirname, "../frontend/build")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// Clean up expired messages every hour
setInterval(async () => {
  try {
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
