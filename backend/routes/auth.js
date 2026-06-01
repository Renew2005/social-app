const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');      // For hashing passwords
const jwt = require('jsonwebtoken');     // For creating login tokens
const User = require('../models/User'); // Our User blueprint

// ─────────────────────────────────────────
// SIGNUP ROUTE — POST /api/auth/signup
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // 3. Hash the password (never store plain text!)
    // 10 = how strong the hashing is (10 is standard)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user in database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save to MongoDB

    // 5. Create a JWT token so user is logged in immediately after signup
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    // 6. Send back token and basic user info
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ─────────────────────────────────────────
// LOGIN ROUTE — POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Send back token and user info
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;