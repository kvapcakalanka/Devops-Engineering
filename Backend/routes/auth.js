const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ fullName, email, password });
    await newUser.save();
    
    // Return user data and token (simplified - in production use JWT)
    res.status(201).json({ 
      message: 'User created',
      user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
      token: 'mock-token-' + newUser._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ 
      message: 'Login success',
      user: { id: user._id, fullName: user.fullName, email: user.email },
      token: 'mock-token-' + user._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
