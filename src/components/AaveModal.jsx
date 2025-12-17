import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletExport } from '../hooks/useWalletExport';
import { API_URL } from '../config/api';

export default function AaveModal({ onClose, currentBalance, onSuccess }) {
  const { user } = usePrivy();
  const { getPrivateKey, exporting } = useWalletExport();
  const [mode, setMode] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [apy, setApy] = useState('0');
  const [aaveBalance, setAaveBalance] = useState(0);
  
  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  useEffect(() => {
    fetchAPY();
    if (wallet?.address) {
      fetchAaveBalance();
    }
  }, [wallet]);

  const fetchAPY = async () => {
    try {
      const response = await fetch(`${API_URL}/api/aave/apy`);
      const data = await response.json();
      if (data.success) {
        setApy(data.data.apy);
      }
    } catch (error) {
      console.error('Error fetching APY:', error);
    }
  };

  const fetchAaveBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/api/aave/balance/${wallet.address}`);
      const data = await response.json();
      if (data.success) {
        setAaveBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching Aave balance:', error);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amountNum = parseFloat(amount);

    if (mode === 'deposit' && amountNum > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    if (mode === 'withdraw' && amountNum > aaveBalance) {
      alert('Insufficient Aave balance');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Requesting wallet export...');
      const privateKey = await getPrivateKey();

      const endpoint = mode === 'deposit' ? 'deposit' : 'withdraw';
      
      const response = await fetch(`${API_URL}/api/aave/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey, amount: amountNum }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${mode === 'deposit' ? 'Deposited' : 'Withdrawn'} successfully!\n\nTx: ${data.data.txHash}`);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + (error.message || 'Transaction failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal p-6 sm:p-8 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Earn with Aave</h3>
            <p className="text-green-400 text-sm">Current APY: {apy}%</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-2xl">
            ✕
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('deposit')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              mode === 'deposit'
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              mode === 'withdraw'
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Balances */}
        <div className="card mb-6 p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-500">Wallet Balance</span>
            <span className="text-white font-semibold">${currentBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Aave Balance</span>
            <span className="text-white font-semibold">${aaveBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-gray-500 text-sm mb-2 block">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input"
            min="0"
            step="0.01"
          />
          <button
            onClick={() => setAmount(mode === 'deposit' ? currentBalance.toString() : aaveBalance.toString())}
            className="text-xs text-gray-500 hover:text-white mt-2"
          >
            Max: ${(mode === 'deposit' ? currentBalance : aaveBalance).toFixed(2)}
          </button>
        </div>

        {/* Earnings Preview */}
        {mode === 'deposit' && amount && parseFloat(amount) > 0 && (
          <div className="card mb-6 p-4 bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 text-sm mb-1">Estimated Earnings</p>
            <p className="text-white text-xl font-bold">
              ${((parseFloat(amount) * parseFloat(apy)) / 100).toFixed(2)}/year
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || exporting || !amount || parseFloat(amount) <= 0}
          className="btn-primary w-full"
        >
          {exporting ? 'Accessing Wallet...' : loading ? 'Processing...' : `${mode === 'deposit' ? 'Deposit' : 'Withdraw'} USDC`}
        </button>

        <p className="text-gray-600 text-xs mt-4 text-center">
          🔐 Powered by Aave V3 - Your funds are secured on-chain
        </p>
      </div>
    </div>
  );
}