import { useEffect, useState } from 'react';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const coinbaseAppId = import.meta.env.VITE_COINBASE_APP_ID;

  useEffect(() => {
    if (!coinbaseAppId) {
      setError('Coinbase App ID not configured. Please set VITE_COINBASE_APP_ID in Railway environment variables.');
      setLoading(false);
      return;
    }

    if (!walletAddress) {
      setError('Wallet address not found');
      setLoading(false);
      return;
    }

    // Initialize Coinbase Pay SDK dynamically
    let onramp;
    const initCoinbasePay = async () => {
      try {
        // Import the entire module
        const cbpayModule = await import('@coinbase/cbpay-js');
        
        // The SDK exports initOnRamp as a named export
        const initOnRamp = cbpayModule.initOnRamp;
        
        if (typeof initOnRamp !== 'function') {
          console.error('Coinbase Pay SDK exports:', Object.keys(cbpayModule));
          throw new Error(`initOnRamp is not a function. SDK version: ${cbpayModule.version || 'unknown'}`);
        }
        
        onramp = initOnRamp({
          appId: coinbaseAppId,
          widgetParameters: {
            destinationWallets: [
              {
                address: walletAddress,
                blockchains: ['base'],
                assets: ['USDC'],
              },
            ],
            presetAmount: verifyOnly ? '10' : undefined,
            presetCurrency: 'USD',
          },
          onSuccess: () => {
            console.log('Coinbase Pay: Payment successful');
            if (onSuccess) {
              onSuccess();
            }
            onClose();
          },
          onExit: () => {
            console.log('Coinbase Pay: User exited');
            onClose();
          },
          onEvent: (event) => {
            console.log('Coinbase Pay event:', event);
            if (event.eventName === 'onramp_success') {
              if (onSuccess) {
                onSuccess();
              }
              onClose();
            }
          },
        });

        // Open the Coinbase Pay widget
        onramp.open();
        setLoading(false);
      } catch (err) {
        console.error('Error initializing Coinbase Pay:', err);
        setError(`Failed to initialize Coinbase Pay: ${err.message || 'Please check your Coinbase App ID'}`);
        setLoading(false);
      }
    };

    initCoinbasePay();

    // Cleanup on unmount
    return () => {
      if (onramp && typeof onramp.destroy === 'function') {
        try {
          onramp.destroy();
        } catch (err) {
          console.error('Error destroying Coinbase Pay:', err);
        }
      }
    };
  }, [coinbaseAppId, walletAddress, verifyOnly, onSuccess, onClose]);

  // Error state UI
  if (error || !coinbaseAppId) {
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
            <p className="text-red-500 text-lg font-semibold mb-4">
              {!coinbaseAppId ? 'Configuration Error' : 'Error'}
            </p>
            <p className="text-gray-700 mb-4">
              {error || 'Coinbase App ID is missing. Please add VITE_COINBASE_APP_ID to your Railway environment variables.'}
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state - Coinbase Pay SDK opens a popup/modal, so we just show a loading message
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
          {loading ? (
            <>
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-700 mb-2">Opening Coinbase Pay...</p>
              <p className="text-gray-500 text-sm">A popup window should open shortly</p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">Coinbase Pay window opened</p>
              <p className="text-gray-500 text-sm mb-4">Complete your purchase in the popup window</p>
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
