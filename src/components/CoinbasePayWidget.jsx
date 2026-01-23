import { useCallback } from 'react';
import {
  FundButton,
  getOnrampBuyUrl
} from '@coinbase/onchainkit/fund';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  const projectId = import.meta.env.VITE_COINBASE_PROJECT_ID;

  // Fallback: Direct URL method if FundButton doesn't work
  const openCoinbaseOnramp = useCallback(() => {
    const onrampUrl = getOnrampBuyUrl({
      projectId,
      addresses: { [walletAddress]: ['base'] },
      assets: ['USDC'],
      presetFiatAmount: verifyOnly ? 10 : 50,
      fiatCurrency: 'USD',
    });
    window.open(onrampUrl, '_blank', 'width=460,height=750');
  }, [projectId, walletAddress, verifyOnly]);

  if (!projectId) {
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
              Coinbase Project ID is missing. Add VITE_COINBASE_PROJECT_ID to your environment variables.
            </p>
            <button onClick={onClose} className="btn-primary">Close</button>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-white text-2xl font-bold">×</span>
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
          <span className="text-white text-2xl font-bold">×</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Funds</h2>
          <p className="text-gray-600 mb-6">
            {verifyOnly
              ? 'Add at least $10 USDC to verify your account'
              : 'Purchase USDC to fund your wallet'}
          </p>

          <div className="space-y-4">
            {/* Primary: OnchainKit FundButton */}
            <FundButton
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              text="Buy with Coinbase"
              fundingUrl={getOnrampBuyUrl({
                projectId,
                addresses: { [walletAddress]: ['base'] },
                assets: ['USDC'],
                presetFiatAmount: verifyOnly ? 10 : 50,
                fiatCurrency: 'USD',
              })}
              onPopupClose={() => {
                if (onSuccess) onSuccess();
                onClose();
              }}
            />

            {/* Fallback button */}
            <button
              onClick={openCoinbaseOnramp}
              className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Open in new window instead
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Powered by Coinbase Onramp
          </p>
        </div>
      </div>
    </div>
  );
}
