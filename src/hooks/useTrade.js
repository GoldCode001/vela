import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export function useTrade() {
  const { user, exportWallet } = usePrivy();
  const [loading, setLoading] = useState(false);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const executeTrade = async (marketId, marketQuestion, outcome, amount) => {
    if (!wallet) {
      throw new Error('No wallet found');
    }

    setLoading(true);

    try {
      // Request wallet export (user must approve)
      const exportedWallet = await exportWallet();
      
      if (!exportedWallet || !exportedWallet.privateKey) {
        throw new Error('Failed to export wallet');
      }

      // Send trade request to backend with private key
      const response = await fetch('http://localhost:3001/api/bets/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.address,
          marketId,
          marketQuestion,
          outcome,
          amount: parseFloat(amount),
          privateKey: exportedWallet.privateKey, // Send securely
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Trade failed');
      }

      return data;
    } catch (error) {
      console.error('Trade execution error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    executeTrade,
    loading,
    walletAddress: wallet?.address,
  };
}