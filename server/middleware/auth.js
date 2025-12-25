/**
 * Authentication Middleware
 * JWT verification and user injection into request
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Middleware to verify JWT token and attach user to request
 * Expects: Authorization: Bearer <token>
 */
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'No token provided' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'Invalid token format' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user info to request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired',
                message: 'Please log in again' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token',
                message: 'Token verification failed' 
            });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            error: 'Authentication error',
            message: 'An error occurred during authentication' 
        });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token, just doesn't attach user
 * Useful for routes that work with or without authentication
 */
export const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email
                };
            }
        }
        
        next();
    } catch (error) {
        // Silently continue without user - token was invalid but that's okay
        next();
    }
};

/**
 * Generate JWT token for a user
 * @param {object} user - User object with id, username, email
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn }
    );
};

export default authMiddleware;

