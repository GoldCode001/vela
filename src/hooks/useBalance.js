import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUSDCBalance, getMATICBalance } from '../services/wallet.js';

export function useBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const fetchBalance = useCallback(async () => {
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
  }, [wallet?.address]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Fetch immediately
    fetchBalance();
    
    // Refresh balance every 30 seconds (instead of 10)
    intervalRef.current = setInterval(fetchBalance, 30000);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBalance]);

  return {
    balance,
    maticBalance,
    loading,
    refresh: fetchBalance,
    walletAddress: wallet?.address,
  };
}