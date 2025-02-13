import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone_number } = req.body;
    const newUser = new User({ username, email, password, phone_number, refreshTokens: []  });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    
    const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user }, process.env.REFRESH_KEY, { expiresIn: '30d' });

    // Save the refreshToken to the user document (nếu cần)
    // user.refreshTokens.push({token: refreshToken});
    await user.save();

    // Trả về accessToken, refreshToken và userId
    res.status(201).send({
      userId: user._id,
           // Thêm userId vào phản hồi
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed', error });
  }
});


export default router;