import { useCallback } from 'react';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  // Direct Coinbase Onramp URL - no SDK needed, no session token required
  const openCoinbaseOnramp = useCallback(() => {
    if (!walletAddress) return;

    const amount = verifyOnly ? 10 : 50;

    // Build Coinbase Onramp URL directly
    // This bypasses the SDK and session token requirements
    const params = new URLSearchParams({
      addresses: JSON.stringify({ [walletAddress]: ['base'] }),
      assets: JSON.stringify(['USDC']),
      presetFiatAmount: amount.toString(),
      defaultPaymentMethod: 'CARD',
    });

    const url = `https://pay.coinbase.com/buy/select-asset?${params.toString()}`;
    window.open(url, '_blank', 'width=460,height=750');

    // Call onSuccess after opening (user completes purchase in popup)
    if (onSuccess) {
      // Delay to give user time to complete
      setTimeout(onSuccess, 1000);
    }
  }, [walletAddress, verifyOnly, onSuccess]);

  if (!walletAddress) {
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
            <span className="text-white text-2xl font-bold">&times;</span>
          </button>
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold mb-4">Error</p>
            <p className="text-gray-700 mb-4">Wallet address not found</p>
            <button onClick={onClose} className="btn-primary">Close</button>
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
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition"
        >
          <span className="text-white text-2xl font-bold">&times;</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Funds</h2>
          <p className="text-gray-600 mb-6">
            {verifyOnly
              ? 'Add at least $10 USDC to verify your account'
              : 'Purchase USDC to fund your wallet'}
          </p>

          <div className="space-y-4">
            <button
              onClick={openCoinbaseOnramp}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Buy with Coinbase
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Opens Coinbase in a new window
          </p>
        </div>
      </div>
    </div>
  );
}
