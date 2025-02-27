const express = require('express');
const Message = require('../models/messageModel'); // Adjust the path to your model

const router = express.Router();

// Create a new message
router.post('/', async (req, res) => {
  const { name, email, contact, message } = req.body;

  if (!name || !email || !contact || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newMessage = await Message.create({ name, email, contact, message });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error creating message:", err);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;