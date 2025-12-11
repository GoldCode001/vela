import { useEffect, useState } from 'react';

export default function RampWidget({ walletAddress, onClose }) {
  const [rampUrl, setRampUrl] = useState('');

  useEffect(() => {
    // Build Ramp URL with parameters
    const params = new URLSearchParams({
      userAddress: walletAddress,
      swapAsset: 'MATIC_USDC',
      fiatCurrency: 'USD',
      fiatValue: '20',
      hostAppName: 'Vela',
      hostLogoUrl: window.location.origin + '/vite.svg',
      // Add these for better integration
      finalUrl: window.location.origin,
      webhookStatusUrl: window.location.origin + '/api/webhooks/ramp',
    });

    setRampUrl(`https://app.ramp.network?${params.toString()}`);
  }, [walletAddress]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ height: '90vh', maxHeight: '700px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition shadow-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ramp Iframe */}
        {rampUrl ? (
          <iframe
            src={rampUrl}
            title="Ramp Network"
            className="w-full h-full"
            frameBorder="0"
            allow="payment"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-gray-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}