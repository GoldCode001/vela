import { ClobClient } from '@polymarket/clob-client';
import { ethers } from 'ethers';

const CLOB_API_URL = 'https://clob.polymarket.com';
const POLYGON_RPC = 'https://polygon-rpc.com';

// Initialize CLOB client with user's private key
export function createClobClient(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);
  const signer = wallet.connect(provider);

  return new ClobClient(
    CLOB_API_URL,
    137, // Polygon chain ID
    signer
  );
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
export async function placeBuyOrder(clobClient, tokenId, amount, price) {
  try {
    // Calculate shares to buy
    const shares = amount / price;
    
    const order = {
      tokenID: tokenId,
      price: price.toString(),
      size: shares.toString(),
      side: 'BUY',
      feeRateBps: '0',
    };
    
    console.log('📝 Creating order:', order);
    
    const result = await clobClient.createOrder(order);
    
    console.log('✅ Order placed:', result);
    
    return {
      orderId: result.orderID,
      price: price,
      shares: shares,
      cost: amount,
    };
  } catch (error) {
    console.error('❌ Order failed:', error);
    throw error;
  }
}

// Get user's positions from Polymarket
export async function getUserPositions(walletAddress) {
  try {
    const response = await fetch(`${CLOB_API_URL}/positions?user=${walletAddress}`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
}