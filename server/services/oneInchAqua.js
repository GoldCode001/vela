import { ethers } from 'ethers';

// 1inch Resolver contract on Polygon
const RESOLVER_ADDRESS = '0x1111111254EEB25477B68fb85Ed929f73A960582';
const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const POLYGON_RPC = 'https://polygon-rpc.com';

// 1inch Fusion+ Pool (Shared Liquidity)
const FUSION_POOL_ADDRESS = '0x111111125421cA6dc452d289314280a0f8842A65'; // Example address

const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);

// Get current APY for USDC pool
export async function getAquaAPY() {
  try {
    // This would call 1inch API to get current APY
    const response = await fetch('https://api.1inch.dev/fusion/quoter/v1.0/137/quote/receive', {
      headers: {
        'Authorization': 'Bearer YOUR_1INCH_API_KEY', // Need to get this
      }
    });
    
    const data = await response.json();
    
    return {
      apy: data.apy || 5.5, // Example fallback
      tvl: data.tvl || 0,
    };
  } catch (error) {
    console.error('Error fetching APY:', error);
    return { apy: 5.5, tvl: 0 }; // Default values
  }
}

// Deposit USDC into Aqua
export async function depositToAqua(privateKey, amount) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // USDC contract
    const usdcContract = new ethers.Contract(
      USDC_ADDRESS,
      ['function approve(address spender, uint256 amount) returns (bool)'],
      wallet
    );
    
    // Approve 1inch to spend USDC
    const amountWei = ethers.utils.parseUnits(amount.toString(), 6); // USDC has 6 decimals
    
    const approveTx = await usdcContract.approve(FUSION_POOL_ADDRESS, amountWei);
    await approveTx.wait();
    
    // Deposit to Fusion Pool
    const poolContract = new ethers.Contract(
      FUSION_POOL_ADDRESS,
      ['function deposit(uint256 amount) returns (bool)'],
      wallet
    );
    
    const depositTx = await poolContract.deposit(amountWei);
    const receipt = await depositTx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      amount: amount,
    };
  } catch (error) {
    console.error('Deposit error:', error);
    throw error;
  }
}

// Withdraw from Aqua
export async function withdrawFromAqua(privateKey, amount) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const poolContract = new ethers.Contract(
      FUSION_POOL_ADDRESS,
      ['function withdraw(uint256 amount) returns (bool)'],
      wallet
    );
    
    const amountWei = ethers.utils.parseUnits(amount.toString(), 6);
    
    const withdrawTx = await poolContract.withdraw(amountWei);
    const receipt = await withdrawTx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      amount: amount,
    };
  } catch (error) {
    console.error('Withdraw error:', error);
    throw error;
  }
}

// Get user's deposited balance
export async function getAquaBalance(walletAddress) {
  try {
    const poolContract = new ethers.Contract(
      FUSION_POOL_ADDRESS,
      ['function balanceOf(address account) view returns (uint256)'],
      provider
    );
    
    const balance = await poolContract.balanceOf(walletAddress);
    const balanceFormatted = ethers.utils.formatUnits(balance, 6);
    
    return parseFloat(balanceFormatted);
  } catch (error) {
    console.error('Balance error:', error);
    return 0;
  }
}