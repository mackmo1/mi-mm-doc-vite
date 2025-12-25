import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from "./routes/auth.js";
import branchRoutes from "./routes/branches.js";

// Import database initialization
import initializeDatabase from "./database/init.js";

// Load environment variables
dotenv.config();

// Initialize database
await initializeDatabase();

const server = express();
const port = process.env.PORT || 5000;

// Security middleware
server.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
server.use('/api/', limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
server.use(cors(corsOptions));

// Body parsing middleware
server.use(express.json({ limit: "50mb", extended: true }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check endpoint
server.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: 'PostgreSQL',
        version: '2.0.0'
    });
});

// API documentation endpoint
server.get('/api', (req, res) => {
    res.json({
        message: 'Kh-doc API v2.0 - Multi-User PostgreSQL Edition',
        auth: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me'
        },
        branches: {
            list: 'GET /api/branches/:level (1-5)',
            get: 'GET /api/branches/:level/:id',
            create: 'POST /api/branches/:level',
            update: 'PATCH /api/branches/:level/:id',
            delete: 'DELETE /api/branches/:level/:id'
        },
        note: 'All branch endpoints require authentication',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        health: '/health'
    });
});

// Welcome route
server.get('/', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
            <h1 style="color: #333;">Welcome to Kh-doc API v2.0</h1>
            <p style="color: #666;">Multi-User PostgreSQL-powered documentation API</p>
            <div style="margin: 20px 0;">
                <a href="/health" style="color: #007bff; margin: 0 10px;">Health Check</a>
                <a href="/api" style="color: #007bff; margin: 0 10px;">API Info</a>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Authentication:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><code>POST /api/auth/register</code> - Register new user</li>
                    <li><code>POST /api/auth/login</code> - Login</li>
                    <li><code>GET /api/auth/me</code> - Get current user</li>
                </ul>
                <h3>Branch Endpoints (require auth):</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><code>GET /api/branches/:level</code> - List branches (level 1-5)</li>
                    <li><code>GET /api/branches/:level/:id</code> - Get branch</li>
                    <li><code>POST /api/branches/:level</code> - Create branch</li>
                    <li><code>PATCH /api/branches/:level/:id</code> - Update branch</li>
                    <li><code>DELETE /api/branches/:level/:id</code> - Delete branch</li>
                </ul>
            </div>
        </div>
    `);
});

// API routes
server.use("/api/auth", authRoutes);
server.use("/api/branches", branchRoutes);

// 404 handler
server.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: [
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/me',
            '/api/branches/:level (1-5)',
            '/api/branches/:level/:id',
            '/health'
        ]
    });
});

// Global error handler
server.use((error, req, res, next) => {
    console.error('❌ Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 Health check: http://localhost:${port}/health`);
    console.log(`🌐 API base URL: http://localhost:${port}/api`);
    console.log(`📚 API documentation: http://localhost:${port}/api`);
    console.log(`🔐 Auth endpoints:`);
    console.log(`   - POST /api/auth/register`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET /api/auth/me`);
    console.log(`📝 Branch endpoints (require auth):`);
    console.log(`   - GET/POST /api/branches/:level`);
    console.log(`   - GET/PATCH/DELETE /api/branches/:level/:id`);
});

export default server;
