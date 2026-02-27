const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { startScheduler } = require('./services/scheduler');

const app = express();

// Connect to Database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request Logging (Development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'SocialPulse AI Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'SocialPulse AI API',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      ai: '/api/ai',
      accounts: '/api/accounts',
      analytics: '/api/analytics'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/analytics', require('./routes/analytics'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8001;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║     🚀 SocialPulse AI Backend Server         ║
║                                                ║
║     Environment: ${process.env.NODE_ENV || 'development'}                    ║
║     Port: ${PORT}                               ║
║     Database: MongoDB                          ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
  
  // Start post scheduler
  startScheduler();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
