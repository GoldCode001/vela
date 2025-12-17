import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUSDCBalance, getMATICBalance } from '../services/wallet.js';

export function useBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const fetchBalance = useCallback(async () => {
    if (!wallet?.address || !isMountedRef.current) {
      return;
    }

    try {
      // Don't set loading on refresh, only on initial load
      const [usdc, matic] = await Promise.all([
        getUSDCBalance(wallet.address),
        getMATICBalance(wallet.address),
      ]);
      
      if (isMountedRef.current) {
        // Only update if values actually changed
        setBalance(prev => {
          const newVal = parseFloat(usdc.toFixed(2));
          const oldVal = parseFloat(prev.toFixed(2));
          return newVal !== oldVal ? usdc : prev;
        });
        
        setMaticBalance(prev => {
          const newVal = parseFloat(matic.toFixed(4));
          const oldVal = parseFloat(prev.toFixed(4));
          return newVal !== oldVal ? matic : prev;
        });
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [wallet?.address]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial load
    setLoading(true);
    fetchBalance();
    
    // Refresh balance every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchBalance();
    }, 30000);
    
    return () => {
      isMountedRef.current = false;
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