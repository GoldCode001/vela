import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletExport } from '../hooks/useWalletExport';
import { API_URL } from '../config/api';

export default function FundPredictionWallet({ onClose, onSuccess, baseBalance, availableBalance }) {
  const { user } = usePrivy();
  const { getPrivateKey, exporting } = useWalletExport();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [bridging, setBridging] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('');

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');
  const minReserved = 1.0;

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const bridgeAmount = parseFloat(amount);
    const maxAmount = availableBalance;

    if (bridgeAmount > maxAmount) {
      alert(`Insufficient balance. Available: $${maxAmount.toFixed(2)} (Total: $${baseBalance.toFixed(2)}, $${minReserved} reserved for fees)`);
      return;
    }

    if (bridgeAmount < 10) {
      alert('Minimum bridge amount is $10');
      return;
    }

    setLoading(true);
    setBridging(true);
    setBridgeStatus('Preparing bridge...');

    try {
      console.log('🔐 Requesting wallet export...');
      const privateKey = await getPrivateKey();
      
      if (!privateKey) {
        throw new Error('Could not access wallet');
      }

      setBridgeStatus('Bridging funds to your prediction wallet...');

      const response = await fetch(`${API_URL}/api/bridge/base-to-polygon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.address,
          amount: bridgeAmount,
          privateKey: privateKey,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Bridge failed');
      }

      setBridgeStatus('Bridge initiated! This usually takes 2-3 minutes...');
      
      // Wait for bridge completion (poll status)
      // In production, use WebSocket or polling to check status
      setTimeout(() => {
        setBridgeStatus('Bridge completed!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        }, 1000);
      }, 5000); // Simplified - in production, poll actual status

    } catch (error) {
      console.error('Error bridging:', error);
      alert('❌ ' + (error.message || 'Failed to bridge funds'));
      setBridging(false);
      setBridgeStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal p-6 sm:p-8 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Fund Prediction Wallet</h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Transfer funds from your main wallet to your prediction wallet
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl sm:text-2xl">
            ✕
          </button>
        </div>

        {!bridging ? (
          <>
            <div className="mb-4 sm:mb-6">
              <div className="glass-card p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Available Balance</span>
                  <span className="text-white font-semibold">${availableBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Balance</span>
                  <span className="text-gray-400 text-sm">${baseBalance.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-xs mt-2">${minReserved} reserved for transaction fees</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">Amount to Bridge ($)</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10.00"
                  className="input text-sm sm:text-base"
                  min="10"
                  max={availableBalance}
                  step="0.01"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setAmount((availableBalance * 0.25).toFixed(2))}
                    className="glass-btn-sm text-xs"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => setAmount((availableBalance * 0.5).toFixed(2))}
                    className="glass-btn-sm text-xs"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setAmount(availableBalance.toFixed(2))}
                    className="glass-btn-sm text-xs"
                  >
                    Max
                  </button>
                </div>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="glass-card mb-4 p-3 sm:p-4">
                  <div className="flex justify-between text-sm sm:text-base mb-2">
                    <span className="text-gray-500">Bridge Amount</span>
                    <span className="text-white font-semibold">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500">Estimated Time</span>
                    <span className="text-gray-400">2-3 minutes</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBridge}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance || loading || exporting}
              className="btn-primary w-full text-sm sm:text-base"
            >
              {exporting ? 'Accessing Wallet...' : loading ? 'Processing...' : `Bridge $${amount || '0.00'}`}
            </button>
            
            <p className="text-gray-600 text-xs mt-3 text-center">
              🔐 You'll be asked to approve wallet access
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white font-semibold mb-2">{bridgeStatus}</p>
            <p className="text-gray-500 text-sm">Please wait while we transfer your funds...</p>
          </div>
        )}
      </div>
    </div>
  );
}
