import express from 'express';
import { bridgeUSDCToPolygon, checkBridgeStatus } from '../services/bridge.js';
import { getOrCreatePolygonWallet, getPolygonPrivateKey } from '../services/wallet-manager.js';

const router = express.Router();

// Bridge Base USDC to Polygon USDC
router.post('/base-to-polygon', async (req, res) => {
  try {
    const { walletAddress, amount, privateKey } = req.body;
    
    if (!walletAddress || !amount || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: walletAddress, amount, privateKey',
      });
    }

    const bridgeAmount = parseFloat(amount);
    if (bridgeAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    // Get or create Polygon wallet for recipient
    const polygonAddress = await getOrCreatePolygonWallet(walletAddress);
    
    // Execute bridge
    const result = await bridgeUSDCToPolygon(privateKey, bridgeAmount, polygonAddress);
    
    res.json({
      success: true,
      ...result,
      polygonAddress,
    });
  } catch (error) {
    console.error('Bridge route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to bridge USDC',
    });
  }
});

// Check bridge transaction status
router.get('/status/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const { chainId } = req.query; // 137 for Polygon, 8453 for Base
    
    if (!txHash) {
      return res.status(400).json({
        success: false,
        error: 'Transaction hash required',
      });
    }

    const status = await checkBridgeStatus(txHash, parseInt(chainId) || 137);
    
    res.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error('Bridge status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check bridge status',
    });
  }
});

export default router;
