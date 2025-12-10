import { createPublicClient, http, formatUnits } from 'viem';
import { polygon } from 'viem/chains';

// USDC contract on Polygon
const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

// Create public client for reading blockchain
const publicClient = createPublicClient({
  chain: polygon,
  transport: http('https://polygon-rpc.com'),
});

// Get USDC balance from blockchain
export async function getUSDCBalance(walletAddress) {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
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

// Get native MATIC balance (for gas fees)
export async function getMATICBalance(walletAddress) {
  try {
    const balance = await publicClient.getBalance({
      address: walletAddress,
    });

    const balanceInMATIC = formatUnits(balance, 18);
    return parseFloat(balanceInMATIC);
  } catch (error) {
    console.error('Error fetching MATIC balance:', error);
    return 0;
  }
}