import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Landing() {
  const { ready, authenticated } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated) {
      navigate('/dashboard');
    }
  }, [ready, authenticated, navigate]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Vela</h1>
            <LoginButton />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Your Gateway to
              <br />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Web3
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Bet on real-world events, support creators, play games, and collect NFTs—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <LoginButton />
              <a 
                href="#features" 
                className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="card text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Predictions</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Bet on real-world events and earn</p>
            </div>

            <div className="card text-center opacity-60">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎨</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Creators</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Support your favorites</p>
              <span className="text-xs text-gray-600 mt-2 block">Coming Soon</span>
            </div>

            <div className="card text-center opacity-60">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎮</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Play & Earn</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Games that reward you</p>
              <span className="text-xs text-gray-600 mt-2 block">Coming Soon</span>
            </div>

            <div className="card text-center opacity-60">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💎</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">NFTs</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Collect digital assets</p>
              <span className="text-xs text-gray-600 mt-2 block">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
            <p>© 2024 Vela. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}