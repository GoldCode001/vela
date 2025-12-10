import express from 'express';
import { addFunds } from '../services/balance.js';

const router = express.Router();

// Ramp webhook to credit user balance when purchase completes
router.post('/ramp-webhook', async (req, res) => {
  try {
    const { type, purchase } = req.body;
    
    console.log('Ramp webhook received:', type, purchase);
    
    if (type === 'RELEASED') {
      // Payment successful - credit user's balance
      const { receiverAddress, cryptoAmount, asset } = purchase;
      
      // Convert crypto amount to USD (USDC is 1:1 with USD)
      const amountUSD = parseFloat(cryptoAmount);
      
      await addFunds(receiverAddress, amountUSD);
      
      console.log(`Credited ${amountUSD} to ${receiverAddress}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;