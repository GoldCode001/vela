import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletExport } from '../hooks/useWalletExport';
import { API_URL } from '../config/api';

export default function BettingModal({ market, onClose, userBalance, onBalanceUpdate }) {
  const { user } = usePrivy();
  const { getPrivateKey, exporting } = useWalletExport();
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFunding, setShowFunding] = useState(false);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  const handlePlaceBet = async () => {
    if (selectedOutcome === null || !amount || parseFloat(amount) <= 0) {
      alert('Please select an outcome and enter an amount');
      return;
    }

    const betAmount = parseFloat(amount);

    if (betAmount > userBalance) {
      setShowFunding(true);
      return;
    }

    setLoading(true);

    try {
      // Get private key from Privy (user must approve)
      console.log('🔐 Requesting wallet export...');
      const privateKey = await getPrivateKey();
      
      if (!privateKey) {
        throw new Error('Could not access wallet');
      }

      console.log('✅ Wallet exported, executing trade...');

      // Execute real trade
      const response = await fetch(`${API_URL}/api/bets/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.address,
          marketId: market.id,
          marketQuestion: market.question,
          outcome: selectedOutcome,
          amount: betAmount,
          privateKey: privateKey,
          tokenIds: market.tokens || [],
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Trade failed');
      }

      if (data.trade.real) {
        alert(`✅ REAL BET PLACED!\n\nYou got ${data.trade.shares} shares at $${data.trade.entryPrice}\n\nOrder ID: ${data.trade.orderId}`);
      } else {
        alert(`⚠️ Bet recorded but trade was simulated\n\nShares: ${data.trade.shares}`);
      }
      
      // Refresh balance
      onBalanceUpdate();
      onClose();
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('❌ ' + (error.message || 'Failed to place bet'));
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component stays the same

  if (showFunding) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal p-6 sm:p-8 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Add Funds</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-2">
            Your balance: <span className="text-white font-semibold">${userBalance.toFixed(2)}</span>
          </p>
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
            You need <span className="text-white font-semibold">${parseFloat(amount).toFixed(2)}</span> to place this bet.
          </p>

          <p className="text-gray-600 text-xs mb-4 sm:mb-6">
            * Ramp integration coming soon! You'll be able to add USDC using your credit card or bank transfer.
          </p>
          
          <button 
            onClick={() => {
              alert('Ramp Network integration pending approval. You will be able to add funds with credit card soon!');
              setShowFunding(false);
            }}
            className="btn-primary w-full mb-3 sm:mb-4 text-sm sm:text-base"
          >
            Add Funds with Card (Coming Soon)
          </button>
          
          <button onClick={() => setShowFunding(false)} className="btn-secondary w-full text-sm sm:text-base">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal p-6 sm:p-8 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Place Bet</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Balance: ${userBalance.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl sm:text-2xl">
            ✕
          </button>
        </div>

        <p className="text-white text-base sm:text-lg mb-4 sm:mb-6 leading-snug">{market.question}</p>

        <div className="mb-4 sm:mb-6">
          <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">Select Outcome</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedOutcome(0)}
              className={`outcome-btn ${selectedOutcome === 0 ? 'selected' : ''}`}
            >
              <p className="text-gray-500 text-xs mb-1">Yes</p>
              <p className="text-white text-xl sm:text-2xl font-bold">
                {(parseFloat(market.outcomePrices[0]) * 100).toFixed(0)}%
              </p>
            </button>
            <button
              onClick={() => setSelectedOutcome(1)}
              className={`outcome-btn ${selectedOutcome === 1 ? 'selected' : ''}`}
            >
              <p className="text-gray-500 text-xs mb-1">No</p>
              <p className="text-white text-xl sm:text-2xl font-bold">
                {(parseFloat(market.outcomePrices[1]) * 100).toFixed(0)}%
              </p>
            </button>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">Bet Amount ($)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10.00"
            className="input text-sm sm:text-base"
            min="1"
            step="0.01"
          />
        </div>

        {selectedOutcome !== null && amount && parseFloat(amount) > 0 && (
          <div className="card mb-4 sm:mb-6 p-3 sm:p-4">
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span className="text-gray-500">Potential Win</span>
              <span className="text-white font-semibold">
                ${(parseFloat(amount) / parseFloat(market.outcomePrices[selectedOutcome])).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-500">Platform Fee (0.5%)</span>
              <span className="text-gray-400">${(parseFloat(amount) * 0.005).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handlePlaceBet}
          disabled={selectedOutcome === null || !amount || parseFloat(amount) <= 0 || loading || exporting}
          className="btn-primary w-full text-sm sm:text-base"
        >
          {exporting ? 'Accessing Wallet...' : loading ? 'Executing Trade...' : `Place Bet ${amount ? `($${amount})` : ''}`}
        </button>
        
        <p className="text-gray-600 text-xs mt-3 text-center">
          🔐 You'll be asked to approve wallet access
        </p>
      </div>
    </div>
  );
}