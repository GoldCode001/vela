import { ClobClient } from '@polymarket/clob-client';
import { ethers } from 'ethers';

const CLOB_API_URL = 'https://clob.polymarket.com';
const POLYGON_RPC = 'https://polygon-rpc.com';

// Initialize CLOB client with user's private key
export function createClobClient(privateKey) {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);
    const signer = wallet.connect(provider);

    return new ClobClient(
      CLOB_API_URL,
      137, // Polygon chain ID
      signer
    );
  } catch (error) {
    console.error('Error creating CLOB client:', error);
    throw error;
  }
}

// Get market orderbook
export async function getOrderBook(tokenId) {
  try {
    const response = await fetch(`${CLOB_API_URL}/book?token_id=${tokenId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    throw error;
  }
}

// Place market buy order
export async function placeBuyOrder(clobClient, tokenId, amountUSD) {
  try {
    // Get current best price
    const orderbook = await getOrderBook(tokenId);
    
    if (!orderbook || !orderbook.asks || orderbook.asks.length === 0) {
      throw new Error('No liquidity available for this market');
    }
    
    const bestAsk = parseFloat(orderbook.asks[0].price);
    
    // Calculate shares to buy
    const shares = amountUSD / bestAsk;
    
    console.log(`📊 Placing order: ${shares.toFixed(4)} shares at $${bestAsk}`);
    
    const order = {
      tokenID: tokenId,
      price: bestAsk.toString(),
      size: shares.toString(),
      side: 'BUY',
      feeRateBps: '0',
    };
    
    const result = await clobClient.createOrder(order);
    
    console.log('✅ Order placed:', result);
    
    return {
      orderId: result.orderID,
      price: bestAsk,
      shares: shares,
      cost: amountUSD,
    };
  } catch (error) {
    console.error('❌ Order failed:', error);
    throw error;
  }
}