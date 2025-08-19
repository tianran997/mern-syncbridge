import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(__dirname, '../uploads', req.user.username);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /txt|pdf|png|jpg|jpeg|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Get messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const formattedMessages = messages.map(msg => ({
      type: msg.type,
      content: msg.type === 'text' ? msg.content : null,
      filename: msg.type === 'file' ? `${req.user.username}/${msg.content}` : null,
      timestamp: msg.createdAt.getTime() / 1000
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send text message
router.post('/text', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message content required' });
    }

    const newMessage = new Message({
      userId: req.user._id,
      type: 'text',
      content: message.trim()
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newMessage = new Message({
      userId: req.user._id,
      type: 'file',
      content: req.file.filename
    });

    await newMessage.save();
    res.status(201).json({ message: 'File uploaded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all messages
router.delete('/clear', auth, async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.user._id });
    res.json({ message: 'All messages cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
