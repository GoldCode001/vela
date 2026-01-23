import { createPublicClient, http, formatUnits } from 'viem';
import { base, polygon } from 'viem/chains';

// USDC contract on Base
const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC contract on Polygon (for prediction wallet)
const POLYGON_USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

// Create public clients for reading blockchain
const baseClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

// Use a reliable Polygon RPC endpoint
const polygonClient = createPublicClient({
  chain: polygon,
  transport: http('https://polygon.llamarpc.com'), // Reliable public RPC
});

// Get USDC balance from Base blockchain
export async function getUSDCBalance(walletAddress) {
  try {
    const balance = await baseClient.readContract({
      address: BASE_USDC_ADDRESS,
      abi: [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: 'balance', type: 'uint256' }],
        },
      ],
      functionName: 'balanceOf',
      args: [walletAddress],
    });

    // Convert from wei to USDC (6 decimals)
    const balanceInUSDC = formatUnits(balance, USDC_DECIMALS);
    return parseFloat(balanceInUSDC);
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return 0;
  }
}

// Get Polygon USDC balance (for prediction wallet)
export async function getPolygonUSDCBalance(walletAddress) {
  try {
    const balance = await polygonClient.readContract({
      address: POLYGON_USDC_ADDRESS,
      abi: [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: 'balance', type: 'uint256' }],
        },
      ],
      functionName: 'balanceOf',
      args: [walletAddress],
    });

    // Convert from wei to USDC (6 decimals)
    const balanceInUSDC = formatUnits(balance, USDC_DECIMALS);
    return parseFloat(balanceInUSDC);
  } catch (error) {
    console.error('Error fetching Polygon USDC balance:', error);
    return 0;
  }
}

// Get native ETH balance on Base (for gas fees)
export async function getETHBalance(walletAddress) {
  try {
    const balance = await baseClient.getBalance({
      address: walletAddress,
    });

    const balanceInETH = formatUnits(balance, 18);
    return parseFloat(balanceInETH);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return 0;
  }
}