import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import MercuryoWidget from '../components/MercuryoWidget.jsx';
import AaveModal from '../components/AaveModal.jsx';
import { useBalance } from '../hooks/useBalance';
import { supabase } from '../lib/supabase';
import AITutorChat from '../components/AITutorChat.jsx';

export default function Dashboard() {
  const { ready, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { balance, maticBalance, loading, refresh } = useBalance();
  const [showMercuryo, setShowMercuryo] = useState(false);
  const [showAave, setShowAave] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const [showAITutor, setShowAITutor] = useState(false);

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
    if (user && wallet) {
      saveUserToDatabase(wallet.address, user.email?.address);
      checkVerificationStatus(wallet.address);
    }
  }, [user, wallet]);

  useEffect(() => {
    const handleOpenDefi = () => {
      setShowAave(true);
    };

    window.addEventListener('openDefi', handleOpenDefi);
    
    return () => {
      window.removeEventListener('openDefi', handleOpenDefi);
    };
  }, []);

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

  const checkVerificationStatus = async (address) => {
    try {
      setCheckingVerification(true);
      const { data, error } = await supabase
        .from('users')
        .select('mercuryo_verified')
        .eq('wallet_address', address)
        .single();
      
      if (!error && data) {
        setIsVerified(data.mercuryo_verified || false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setCheckingVerification(false);
    }
  };

  const markAsVerified = async () => {
    if (!wallet?.address) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          mercuryo_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq('wallet_address', wallet.address);
      
      if (!error) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error('Error marking verified:', error);
    }
  };

  const handleVerify = () => {
    setVerifyMode(true);
    setShowMercuryo(true);
  };

  const handleAddFunds = () => {
    setVerifyMode(false);
    setShowMercuryo(true);
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
      id: 'education',
      icon: '📚',
      title: 'Education',
      description: 'Learn with goldman',
      available: true,
      color: 'from-purple-500/20 to-pink-500/20',
      onClick: () => setShowAITutor(true)
    },
    {
      id: 'defi',
      icon: '🏦',
      title: 'DeFi',
      description: 'Earn yield on idle funds',
      available: true,
      color: 'from-indigo-500/20 to-blue-500/20',
      onClick: () => setShowAave(true)
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

        {/* Verification Alert */}
        {!checkingVerification && !isVerified && (
          <div className="glass-card mb-8 p-4 sm:p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Verify Your Account</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Complete quick verification (2-5 mins) to enable instant purchases. You only need to do this once!
                </p>
                <button
                  onClick={handleVerify}
                  className="glass-btn text-sm font-semibold"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Balance</p>
                {isVerified && (
                  <span className="text-green-400 text-xs flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Verified - Instant Purchases
                  </span>
                )}
              </div>
              <button 
                onClick={handleAddFunds}
                className="glass-btn-sm"
              >
                Add Funds
              </button>
            </div>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">
              ${balance.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs">Universal wallet balance</p>
            {maticBalance < 0.01 && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ Low gas - transactions may fail
              </p>
            )}
          </div>

          <div className="glass-card">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Activity</p>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">0</p>
            <p className="text-gray-500 text-xs">Total transactions</p>
          </div>

          <div className="glass-card">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Portfolio</p>
            <button
              onClick={() => navigate('/portfolio')}
              className="text-white text-sm hover:text-gray-300 transition flex items-center gap-2 group font-semibold"
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
                onClick={() => {
                  if (vertical.onClick) {
                    vertical.onClick();
                  } else if (vertical.available) {
                    navigate(vertical.path);
                  }
                }}
                disabled={!vertical.available && !vertical.onClick}
                className={`
                  glass-card text-left relative overflow-hidden group
                  ${vertical.available || vertical.onClick
                    ? 'hover:scale-[1.02] cursor-pointer' 
                    : 'cursor-not-allowed opacity-60'
                  }
                  transition-all duration-300
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl sm:text-6xl">{vertical.icon}</div>
                    {!vertical.available && !vertical.onClick && (
                      <span className="stat-badge text-xs font-semibold">Soon</span>
                    )}
                    {(vertical.available || vertical.onClick) && (
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    )}
                  </div>

                  <h4 className="text-white text-xl sm:text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                    {vertical.title}
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    {vertical.description}
                  </p>

                  {(vertical.available || vertical.onClick) && (
                    <div className="flex items-center gap-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
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

        {/* Platform Stats */}
        <div className="mt-12 sm:mt-16 glass-card p-6 sm:p-8">
          <h4 className="text-white text-lg sm:text-xl font-bold mb-6">Platform Stats</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">Total Users</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">Volume</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">Active Now</p>
              <p className="text-white text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">Markets</p>
              <p className="text-white text-2xl font-bold">100+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mercuryo Widget */}
      {showMercuryo && wallet?.address && (
        <MercuryoWidget
          walletAddress={wallet.address}
          verifyOnly={verifyMode}
          onClose={() => setShowMercuryo(false)}
          onSuccess={() => {
            if (verifyMode) {
              markAsVerified();
            }
            refresh();
          }}
        />
      )}

      {/* Aave Modal */}
      {showAave && (
        <AaveModal
          onClose={() => setShowAave(false)}
          currentBalance={balance}
          onSuccess={() => {
            refresh();
            setShowAave(false);
          }}
        />
      )}
      {showAITutor && (
        <AITutorChat onClose={() => setShowAITutor(false)} />
      )}
    </div>
  );
}