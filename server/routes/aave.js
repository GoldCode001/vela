import express from 'express';
import { getAaveAPY, depositToAave, withdrawFromAave, getAaveBalance } from '../services/aave.js';

const router = express.Router();

// Get current APY
router.get('/apy', async (req, res) => {
  try {
    const data = await getAaveAPY();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's Aave balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await getAaveBalance(address);
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deposit to Aave
router.post('/deposit', async (req, res) => {
  try {
    const { privateKey, amount } = req.body;
    
    if (!privateKey || !amount) {
      return res.status(400).json({ success: false, error: 'Missing privateKey or amount' });
    }
    
    const result = await depositToAave(privateKey, amount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Withdraw from Aave
router.post('/withdraw', async (req, res) => {
  try {
    const { privateKey, amount } = req.body;
    
    if (!privateKey || !amount) {
      return res.status(400).json({ success: false, error: 'Missing privateKey or amount' });
    }
    
    const result = await withdrawFromAave(privateKey, amount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;