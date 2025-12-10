import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import BettingModal from '../components/BettingModal.jsx';
import MarketCarousel from '../components/MarketCarousel.jsx';
import { useBalance } from '../hooks/useBalance.js';

export default function Markets() {
  const { ready, authenticated } = usePrivy();
  const navigate = useNavigate();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(null);
  
  // USE REAL BLOCKCHAIN BALANCE
  const { balance, refresh: refreshBalance } = useBalance();

  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/markets');
      const data = await response.json();
      
      if (data.success) {
        setMarkets(data.markets);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !authenticated) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden">
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">Prediction Markets</h2>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg">Swipe to explore live markets</p>
              </div>
              <div className="card px-4 sm:px-6 py-3 sm:py-4">
                <p className="text-gray-500 text-xs mb-1">Your Balance</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">${balance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 text-sm">Loading markets...</p>
              </div>
            </div>
          ) : markets.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No markets available</p>
            </div>
          ) : (
            <MarketCarousel 
              markets={markets} 
              onSelectMarket={setSelectedMarket}
            />
          )}
        </div>
      </div>

      {selectedMarket && (
        <BettingModal 
          market={selectedMarket} 
          onClose={() => setSelectedMarket(null)}
          userBalance={balance}
          onBalanceUpdate={refreshBalance}
        />
      )}
    </>
  );
}