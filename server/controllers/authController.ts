import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Goal } from '../models/Goal';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'nutrition_secret_key_123';

const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: emailLower,
      passwordHash,
    });

    // Auto-create a default profile
    await Profile.create({
      userId: newUser._id,
      name: newUser.name,
      age: 25,
      gender: 'Other',
      height: 170,
      weight: 70,
      goal: 'Maintain Weight',
    });

    // Auto-create a default weight goal
    await Goal.create({
      userId: newUser._id,
      type: 'Maintain Weight',
      currentWeight: 70,
      targetWeight: 70,
      dailyCalorieTarget: 2000,
      dailyProteinTarget: 130,
      dailyCarbsTarget: 220,
      dailyFatTarget: 65,
    });

    const token = generateToken(newUser._id, newUser.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    const goal = await Goal.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      profile,
      goal,
    });
  } catch (error: any) {
    console.error('getMe Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching user details' });
  }
};
