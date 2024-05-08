const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { userSchema, loginSchema } = require('../validation/userValidation');
const { z } = require('zod');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User registration with Zod validation
router.post('/register', async (req, res) => {
  try {
    userSchema.parse(req.body); // Validate using Zod

    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = new User({ username, password }); // Use the new password
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login with Zod validation
router.post('/login', async (req, res) => {
  try {
    loginSchema.parse(req.body); // Validate using Zod

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) { // Password validation replaced bcryptjs
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
