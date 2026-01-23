import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import BettingModal from '../components/BettingModal.jsx';
import MarketCarousel from '../components/MarketCarousel.jsx';
import FundPredictionWallet from '../components/FundPredictionWallet.jsx';
import { useBalance } from '../hooks/useBalance';
import { API_URL } from '../config/api';

export default function Markets() {
  const { ready, authenticated } = usePrivy();
  const navigate = useNavigate();
  const [allMarkets, setAllMarkets] = useState([]);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume'); // 'volume', 'newest', 'probability'
  
  const { balance, availableBalance, polygonBalance, availablePolygonBalance, refresh: refreshBalance, refreshPolygonBalance } = useBalance();
  const [showFundWallet, setShowFundWallet] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    fetchMarkets();
    // Check if user needs to fund prediction wallet
    if (availablePolygonBalance < 10) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        // Only show if user hasn't dismissed it
        const dismissed = localStorage.getItem('fundWalletPromptDismissed');
        if (!dismissed) {
          // Will show banner below
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [availablePolygonBalance]);

  useEffect(() => {
    applyFilters();
  }, [allMarkets, selectedCategory, searchQuery, sortBy]);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/markets`);
      const data = await response.json();
      
      if (data.success) {
        setAllMarkets(data.markets);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allMarkets];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.question.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'volume') {
      filtered.sort((a, b) => b.volume - a.volume);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'probability') {
      filtered.sort((a, b) => {
        const aProb = Math.max(parseFloat(a.outcomePrices[0]), parseFloat(a.outcomePrices[1]));
        const bProb = Math.max(parseFloat(b.outcomePrices[0]), parseFloat(b.outcomePrices[1]));
        return bProb - aProb;
      });
    }

    setFilteredMarkets(filtered);
  };

  // Get unique categories
  const categories = ['All', ...new Set(allMarkets.map(m => m.category))];

  // Calculate stats
  const totalVolume = allMarkets.reduce((sum, m) => sum + m.volume, 0);

  if (!ready || !authenticated) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
          {/* Header */}
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
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">Prediction Markets</h2>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                  {filteredMarkets.length} markets • ${(totalVolume / 1000000).toFixed(1)}M total volume
                </p>
              </div>
              <div className="card px-4 sm:px-6 py-3 sm:py-4">
                <p className="text-gray-500 text-xs mb-1">Your Balance</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">${balance.toFixed(2)}</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search markets..."
                  className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 sm:py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition text-sm sm:text-base"
                />
                <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-500 text-xs sm:text-sm">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('volume')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                    sortBy === 'volume'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                    sortBy === 'newest'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('probability')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                    sortBy === 'probability'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Probability
                </button>
              </div>
            </div>
          </div>

          {/* Fund Prediction Wallet Banner */}
          {availablePolygonBalance < 10 && (
            <div className="glass-card mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Ready to bet? Fund your prediction wallet first</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Your prediction wallet has ${availablePolygonBalance.toFixed(2)} available. 
                    Fund it from your main wallet to start placing bets instantly.
                  </p>
                  <button
                    onClick={() => setShowFundWallet(true)}
                    className="glass-btn text-sm font-semibold"
                  >
                    Fund Prediction Wallet
                  </button>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('fundWalletPromptDismissed', 'true');
                  }}
                  className="text-gray-500 hover:text-white transition text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Markets Display */}
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
          ) : filteredMarkets.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white text-xl font-bold mb-2">No Markets Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-secondary inline-block"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <MarketCarousel 
                markets={filteredMarkets} 
                onSelectMarket={setSelectedMarket}
              />
              
              {/* Results Summary */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  Showing {filteredMarkets.length} of {allMarkets.length} markets
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedMarket && (
        <BettingModal 
          market={selectedMarket} 
          onClose={() => setSelectedMarket(null)}
          userBalance={availablePolygonBalance}
          onBalanceUpdate={() => {
            refreshBalance();
            refreshPolygonBalance();
          }}
        />
      )}

      {showFundWallet && (
        <FundPredictionWallet
          onClose={() => setShowFundWallet(false)}
          onSuccess={() => {
            refreshBalance();
            refreshPolygonBalance();
            setShowFundWallet(false);
          }}
          baseBalance={balance}
          availableBalance={availableBalance}
        />
      )}
    </>
  );
}