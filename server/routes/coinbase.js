import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Generate a session token for Coinbase Pay
// This is a server-side endpoint for security
router.post('/session-token', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    // Generate a secure session token
    // In production, you might want to store this in a database with expiration
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Return the session token
    res.json({
      success: true,
      sessionToken,
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    console.error('Error generating Coinbase session token:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate session token' 
    });
  }
});

export default router;
