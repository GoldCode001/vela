import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export function useWalletExport() {
  const { exportWallet } = usePrivy();  // ✅ Gets exportWallet from Privy
  const [exporting, setExporting] = useState(false);  // ✅ Loading state

  const getPrivateKey = async () => {
    try {
      setExporting(true);  // ✅ Set loading
      
      // ✅ Request wallet export from Privy (user must approve popup)
      const wallet = await exportWallet();
      
      // ✅ Validate we got the private key
      if (!wallet || !wallet.privateKey) {
        throw new Error('Failed to export wallet');
      }
      
      // ✅ Return the private key
      return wallet.privateKey;
    } catch (error) {
      console.error('Wallet export error:', error);
      throw new Error('Please approve wallet export to place bet');  // ✅ User-friendly error
    } finally {
      setExporting(false);  // ✅ Reset loading
    }
  };

  return {
    getPrivateKey,  // ✅ Function to call
    exporting,      // ✅ Loading state
  };
}