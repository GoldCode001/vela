import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Polygon RPC endpoint - use reliable endpoint
// Ankr is a reliable public RPC that works well
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://rpc.ankr.com/polygon';

// Proxy endpoint for Polygon RPC calls (to avoid CORS issues from browser)
// This forwards JSON-RPC requests from viem to Polygon RPC
router.post('/proxy', async (req, res) => {
  try {
    // Forward the JSON-RPC request directly to Polygon RPC
    const response = await fetch(POLYGON_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Polygon RPC proxy error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      error: {
        code: -32000,
        message: error.message || 'Internal error',
      },
    });
  }
});

export default router;
