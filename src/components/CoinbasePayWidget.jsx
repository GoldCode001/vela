import { useEffect } from 'react';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  useEffect(() => {
    // Coinbase Pay SDK integration
    // Note: This is a placeholder - actual implementation requires Coinbase Pay SDK
    // The widget will be embedded via Coinbase Pay's iframe or SDK
    
    const coinbaseAppId = import.meta.env.VITE_COINBASE_APP_ID;
    
    if (!coinbaseAppId) {
      console.error('Coinbase App ID not configured');
      return;
    }

    // Coinbase Pay widget initialization
    // This is a simplified version - actual implementation will use Coinbase Pay SDK
    // See: https://docs.cdp.coinbase.com/coinbase-pay/docs
    
    return () => {
      // Cleanup if needed
    };
  }, [walletAddress]);

  // For now, using a simple iframe approach
  // In production, use Coinbase Pay SDK properly
  const coinbasePayUrl = `https://pay.coinbase.com/buy/select-asset?appId=${import.meta.env.VITE_COINBASE_APP_ID}&destinationWallets=[{"address":"${walletAddress}","assets":["USDC"]}]&presetAmount=${verifyOnly ? '10' : '100'}&presetCurrency=USD`;

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
          onLoad={() => {
            // Handle successful payment
            // In production, use Coinbase Pay SDK callbacks
            const handleMessage = (event) => {
              if (event.data.type === 'coinbase-pay-success') {
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
