import { useCallback, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { API_URL } from '../config/api.js';

export default function CoinbasePayWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openCoinbaseOnramp = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError('');

    try {
      // Get Privy access token for authentication
      const accessToken = await getAccessToken();

      // Get onramp URL from backend (includes session token)
      const response = await fetch(`${API_URL}/api/coinbase/session-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          walletAddress,
          network: 'base',
          asset: 'USDC',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Coinbase URL');
      }

      // Open Coinbase Onramp in new window
      window.open(data.url, '_blank', 'width=460,height=750');

      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (err) {
      console.error('Coinbase onramp error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, onSuccess, getAccessToken]);

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

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="space-y-4">
            <button
              onClick={openCoinbaseOnramp}
              disabled={loading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? 'Loading...' : 'Buy with Coinbase'}
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
