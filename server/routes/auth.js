import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Please provide all required information' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        error: 'User exists',
        message: 'Email is already registered' 
      });
    }
    
    const user = new User({ name, email, password, userType });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'Failed to create account. Please try again.' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Please provide all required information' 
      });
    }
    
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }
    
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'Failed to log in. Please try again.' 
    });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token',
        message: 'Authorization token is required' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User no longer exists' 
      });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Please log in again' 
    });
  }
});

export default router;