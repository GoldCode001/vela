import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUSDCBalance, getMATICBalance } from '../services/wallet.js';

export function useBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const fetchBalance = async () => {
    if (!wallet?.address) {
      setBalance(0);
      setMaticBalance(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [usdc, matic] = await Promise.all([
        getUSDCBalance(wallet.address),
        getMATICBalance(wallet.address),
      ]);
      
      setBalance(usdc);
      setMaticBalance(matic);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [wallet?.address]);

  return {
    balance, // USDC balance
    maticBalance, // For gas
    loading,
    refresh: fetchBalance,
    walletAddress: wallet?.address,
  };
}