import express from 'express';
import { Coinbase } from '@coinbase/coinbase-sdk';
// TODO: Re-enable auth once Privy package issue is resolved
// import { verifyPrivyToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Coinbase SDK with CDP API credentials
let coinbase = null;

function initCoinbase() {
  if (!coinbase) {
    const apiKeyName = process.env.CDP_API_KEY_NAME;
    const privateKey = process.env.CDP_API_PRIVATE_KEY;

    if (!apiKeyName || !privateKey) {
      throw new Error('CDP API credentials not configured');
    }

    coinbase = Coinbase.configure({
      apiKeyName,
      privateKey,
    });
  }
  return coinbase;
}

// Generate session token for Coinbase Onramp
// TODO: Re-enable auth once Privy package issue is resolved
router.post('/session-token', async (req, res) => {
  try {
    const { walletAddress, network = 'base', asset = 'USDC' } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    initCoinbase();

    // Generate onramp session token using CDP SDK
    const url = await Coinbase.createOnrampUrl({
      addresses: { [walletAddress]: [network] },
      assets: [asset],
    });

    res.json({ url });
  } catch (error) {
    console.error('Error generating Coinbase session:', error);
    res.status(500).json({
      error: 'Failed to generate session token',
      details: error.message
    });
  }
});

export default router;
