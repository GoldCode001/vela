import { ethers } from 'ethers';

// Aave V3 on Polygon
const AAVE_POOL_ADDRESS = '0x794a61358D6845594F94dc1DB02A252b5b4814aD';
const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const aUSDC_ADDRESS = '0x625E7708f30cA75bfd92586e17077590C60eb4cD'; // Aave interest-bearing USDC
const POLYGON_RPC = 'https://polygon-rpc.com';

const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);

// Pool ABI (simplified - only functions we need)
const POOL_ABI = [
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function withdraw(address asset, uint256 amount, address to) returns (uint256)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

// Get current USDC APY from Aave
export async function getAaveAPY() {
  try {
    const response = await fetch('https://aave-api-v2.aave.com/data/rates-history?reserveId=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359137');
    const data = await response.json();
    
    // Get latest supply APY
    const latestRate = data[data.length - 1];
    const apy = parseFloat(latestRate.liquidityRate) / 1e25; // Convert from Ray units
    
    return {
      apy: apy.toFixed(2),
      totalSupplied: latestRate.totalLiquidity || 0,
    };
  } catch (error) {
    console.error('Error fetching Aave APY:', error);
    return { apy: '4.5', totalSupplied: 0 }; // Fallback
  }
}

// Deposit USDC into Aave
export async function depositToAave(privateKey, amount) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const amountWei = ethers.utils.parseUnits(amount.toString(), 6); // USDC = 6 decimals
    
    // 1. Approve Aave Pool to spend USDC
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    
    const currentAllowance = await usdcContract.allowance(wallet.address, AAVE_POOL_ADDRESS);
    
    if (currentAllowance.lt(amountWei)) {
      console.log('Approving USDC...');
      const approveTx = await usdcContract.approve(AAVE_POOL_ADDRESS, amountWei);
      await approveTx.wait();
      console.log('Approved!');
    }
    
    // 2. Supply to Aave
    const poolContract = new ethers.Contract(AAVE_POOL_ADDRESS, POOL_ABI, wallet);
    
    console.log('Depositing to Aave...');
    const supplyTx = await poolContract.supply(
      USDC_ADDRESS,
      amountWei,
      wallet.address,
      0 // referral code (0 = no referral)
    );
    
    const receipt = await supplyTx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      amount: amount,
    };
  } catch (error) {
    console.error('Aave deposit error:', error);
    throw new Error(error.message || 'Failed to deposit to Aave');
  }
}

// Withdraw USDC from Aave
export async function withdrawFromAave(privateKey, amount) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const amountWei = ethers.utils.parseUnits(amount.toString(), 6);
    
    const poolContract = new ethers.Contract(AAVE_POOL_ADDRESS, POOL_ABI, wallet);
    
    console.log('Withdrawing from Aave...');
    const withdrawTx = await poolContract.withdraw(
      USDC_ADDRESS,
      amountWei,
      wallet.address
    );
    
    const receipt = await withdrawTx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      amount: amount,
    };
  } catch (error) {
    console.error('Aave withdraw error:', error);
    throw new Error(error.message || 'Failed to withdraw from Aave');
  }
}

// Get user's Aave balance (aUSDC balance = deposited USDC + interest)
export async function getAaveBalance(walletAddress) {
  try {
    const aTokenContract = new ethers.Contract(aUSDC_ADDRESS, ERC20_ABI, provider);
    
    const balance = await aTokenContract.balanceOf(walletAddress);
    const balanceFormatted = ethers.utils.formatUnits(balance, 6);
    
    return parseFloat(balanceFormatted);
  } catch (error) {
    console.error('Error fetching Aave balance:', error);
    return 0;
  }
}