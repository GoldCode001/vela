import express from 'express';
import { supabase } from '../config/supabase.js';
import { createClobClient, placeBuyOrder } from '../services/polymarket-trading.js';
import { getPolygonPrivateKey } from '../services/wallet-manager.js';

const router = express.Router();

router.post('/place', async (req, res) => {
  try {
    const { walletAddress, marketId, marketQuestion, outcome, amount, privateKey, tokenIds } = req.body;
    
    if (!walletAddress || !marketId || outcome === undefined || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const betAmount = parseFloat(amount);
    
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    let tradeResult = null;
    let entryPrice = 0.50;
    let shares = betAmount / entryPrice;

    // Get Polygon wallet private key for this user
    // Note: In production, the frontend should use the Polygon wallet's private key
    // For now, we'll get it from the wallet manager
    let polygonPrivateKey = privateKey; // Fallback to provided key
    
    try {
      const storedPolygonKey = await getPolygonPrivateKey(walletAddress);
      if (storedPolygonKey) {
        polygonPrivateKey = storedPolygonKey;
        console.log('✅ Using Polygon wallet for trade');
      }
    } catch (err) {
      console.log('⚠️ Could not get Polygon wallet, using provided key');
    }

    // Execute REAL trade if private key and tokens provided
    if (polygonPrivateKey && tokenIds && tokenIds.length > 0) {
      try {
        console.log('🚀 Executing REAL Polymarket trade on Polygon...');
        
        const tokenId = tokenIds[outcome];
        
        if (!tokenId) {
          throw new Error('Token ID not found for selected outcome');
        }
        
        // Initialize CLOB client with Polygon private key
        const clobClient = createClobClient(polygonPrivateKey);
        
        // Place buy order
        tradeResult = await placeBuyOrder(clobClient, tokenId, betAmount);
        
        entryPrice = tradeResult.price;
        shares = tradeResult.shares;
        
        console.log('✅ REAL TRADE EXECUTED:', tradeResult);
      } catch (tradeError) {
        console.error('❌ Trade execution failed:', tradeError);
        return res.status(500).json({
          success: false,
          error: `Trade failed: ${tradeError.message}`,
        });
      }
    } else {
      console.log('⚠️ SIMULATED TRADE (missing privateKey or tokens)');
    }
    
    // Record position in database
    await supabase
      .from('positions')
      .insert({
        user_id: user.id,
        market_id: marketId,
        market_question: marketQuestion,
        side: outcome === 0 ? 'yes' : 'no',
        amount_usd: betAmount,
        shares: shares,
        entry_price: entryPrice,
        current_price: entryPrice,
        status: 'active',
        order_id: tradeResult?.orderId || null,
      });
    
    res.json({ 
      success: true,
      message: tradeResult ? 'Real bet placed on Polymarket!' : 'Bet placed (simulated)',
      trade: {
        shares: shares.toFixed(4),
        entryPrice: entryPrice.toFixed(4),
        real: !!tradeResult,
        orderId: tradeResult?.orderId,
      }
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to place bet' 
    });
  }
});

// Get user positions
router.get('/positions/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!user) {
      return res.json({ success: true, positions: [] });
    }
    
    const { data: positions } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    res.json({ 
      success: true, 
      positions: positions || [] 
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch positions' 
    });
  }
});

export default router;