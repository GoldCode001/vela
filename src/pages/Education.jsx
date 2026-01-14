import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import AITutorChat from '../components/AITutorChat.jsx';

export default function Education() {
  const { ready, authenticated } = usePrivy();
  const navigate = useNavigate();
  const [showAITutor, setShowAITutor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dailyTip, setDailyTip] = useState('');

  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    // Set random daily tip
    const tips = [
      "gas fees are lowest on weekends when network activity drops",
      "never share your seed phrase - not even with support teams",
      "DeFi yields can change daily - always check current rates",
      "prediction markets reflect crowd wisdom, not certainty",
      "diversification reduces risk but also limits upside",
      "smart contracts are immutable - bugs can't be patched",
      "USDC is pegged 1:1 to USD and backed by reserves",
      "wallet addresses are case-sensitive - always double check",
      "test transactions with small amounts first",
      "private keys = ownership - lose them, lose everything"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);

  const learningTracks = [
    {
      id: 'beginner',
      title: 'beginner track',
      level: 'start here',
      description: 'learn web3 fundamentals from scratch',
      duration: '~30 mins',
      lessons: [
        { title: 'what is web3?', completed: false },
        { title: 'understanding wallets', completed: false },
        { title: 'what is USDC?', completed: false },
        { title: 'how predictions work', completed: false },
        { title: 'reading market odds', completed: false },
        { title: 'gas fees explained', completed: false },
      ],
      color: 'from-green-500/20 to-emerald-500/20',
      icon: '🌱'
    },
    {
      id: 'intermediate',
      title: 'intermediate track',
      level: 'level up',
      description: 'dive deeper into DeFi and strategies',
      duration: '~45 mins',
      lessons: [
        { title: 'DeFi basics', completed: false },
        { title: 'yield farming explained', completed: false },
        { title: 'smart contracts 101', completed: false },
        { title: 'risk management', completed: false },
        { title: 'portfolio strategy', completed: false },
        { title: 'analyzing markets', completed: false },
      ],
      color: 'from-blue-500/20 to-cyan-500/20',
      icon: '📈'
    },
    {
      id: 'advanced',
      title: 'advanced track',
      level: 'master level',
      description: 'advanced strategies and deep dives',
      duration: '~60 mins',
      lessons: [
        { title: 'trading strategies', completed: false },
        { title: 'on-chain analytics', completed: false },
        { title: 'market psychology', completed: false },
        { title: 'advanced DeFi', completed: false },
        { title: 'tax implications', completed: false },
        { title: 'security best practices', completed: false },
      ],
      color: 'from-purple-500/20 to-pink-500/20',
      icon: '🎓'
    },
  ];

  const glossary = [
    {
      term: 'DeFi',
      definition: 'decentralized finance - financial services without traditional intermediaries like banks',
      example: 'lending on aave is DeFi because no bank controls your funds'
    },
    {
      term: 'USDC',
      definition: 'USD coin - a stablecoin pegged 1:1 to the US dollar',
      example: '100 USDC always equals $100, unlike volatile crypto'
    },
    {
      term: 'Gas Fees',
      definition: 'transaction costs paid to blockchain validators',
      example: 'on polygon, gas fees are usually under $0.01'
    },
    {
      term: 'Wallet',
      definition: 'software that stores your private keys and lets you interact with blockchain',
      example: 'vela creates an embedded wallet for you automatically'
    },
    {
      term: 'Smart Contract',
      definition: 'self-executing code on blockchain that runs when conditions are met',
      example: 'prediction markets use smart contracts to automatically pay winners'
    },
    {
      term: 'Liquidity Pool',
      definition: 'collection of funds locked in a smart contract for trading or lending',
      example: 'aave pools let you earn interest on deposited USDC'
    },
    {
      term: 'APY',
      definition: 'annual percentage yield - how much you earn per year on deposits',
      example: '5% APY means $100 grows to $105 in one year'
    },
    {
      term: 'Seed Phrase',
      definition: '12-24 words that recover your wallet - never share these',
      example: 'lose your seed phrase = lose access to your funds forever'
    },
  ];

  const videos = [
    {
      title: 'web3 in 60 seconds',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with real URLs
      duration: '1:00',
      category: 'basics'
    },
    {
      title: 'how to use vela',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:30',
      category: 'tutorial'
    },
    {
      title: 'prediction markets explained',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2:45',
      category: 'predictions'
    },
    {
      title: 'earning with DeFi',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '4:15',
      category: 'defi'
    },
  ];

  const filteredGlossary = glossary.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            education
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">
            learn web3, crypto, and how to use vela effectively
          </p>
        </div>

        {/* Daily Tip */}
        <div className="glass-card mb-12 p-6 bg-white/5">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">tip of the day</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>

        {/* Chat with Goldman CTA */}
        <div className="glass-card mb-12 p-8 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-white text-2xl font-bold mb-3">chat with goldman</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            ask any question about web3, crypto, or how to use vela. goldman explains everything clearly without the jargon.
          </p>
          <button
            onClick={() => setShowAITutor(true)}
            className="glass-btn text-base px-8 py-3"
          >
            start chatting
          </button>
        </div>

        {/* Learning Tracks */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">learning paths</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {learningTracks.map((track) => (
              <div key={track.id} className="glass-card relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">{track.icon}</div>
                
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{track.level}</span>
                  <h3 className="text-white text-2xl font-bold mb-2">{track.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{track.description}</p>
                  <p className="text-gray-500 text-xs">{track.duration}</p>
                </div>

                <div className="space-y-2 mb-6">
                  {track.lessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        lesson.completed ? 'border-green-400 bg-green-400' : 'border-white/20'
                      }`}>
                        {lesson.completed && <span className="text-black text-xs">✓</span>}
                      </div>
                      <span className={lesson.completed ? 'text-white' : 'text-gray-400'}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAITutor(true)}
                  className="glass-btn-sm w-full text-center"
                >
                  start track
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">crypto glossary</h2>
            <span className="text-gray-500 text-sm">{glossary.length} terms</span>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search terms..."
              className="input max-w-md"
            />
          </div>

          {/* Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="glass-card">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-bold text-lg">{item.term}</h4>
                  <button
                    onClick={() => setShowAITutor(true)}
                    className="text-xs text-gray-500 hover:text-white transition"
                  >
                    ask goldman
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{item.definition}</p>
                <div className="text-xs text-gray-500 bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400">example:</span> {item.example}
                </div>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">no terms found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Video Library */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">video library</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <div key={idx} className="glass-card group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-5xl">▶️</div>
                </div>
                <h4 className="text-white font-bold mb-2">{video.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{video.category}</span>
                  <span className="text-gray-400">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">more resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-white font-bold mb-3">📰 reading</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">coindesk news</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">the defiant</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">bankless</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">🎧 podcasts</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">unchained</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">bankless</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">the breakdown</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">👥 community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">vela discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">vela telegram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Modal */}
      {showAITutor && (
        <AITutorChat onClose={() => setShowAITutor(false)} />
      )}
    </div>
  );
}