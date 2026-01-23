import express from 'express';
import { ethers } from 'ethers';

const router = express.Router();

// Polygon RPC endpoint (use environment variable or reliable public endpoint)
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://polygon.llamarpc.com';

// Proxy endpoint for Polygon RPC calls (to avoid CORS issues from browser)
router.post('/proxy', async (req, res) => {
  try {
    const { method, params } = req.body;

    if (!method) {
      return res.status(400).json({ error: 'Method is required' });
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);

    // Handle different RPC methods
    let result;
    switch (method) {
      case 'eth_call':
        result = await provider.call({
          to: params[0].to,
          data: params[0].data,
        }, params[1] || 'latest');
        break;
      case 'eth_getBalance':
        result = await provider.getBalance(params[0], params[1] || 'latest');
        break;
      case 'eth_blockNumber':
        result = await provider.getBlockNumber();
        break;
      default:
        // For other methods, use send directly
        result = await provider.send(method, params || []);
    }

    res.json({
      jsonrpc: '2.0',
      id: req.body.id || 1,
      result: result,
    });
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
