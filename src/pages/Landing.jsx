import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import AnimatedBackground from '../components/AnimatedBackground.jsx';

export default function Landing() {
  const navigate = useNavigate();
  const { login, authenticated } = usePrivy();

  const handleGetStarted = () => {
    if (authenticated) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'predictions',
      description: 'bet on real-world events - elections, sports, crypto. if you\'re right, you profit.',
    },
    {
      icon: '🏦',
      title: 'earn yield',
      description: 'park your idle USDC in DeFi protocols and earn ~5% APY. your money, your control.',
    },
    {
      icon: '📚',
      title: 'learn with AI',
      description: 'chat with goldman, our AI tutor. learn web3 concepts without the jargon.',
    },
    {
      icon: '💎',
      title: 'nfts & gaming',
      description: 'collect digital assets and play to earn. coming soon to vela.',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'sign up',
      description: 'create your account in seconds. no complicated wallet setup required.',
    },
    {
      step: '02',
      title: 'add funds',
      description: 'buy USDC with your credit card. simple fiat onramp, no crypto experience needed.',
    },
    {
      step: '03',
      title: 'start using',
      description: 'bet on predictions, earn yield, or learn web3. all in one place.',
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="text-white text-2xl font-bold">vela</span>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="glass-btn"
        >
          {authenticated ? 'open app' : 'get started'}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-6">
          <span className="glass-btn-sm text-xs">
            your web3 gateway
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          web3 made
          <br />
          actually simple
        </h1>
        
        <p className="text-gray-400 text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          bet on real events. earn yield on your money. learn crypto without the BS.
          <br />
          all in one super app.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="btn-primary text-base px-8 py-4"
          >
            launch app →
          </button>
          <button
            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary text-base px-8 py-4"
          >
            how it works
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="glass-card text-center">
            <p className="text-3xl font-bold text-white mb-1">100+</p>
            <p className="text-gray-500 text-sm">markets</p>
          </div>
          <div className="glass-card text-center">
            <p className="text-3xl font-bold text-white mb-1">~5%</p>
            <p className="text-gray-500 text-sm">APY on USDC</p>
          </div>
          <div className="glass-card text-center">
            <p className="text-3xl font-bold text-white mb-1">$0</p>
            <p className="text-gray-500 text-sm">to start</p>
          </div>
          <div className="glass-card text-center">
            <p className="text-3xl font-bold text-white mb-1">24/7</p>
            <p className="text-gray-500 text-sm">available</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            everything you need
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl">
            multiple utilities, one platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-white text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            how it works
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl">
            get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="glass-card">
                <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                <h3 className="text-white text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Connector Line */}
              {idx < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="glass-card text-center p-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ready to dive in?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            join the web3 revolution. no BS, just results.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg px-10 py-5"
          >
            launch vela →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="text-white text-2xl font-bold">vela</span>
              </div>
              <p className="text-gray-500 text-sm">
                your gateway to web3
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold mb-4">product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    predictions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    DeFi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    education
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    about
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-bold mb-4">community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    discord
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 vela. all rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">
                privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">
                terms
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">
                cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}