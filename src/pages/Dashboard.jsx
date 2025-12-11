import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react'; // ADD useMemo
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import RampWidget from '../components/RampWidget.jsx';
import { useBalance } from '../hooks/useBalance';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { ready, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { balance, maticBalance, loading, refresh } = useBalance();
  const [showRamp, setShowRamp] = useState(false);

  // FIX: Memoize wallet so it doesn't cause re-renders
  const wallet = useMemo(() => 
    user?.linkedAccounts?.find(account => account.type === 'wallet'),
    [user]
  );

 
  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    if (user) {
      const wallet = user.linkedAccounts?.find(
        account => account.type === 'wallet'
      );
      
      if (wallet) {
        saveUserToDatabase(wallet.address, user.email?.address);
      }
    }
  }, [user]);

  const saveUserToDatabase = async (address, email) => {
    const { error } = await supabase
      .from('users')
      .upsert({
        wallet_address: address,
        email: email,
      }, {
        onConflict: 'wallet_address'
      });
    
    if (error) console.error('Error saving user:', error);
  };

  if (!ready || !authenticated || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const verticals = [
    {
      id: 'predictions',
      icon: '🎯',
      title: 'Predictions',
      description: 'Bet on real-world events',
      path: '/markets',
      available: true,
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: 'creators',
      icon: '🎨',
      title: 'Creators',
      description: 'Support & subscribe',
      available: false,
      color: 'from-pink-500/20 to-red-500/20'
    },
    {
      id: 'gaming',
      icon: '🎮',
      title: 'Gaming',
      description: 'Play & earn rewards',
      available: false,
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'nfts',
      icon: '💎',
      title: 'NFTs',
      description: 'Collect digital assets',
      available: false,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'defi',
      icon: '🏦',
      title: 'DeFi',
      description: 'Lend, borrow, stake',
      available: false,
      color: 'from-indigo-500/20 to-blue-500/20'
    },
    {
      id: 'social',
      icon: '💬',
      title: 'Social',
      description: 'Connect & chat',
      available: false,
      color: 'from-cyan-500/20 to-teal-500/20'
    },
  ];

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
            Your Web3 Gateway
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">
            Trade, play, collect, and connect — all in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Balance</p>
              <button 
                onClick={() => setShowRamp(true)}
                className="text-white text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition"
              >
                Add Funds
              </button>
            </div>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">
              ${balance.toFixed(2)}
            </p>
            <p className="text-gray-600 text-xs">Universal wallet balance</p>
            {maticBalance < 0.01 && (
              <p className="text-xs text-yellow-500 mt-2">
                ⚠️ Low gas - transactions may fail
              </p>
            )}
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-3">Activity</p>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">0</p>
            <p className="text-gray-600 text-xs">Total transactions</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-3">Portfolio</p>
            <button
              onClick={() => navigate('/portfolio')}
              className="text-white text-sm hover:text-gray-300 transition flex items-center gap-2 group"
            >
              View Details
              <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Features Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Explore Vela</h3>
            <p className="text-gray-500 text-sm">{verticals.filter(v => v.available).length} of {verticals.length} live</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {verticals.map((vertical) => (
              <button
                key={vertical.id}
                onClick={() => vertical.available && navigate(vertical.path)}
                disabled={!vertical.available}
                className={`
                  card text-left relative overflow-hidden group
                  ${vertical.available 
                    ? 'glass-hover cursor-pointer' 
                    : 'cursor-not-allowed opacity-60'
                  }
                `}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl sm:text-6xl">{vertical.icon}</div>
                    {!vertical.available && (
                      <span className="stat-badge text-xs">Soon</span>
                    )}
                    {vertical.available && (
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    )}
                  </div>

                  <h4 className="text-white text-xl sm:text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                    {vertical.title}
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    {vertical.description}
                  </p>

                  {vertical.available && (
                    <div className="flex items-center gap-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Launch
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 sm:mt-16 card p-6 sm:p-8">
          <h4 className="text-white text-lg sm:text-xl font-bold mb-6">Platform Stats</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Users</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Volume</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Active Now</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Markets</p>
              <p className="text-white text-2xl font-bold">100+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ramp Widget */}
      {showRamp && wallet?.address && (
        <RampWidget
          walletAddress={wallet.address}
          onClose={() => {
            setShowRamp(false);
            setTimeout(() => refresh(), 2000);
          }}
          onSuccess={(event) => {
            console.log('🎉 Ramp purchase successful!', event);
            refresh();
            setShowRamp(false);
            alert('✅ Funds added successfully! Your balance will update in a few seconds.');
          }}
        />
      )}
    </div>
  );
}