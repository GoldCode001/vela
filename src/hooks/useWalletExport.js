import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export function useWalletExport() {
  const { exportWallet } = usePrivy();
  const [exporting, setExporting] = useState(false);

  const getPrivateKey = async () => {
    try {
      setExporting(true);
      
      // Request wallet export from Privy
      const wallet = await exportWallet();
      
      if (!wallet || !wallet.privateKey) {
        throw new Error('Failed to export wallet');
      }import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export function useWalletExport() {
  const { exportWallet } = usePrivy();
  const [exporting, setExporting] = useState(false);

  const getPrivateKey = async () => {
    try {
      setExporting(true);
      
      // Request wallet export from Privy
      const wallet = await exportWallet();
      
      if (!wallet || !wallet.privateKey) {
        throw new Error('Failed to export wallet');
      }
      
      return wallet.privateKey;
    } catch (error) {
      console.error('Wallet export error:', error);
      throw new Error('Please approve wallet export to place bet');
    } finally {
      setExporting(false);
    }
  };

  return {
    getPrivateKey,
    exporting,
  };
}
      
      return wallet.privateKey;
    } catch (error) {
      console.error('Wallet export error:', error);
      throw new Error('Please approve wallet export to place bet');
    } finally {
      setExporting(false);
    }
  };

  return {
    getPrivateKey,
    exporting,
  };
}