import { ClobClient } from '@polymarket/clob-client';
import { createWalletClient, http, parseUnits } from 'viem';
import { polygon } from 'viem/chains';

// Polymarket CLOB endpoint
const CLOB_API_URL = 'https://clob.polymarket.com';

// Initialize CLOB client
export function initializeClobClient(privateKey) {
  const walletClient = createWalletClient({
    chain: polygon,
    transport: http(),
    account: privateKey,
  });

  return new ClobClient(
    CLOB_API_URL,
    polygon.id,
    walletClient
  );
}

// Get current market price
export async function getMarketPrice(tokenId) {
  try {
    const response = await fetch(`${CLOB_API_URL}/book?token_id=${tokenId}`);
    const data = await response.json();
    
    if (!data || !data.bids || data.bids.length === 0) {
      throw new Error('No price data available');
    }
    
    // Return best bid price
    return {
      price: data.bids[0].price,
      size: data.bids[0].size,
    };
  } catch (error) {
    console.error('Error fetching market price:', error);
    throw error;
  }
}

// Place a market buy order
export async function placeBuyOrder(clobClient, marketData, outcome, amountUSD) {
  try {
    // Get the token ID for the outcome (0 = Yes, 1 = No)
    const tokenId = marketData.tokens[outcome];
    
    // Get current price
    const priceData = await getMarketPrice(tokenId);
    const price = parseFloat(priceData.price);
    
    // Calculate how many shares to buy
    const shares = amountUSD / price;
    
    // Create order
    const order = {
      tokenID: tokenId,
      price: price.toString(),
      size: shares.toString(),
      side: 'BUY',
      feeRateBps: '0', // Fee in basis points
    };
    
    console.log('Placing order:', order);
    
    // Submit order to CLOB
    const result = await clobClient.createOrder(order);
    
    return {
      success: true,
      orderId: result.orderID,
      price: price,
      shares: shares,
      cost: amountUSD,
    };
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

// Get user's positions
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

// Calculate potential payout
export function calculatePayout(shares, outcomePrice) {
  // If outcome wins, each share pays out $1
  // Current value = shares * current_price
  // Payout = shares * $1
  // Profit = payout - cost
  return {
    payout: shares,
    currentValue: shares * parseFloat(outcomePrice),
    profit: shares - (shares * parseFloat(outcomePrice)),
  };
}