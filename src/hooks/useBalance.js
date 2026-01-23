import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUSDCBalance, getETHBalance, getPolygonUSDCBalance } from '../services/wallet.js';

// Minimum balance reserved for transaction fees (like traditional banking)
const MIN_RESERVED_BALANCE = 1.0;

export function useBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState(0); // Base USDC total balance
  const [ethBalance, setEthBalance] = useState(0); // Base ETH for gas
  const [polygonBalance, setPolygonBalance] = useState(0); // Polygon USDC total balance
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const fetchBalance = useCallback(async () => {
    if (!wallet?.address || !isMountedRef.current) {
      return;
    }

    try {
      // Fetch Base balances (main wallet)
      const [usdc, eth] = await Promise.all([
        getUSDCBalance(wallet.address),
        getETHBalance(wallet.address),
      ]);
      
      // Fetch Polygon balance (prediction wallet) - will be updated when wallet manager is implemented
      // For now, try to fetch if polygon wallet exists
      let polygonUSDC = 0;
      try {
        polygonUSDC = await getPolygonUSDCBalance(wallet.address);
      } catch (err) {
        // Polygon wallet might not exist yet, that's okay
        console.log('Polygon wallet not found yet');
      }
      
      if (isMountedRef.current) {
        // Only update if values actually changed
        setBalance(prev => {
          const newVal = parseFloat(usdc.toFixed(2));
          const oldVal = parseFloat(prev.toFixed(2));
          return newVal !== oldVal ? usdc : prev;
        });
        
        setEthBalance(prev => {
          const newVal = parseFloat(eth.toFixed(4));
          const oldVal = parseFloat(prev.toFixed(4));
          return newVal !== oldVal ? eth : prev;
        });

        setPolygonBalance(prev => {
          const newVal = parseFloat(polygonUSDC.toFixed(2));
          const oldVal = parseFloat(prev.toFixed(2));
          return newVal !== oldVal ? polygonUSDC : prev;
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

  // Calculate available balances (total - reserved $1)
  const availableBalance = Math.max(0, balance - MIN_RESERVED_BALANCE);
  const availablePolygonBalance = Math.max(0, polygonBalance - MIN_RESERVED_BALANCE);

  return {
    balance, // Total Base USDC balance
    availableBalance, // Spendable Base USDC (total - $1 reserve)
    ethBalance, // Base ETH for gas
    polygonBalance, // Total Polygon USDC balance
    availablePolygonBalance, // Spendable Polygon USDC (total - $1 reserve)
    loading,
    refresh: fetchBalance,
    refreshPolygonBalance: async () => {
      if (wallet?.address) {
        try {
          const polygonUSDC = await getPolygonUSDCBalance(wallet.address);
          setPolygonBalance(polygonUSDC);
        } catch (error) {
          console.error('Error refreshing Polygon balance:', error);
        }
      }
    },
    walletAddress: wallet?.address,
    minReservedBalance: MIN_RESERVED_BALANCE,
  };
}