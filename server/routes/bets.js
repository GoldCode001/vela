import express from 'express';
import { supabase } from '../config/supabase.js';
import { createClobClient, getOrderBook, placeBuyOrder } from '../services/polymarket-trading.js';

const router = express.Router();

router.post('/place', async (req, res) => {
  try {
    const { walletAddress, marketId, marketQuestion, outcome, amount, privateKey, tokenIds } = req.body;
    
    // Validate inputs
    if (!walletAddress || !marketId || outcome === undefined || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const betAmount = parseFloat(amount);
    
    // Get user from database
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
    let entryPrice = 0.50; // Default
    let shares = betAmount / entryPrice;

    // Execute real trade if private key provided
    if (privateKey && tokenIds && tokenIds.length > 0) {
      try {
        console.log('🚀 Executing real trade...');
        
        const tokenId = tokenIds[outcome]; // Get token for selected outcome
        
        // Initialize CLOB client
        const clobClient = createClobClient(privateKey);
        
        // Get current market price
        const orderbook = await getOrderBook(tokenId);
        
        if (!orderbook || !orderbook.bids || orderbook.bids.length === 0) {
          throw new Error('No liquidity available');
        }
        
        const currentPrice = parseFloat(orderbook.bids[0].price);
        
        // Place buy order
        tradeResult = await placeBuyOrder(
          clobClient,
          tokenId,
          betAmount,
          currentPrice
        );
        
        entryPrice = tradeResult.price;
        shares = tradeResult.shares;
        
        console.log('✅ REAL TRADE EXECUTED:', tradeResult);
      } catch (tradeError) {
        console.error('❌ Trade failed:', tradeError);
        return res.status(500).json({
          success: false,
          error: 'Trade execution failed: ' + tradeError.message,
        });
      }
    } else {
      console.log('⚠️ SIMULATED TRADE (no private key)');
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
      message: 'Bet placed successfully!',
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