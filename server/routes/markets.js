import express from 'express';
import { getHotMarkets } from '../services/polymarket.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const markets = await getHotMarkets();
    res.json({ success: true, markets });
  } catch (error) {
    console.error('Error in markets route:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch markets' });
  }
});

export default router;