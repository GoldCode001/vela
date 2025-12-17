import { useEffect } from 'react';

export default function MercuryoWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  useEffect(() => {
    // Build Mercuryo URL
    const params = new URLSearchParams({
      widget_id: 'c76d29cd-02e8-4ae6-8f99-6191d36ec5c3', // Public test widget
      type: 'buy',
      currency: 'USDC',
      network: 'POLYGON',
      address: walletAddress,
      amount: verifyOnly ? '10' : '20', // Minimum $10
      fiat_currency: 'USD',
      theme: 'dark',
    });

    const mercuryoUrl = `https://exchange.mercuryo.io/?${params.toString()}`;
    
    // Open in popup
    const popup = window.open(
      mercuryoUrl,
      'mercuryo',
      'width=420,height=720,resizable=yes,scrollbars=yes'
    );

    if (!popup) {
      alert('Please allow popups to continue');
      onClose();
      return;
    }

    // Monitor popup close
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (popup && !popup.closed) {
        popup.close();
      }
    };
  }, [walletAddress, onClose, onSuccess, verifyOnly]);

  return null;
}