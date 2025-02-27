const express = require('express');
const User = require('../models/userModel');
const jwtUtil = require('../utils/jwtUtil');
const bcrypt = require('bcrypt');

const router = express.Router();

// Generate a customer ID
function generateCustomerId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `C${randomNum}`;
}

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll(); 
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Signup route for user registration
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer_id = generateCustomerId();
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ customer_id, email, password: hashedPassword });
    res.json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user&& (await bcrypt.compare(password, user.password))) {
      // Generate the token after successful login
      const token = jwtUtil.generateToken(user); // Generate the token	
      res.json({
        message: 'Login successful',
        customer_id: user.customer_id,
        email: user.email,
        token: token, // Sending the token in the response	
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a user by customer_id
router.delete('/:customer_id', async (req, res) => {
  const { customer_id } = req.params;
  try {
    const user = await User.findOne({ where: { customer_id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: `User with customer_id ${customer_id} deleted successfully.`, user });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Route to update password
router.put('/update-password', async (req, res) => {
  try {
    const { customer_id, currentPassword, newPassword } = req.body;
    // Find user by customer_id
    const user = await User.findOne({ where: { customer_id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;