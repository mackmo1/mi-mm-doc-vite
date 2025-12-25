/**
 * Authentication Routes
 * Register, Login, and Get Current User endpoints
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { authMiddleware, generateToken } from '../middleware/auth.js';
import { 
    createUser, 
    findUserByEmail, 
    findUserByUsername, 
    findUserById 
} from '../models/User.js';
import { createUserTables } from '../models/User.js';
import { isValidUsername, isValidEmail } from '../utils/tableHelper.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user and create their branch tables
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: 'Validation error',
                message: 'Username, email, and password are required' 
            });
        }
        
        // Validate username format
        if (!isValidUsername(username)) {
            return res.status(400).json({ 
                error: 'Validation error',
                message: 'Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores' 
            });
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                error: 'Validation error',
                message: 'Please provide a valid email address' 
            });
        }
        
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Validation error',
                message: 'Password must be at least 6 characters' 
            });
        }
        
        // Check if email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ 
                error: 'Conflict',
                message: 'Email already registered' 
            });
        }
        
        // Check if username already exists
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ 
                error: 'Conflict',
                message: 'Username already taken' 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create user in database
        const user = await createUser(username, email, passwordHash);
        
        // Create user's branch tables
        await createUserTables(username);
        
        // Generate JWT token
        const token = generateToken(user);
        
        console.log(`✅ New user registered: ${username} (${email})`);
        
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: 'Registration failed. Please try again.' 
        });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Validation error',
                message: 'Email and password are required' 
            });
        }
        
        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Authentication failed',
                message: 'Invalid email or password' 
            });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Authentication failed',
                message: 'Invalid email or password' 
            });
        }
        
        // Generate JWT token
        const token = generateToken(user);
        
        console.log(`✅ User logged in: ${user.username}`);
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: 'Login failed. Please try again.' 
        });
    }
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Not found',
                message: 'User not found' 
            });
        }
        
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
            }
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: 'Failed to get user info' 
        });
    }
});

export default router;

