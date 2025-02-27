const express = require('express');
const Admin = require('../models/adminModel');
const jwtUtil = require('../utils/jwtUtil');

const router = express.Router();

// Get all admins
router.get('/', async (req, res) => {
  try {
    const users = await Admin.findAll(); 
    res.json(users);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email, password } });

    if (admin) {
      // Generate the token after successful login
      const token = jwtUtil.generateToken(admin); // Generate the token for the admin

      res.json({
        message: 'Admin login successful',
        email: admin.email,
        token: token, // Sending the token in the response
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;