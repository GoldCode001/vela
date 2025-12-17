import { useEffect } from 'react';

export default function MercuryoWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  useEffect(() => {
    // Build Mercuryo URL
    const params = new URLSearchParams({
      widget_id: 'c76d29cd-02e8-4ae6-8f99-6191d36ec5c3',
      type: 'buy',
      currency: 'USDC',
      network: 'POLYGON',
      address: walletAddress,
      amount: verifyOnly ? '10' : '20',
      fiat_currency: 'USD',
      theme: 'dark',
      return_url: window.location.origin + '/dashboard',
    });

    const mercuryoUrl = `https://exchange.mercuryo.io/?${params.toString()}`;
    
    // Open in new tab
    window.open(mercuryoUrl, '_blank');
    
    // Close immediately and call success
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }, 500);
  }, [walletAddress, onClose, onSuccess, verifyOnly]);

  // Show a modal with instructions
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card p-8 max-w-md text-center">
        <div className="text-5xl mb-4">💳</div>
        <h3 className="text-2xl font-bold text-white mb-4">Opening Mercuryo...</h3>
        <p className="text-gray-400 mb-6">
          A new tab has opened for you to complete the purchase. Return here when done!
        </p>
        <button
          onClick={onClose}
          className="btn-secondary w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}