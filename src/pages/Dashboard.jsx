import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

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
      available: true
    },
    {
      id: 'creators',
      icon: '🎨',
      title: 'Creators',
      description: 'Support your favorites',
      available: false
    },
    {
      id: 'play',
      icon: '🎮',
      title: 'Play & Earn',
      description: 'Games that reward you',
      available: false
    },
    {
      id: 'nfts',
      icon: '💎',
      title: 'NFTs',
      description: 'Collect digital assets',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4">Welcome back</h2>
          <p className="text-gray-500 text-base sm:text-lg">Your web3 gateway</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="card px-6 py-4 glass-hover cursor-pointer flex items-center gap-3"
          >
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="text-white font-semibold">View Portfolio</p>
              <p className="text-gray-500 text-xs">Track your bets</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Balance</p>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-2">
              ${balance.toFixed(2)}
            </p>
            <button 
              onClick={() => setShowRamp(true)}
              className="text-gray-500 hover:text-white text-xs transition mt-2 cursor-pointer"
            >
              Add funds →
            </button>
            {maticBalance < 0.01 && (
              <p className="text-xs text-yellow-500 mt-2">
                ⚠️ Low gas - add MATIC for transactions
              </p>
            )}
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Active Bets</p>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-2">0</p>
            <p className="text-gray-700 text-xs">No active positions</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Total P&L</p>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-2">$0.00</p>
            <p className="text-gray-700 text-xs">Start betting to track</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Explore</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {verticals.map((vertical) => (
              <button
                key={vertical.id}
                onClick={() => vertical.available && navigate(vertical.path)}
                className={`card text-left ${vertical.available ? 'glass-hover cursor-pointer' : 'cursor-default opacity-60'}`}
              >
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{vertical.icon}</div>
                <h4 className="text-white text-lg sm:text-xl font-semibold mb-2">{vertical.title}</h4>
                <p className="text-gray-500 text-xs sm:text-sm mb-4">{vertical.description}</p>
                {!vertical.available && (
                  <div className="stat-badge text-xs">Coming Soon</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ramp Widget */}
      {showRamp && wallet?.address && (
        <RampWidget
          walletAddress={wallet.address}
          onClose={() => {
            setShowRamp(false);
            // Refresh balance after closing (user might have added funds)
            setTimeout(() => refresh(), 2000);
          }}
          onSuccess={(event) => {
            console.log('🎉 Ramp purchase successful!', event);
            // Refresh balance immediately
            refresh();
            setShowRamp(false);
            alert('✅ Funds added successfully! Your balance will update in a few seconds.');
          }}
        />
      )}
    </div>
  );
}