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
    // viem sends requests as an array or single object
    const requestBody = Array.isArray(req.body) ? req.body : [req.body];
    
    // Forward the JSON-RPC request directly to Polygon RPC
    const response = await fetch(POLYGON_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Polygon RPC returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return in the same format viem expects (array or single object)
    res.json(Array.isArray(req.body) ? data : (Array.isArray(data) ? data[0] : data));
  } catch (error) {
    console.error('Polygon RPC proxy error:', error);
    const requestId = Array.isArray(req.body) ? (req.body[0]?.id || 1) : (req.body?.id || 1);
    res.status(500).json({
      jsonrpc: '2.0',
      id: requestId,
      error: {
        code: -32000,
        message: error.message || 'Internal error',
      },
    });
  }
});

export default router;
