import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import branch1Routes from "./routes/branches1.js";
import branch2Routes from "./routes/branches2.js";
import branch3Routes from "./routes/branches3.js";
import branch4Routes from "./routes/branches4.js";
import branch5Routes from "./routes/branches5.js";

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
        message: 'Kh-doc API v2.0 - PostgreSQL Edition',
        endpoints: {
            branches1: '/api/branches1',
            branches2: '/api/branches2',
            branches3: '/api/branches3',
            branches4: '/api/branches4',
            branches5: '/api/branches5'
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        health: '/health'
    });
});

// Welcome route
server.get('/', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
            <h1 style="color: #333;">Welcome to Kh-doc API v2.0</h1>
            <p style="color: #666;">PostgreSQL-powered documentation API</p>
            <div style="margin: 20px 0;">
                <a href="/health" style="color: #007bff; margin: 0 10px;">Health Check</a>
                <a href="/api" style="color: #007bff; margin: 0 10px;">API Info</a>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Available Endpoints:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><code>GET/POST /api/branches1</code></li>
                    <li><code>GET/PATCH/DELETE /api/branches1/:id</code></li>
                    <li><code>GET/POST /api/branches2</code></li>
                    <li><code>GET/PATCH/DELETE /api/branches2/:id</code></li>
                    <li><code>GET/POST /api/branches3</code></li>
                    <li><code>GET/PATCH/DELETE /api/branches3/:id</code></li>
                    <li><code>GET/POST /api/branches4</code></li>
                    <li><code>GET/PATCH/DELETE /api/branches4/:id</code></li>
                    <li><code>GET/POST /api/branches5</code></li>
                    <li><code>GET/PATCH/DELETE /api/branches5/:id</code></li>
                </ul>
            </div>
        </div>
    `);
});

// API routes
server.use("/api/branches1", branch1Routes);
server.use("/api/branches2", branch2Routes);
server.use("/api/branches3", branch3Routes);
server.use("/api/branches4", branch4Routes);
server.use("/api/branches5", branch5Routes);

// 404 handler
server.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: [
            '/api/branches1',
            '/api/branches2', 
            '/api/branches3',
            '/api/branches4',
            '/api/branches5',
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
    console.log(`🎯 Available endpoints:`);
    console.log(`   - GET/POST http://localhost:${port}/api/branches1`);
    console.log(`   - GET/POST http://localhost:${port}/api/branches2`);
    console.log(`   - GET/POST http://localhost:${port}/api/branches3`);
    console.log(`   - GET/POST http://localhost:${port}/api/branches4`);
    console.log(`   - GET/POST http://localhost:${port}/api/branches5`);
});

export default server;
