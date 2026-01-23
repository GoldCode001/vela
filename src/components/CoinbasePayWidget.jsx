import { useEffect, useState } from 'react';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  const [error, setError] = useState('');
  const coinbaseAppId = import.meta.env.VITE_COINBASE_APP_ID;

  useEffect(() => {
    if (!coinbaseAppId) {
      setError('Coinbase App ID not configured. Please set VITE_COINBASE_APP_ID in Railway environment variables.');
      return;
    }

    if (!walletAddress) {
      setError('Wallet address not found');
      return;
    }
  }, [coinbaseAppId, walletAddress]);

  // Coinbase Pay uses a different URL format
  // Try using the Coinbase Pay SDK URL or the correct embed format
  const buildCoinbasePayUrl = () => {
    if (!coinbaseAppId || !walletAddress) return null;

    // Format destination wallets as JSON string
    const destinationWallets = JSON.stringify([{
      address: walletAddress,
      blockchains: ['base'],
      assets: ['USDC']
    }]);

    // Build URL with proper encoding
    const params = new URLSearchParams({
      appId: coinbaseAppId,
      destinationWallets: destinationWallets,
      presetAmount: verifyOnly ? '10' : '100',
      presetCurrency: 'USD'
    });

    return `https://pay.coinbase.com/buy/select-asset?${params.toString()}`;
  };

  const coinbasePayUrl = buildCoinbasePayUrl();

  if (!coinbaseAppId) {
    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-8" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition"
          >
            <span className="text-white text-2xl font-bold">×</span>
          </button>
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold mb-4">Configuration Error</p>
            <p className="text-gray-700 mb-4">
              Coinbase App ID is missing. Please add <code className="bg-gray-100 px-2 py-1 rounded">VITE_COINBASE_APP_ID</code> to your Railway environment variables.
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!coinbasePayUrl) {
    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-8" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition"
          >
            <span className="text-white text-2xl font-bold">×</span>
          </button>
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold mb-4">Error</p>
            <p className="text-gray-700 mb-4">Unable to build Coinbase Pay URL. Please check your configuration.</p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl" 
        style={{ height: '90vh', maxHeight: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition"
        >
          <span className="text-white text-2xl font-bold">×</span>
        </button>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Coinbase Pay Iframe */}
        <iframe
          src={coinbasePayUrl}
          title="Add Funds"
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none',
          }}
          allow="payment; camera; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onError={() => {
            setError('Failed to load Coinbase Pay. Please check your Coinbase App ID and try again.');
          }}
          onLoad={() => {
            // Handle successful payment
            const handleMessage = (event) => {
              // Coinbase Pay sends messages when payment is complete
              if (event.origin === 'https://pay.coinbase.com' && event.data?.type === 'coinbase-pay-success') {
                if (onSuccess) {
                  onSuccess();
                }
                onClose();
              }
            };
            window.addEventListener('message', handleMessage);
            return () => window.removeEventListener('message', handleMessage);
          }}
        />
      </div>
    </div>
  );
}
