import { ethers } from 'ethers';

// Socket API for cross-chain bridging
const SOCKET_API_KEY = process.env.SOCKET_API_KEY;
const SOCKET_API_URL = 'https://api.socket.tech/v2';

// Base and Polygon RPCs
const BASE_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://polygon-rpc.publicnode.com';

// Contract addresses
const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const POLYGON_USDC = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

// Minimum reserved balance
const MIN_RESERVED_BALANCE = 1.0;

const baseProvider = new ethers.providers.JsonRpcProvider(BASE_RPC);
const polygonProvider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);

// ERC20 ABI for balance checks
const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

// Bridge USDC from Base to Polygon
export async function bridgeUSDCToPolygon(basePrivateKey, amount, recipientAddress) {
  try {
    const baseWallet = new ethers.Wallet(basePrivateKey, baseProvider);
    
    // 1. Check Base USDC balance
    const usdcContract = new ethers.Contract(BASE_USDC, ERC20_ABI, baseProvider);
    const balance = await usdcContract.balanceOf(baseWallet.address);
    const balanceFormatted = parseFloat(ethers.utils.formatUnits(balance, 6));
    
    // 2. Validate available balance (respects $1 reserve)
    const availableBalance = balanceFormatted - MIN_RESERVED_BALANCE;
    if (amount > availableBalance) {
      throw new Error(`Insufficient balance. Available: $${availableBalance.toFixed(2)} (Total: $${balanceFormatted.toFixed(2)}, $${MIN_RESERVED_BALANCE} reserved for fees)`);
    }

    // 3. Get quote from Socket API
    const quoteResponse = await fetch(
      `${SOCKET_API_URL}/quote?fromChainId=8453&toChainId=137&fromTokenAddress=${BASE_USDC}&toTokenAddress=${POLYGON_USDC}&fromAmount=${ethers.utils.parseUnits(amount.toString(), 6).toString()}&userAddress=${baseWallet.address}`,
      {
        headers: {
          'API-KEY': SOCKET_API_KEY,
        },
      }
    );

    if (!quoteResponse.ok) {
      throw new Error('Failed to get bridge quote');
    }

    const quote = await quoteResponse.json();

    // 4. Approve USDC on Base (if needed)
    const usdcContractWithSigner = new ethers.Contract(BASE_USDC, ERC20_ABI, baseWallet);
    const amountWei = ethers.utils.parseUnits(amount.toString(), 6);
    
    const currentAllowance = await usdcContractWithSigner.allowance(
      baseWallet.address,
      quote.result.route.userTxs[0].steps[0].approvalData.allowanceTarget
    );

    if (currentAllowance.lt(amountWei)) {
      console.log('Approving USDC for bridge...');
      const approveTx = await usdcContractWithSigner.approve(
        quote.result.route.userTxs[0].steps[0].approvalData.allowanceTarget,
        amountWei
      );
      await approveTx.wait();
      console.log('Approved!');
    }

    // 5. Execute bridge transaction
    // Note: Socket API provides transaction data that needs to be executed
    // This is a simplified version - actual implementation requires handling the transaction data from Socket
    
    // For now, return the quote data - the actual transaction execution would happen via Socket's transaction builder
    return {
      success: true,
      quote: quote.result,
      estimatedTime: quote.result.route.estimatedTime || 180, // seconds
      message: 'Bridge transaction prepared. Execute via Socket transaction builder.',
    };
  } catch (error) {
    console.error('Bridge error:', error);
    throw new Error(error.message || 'Failed to bridge USDC');
  }
}

// Check bridge transaction status
export async function checkBridgeStatus(txHash, chainId) {
  try {
    const provider = chainId === 137 ? polygonProvider : baseProvider;
    const receipt = await provider.getTransactionReceipt(txHash);
    
    return {
      success: receipt !== null,
      confirmed: receipt !== null && receipt.status === 1,
      blockNumber: receipt?.blockNumber,
    };
  } catch (error) {
    console.error('Error checking bridge status:', error);
    return {
      success: false,
      confirmed: false,
    };
  }
}
