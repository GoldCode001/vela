import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import { useBalance } from '../hooks/useBalance';

export default function Portfolio() {
  const { ready, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { balance, refresh: refreshBalance } = useBalance();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    if (wallet?.address) {
      fetchPositions();
    }
  }, [wallet, activeTab]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/bets/positions/${wallet.address}`);
      const data = await response.json();
      
      if (data.success) {
        setPositions(data.positions || []);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePnL = (position) => {
    // Add null safety
    const shares = parseFloat(position?.shares) || 0;
    const currentPrice = parseFloat(position?.current_price) || 0;
    const invested = parseFloat(position?.amount_usd) || 0;
    
    const currentValue = shares * currentPrice;
    const pnl = currentValue - invested;
    const pnlPercent = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : '0.00';
    
    return { pnl, pnlPercent };
  };

  const totalInvested = positions.reduce((sum, pos) => sum + (parseFloat(pos?.amount_usd) || 0), 0);
  const totalCurrentValue = positions.reduce((sum, pos) => {
    const shares = parseFloat(pos?.shares) || 0;
    const price = parseFloat(pos?.current_price) || 0;
    return sum + (shares * price);
  }, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : '0.00';

  if (!ready || !authenticated) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="mb-8 sm:mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-white text-xs sm:text-sm mb-4 sm:mb-6 flex items-center gap-2 transition group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">Portfolio</h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">Track your predictions and performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Balance</p>
            <p className="text-white text-2xl sm:text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Active Bets</p>
            <p className="text-white text-2xl sm:text-3xl font-bold">{positions.length}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Total Invested</p>
            <p className="text-white text-2xl sm:text-3xl font-bold">${totalInvested.toFixed(2)}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Total P&L</p>
            <p className={`text-2xl sm:text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnLPercent}%)
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 text-sm sm:text-base font-medium transition ${
              activeTab === 'active'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Active Positions
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`pb-3 px-4 text-sm sm:text-base font-medium transition ${
              activeTab === 'closed'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Closed Positions
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : positions.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-white text-xl font-bold mb-2">No Positions Yet</h3>
            <p className="text-gray-500 mb-6">Start betting on markets to see your positions here</p>
            <button
              onClick={() => navigate('/markets')}
              className="btn-primary inline-block"
            >
              Explore Markets
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.map((position) => {
              const { pnl, pnlPercent } = calculatePnL(position);
              
              return (
                <div key={position.id} className="card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`stat-badge text-xs ${
                          position.side === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {position.side?.toUpperCase() || 'N/A'}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {position.created_at ? new Date(position.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      <h3 className="text-white text-base sm:text-lg font-semibold mb-2 leading-snug">
                        {position.market_question || 'Unknown Market'}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Shares</p>
                          <p className="text-white font-medium">{(parseFloat(position.shares) || 0).toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Avg Price</p>
                          <p className="text-white font-medium">${(parseFloat(position.entry_price) || 0).toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Invested</p>
                          <p className="text-white font-medium">${(parseFloat(position.amount_usd) || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Current Value</p>
                          <p className="text-white font-medium">
                            ${((parseFloat(position.shares) || 0) * (parseFloat(position.current_price) || 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600 text-xs mb-1">P&L</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </p>
                      <p className={`text-sm ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({pnlPercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}