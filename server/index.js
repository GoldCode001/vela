import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import marketsRouter from './routes/markets.js';
import betsRouter from './routes/bets.js';
import aaveRouter from './routes/aave.js';
import aiTutorRouter from './routes/aiTutor.js';
import bridgeRouter from './routes/bridge.js';
import polygonRpcRouter from './routes/polygon-rpc.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: [
    'https://vela-app.up.railway.app',
    'https://vela-goldman.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check - MUST respond quickly
app.get('/health', (req, res) => {
  console.log('Health check hit');
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vela API',
    version: '1.0.0',
    endpoints: ['/health', '/api/markets', '/api/bets', '/api/aave', '/api/ai-tutor', '/api/bridge']
  });
});

// API routes
app.use('/api/markets', marketsRouter);
app.use('/api/bets', betsRouter);
app.use('/api/aave', aaveRouter); 
app.use('/api/ai-tutor', aiTutorRouter);
app.use('/api/bridge', bridgeRouter);
app.use('/api/polygon-rpc', polygonRpcRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
