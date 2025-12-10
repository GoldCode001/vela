import { useState, useEffect } from 'react';

export default function MarketCarousel({ markets, onSelectMarket }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % markets.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + markets.length) % markets.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (touchStart - touchEnd > 75) {
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      goToPrev();
    }
    
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!markets || markets.length === 0) return null;

  const formatProbability = (price) => {
    return `${(parseFloat(price) * 100).toFixed(0)}%`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getCardStyle = (index) => {
    const position = index - currentIndex;
    const isMobile = window.innerWidth < 768;
    const mainOffset = isMobile ? 200 : 300;
    const stackOffset = isMobile ? 30 : 40;
    
    if (position === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 50,
        filter: 'blur(0px) brightness(1)',
      };
    }
    
    if (position > 0 && position <= 3) {
      return {
        transform: `translateX(${mainOffset + (position - 1) * stackOffset}px) scale(${0.9 - position * 0.05}) rotateY(-15deg)`,
        opacity: 0.6 - position * 0.15,
        zIndex: 50 - position,
        filter: `blur(${position * 2}px) brightness(0.7)`,
      };
    }
    
    if (position < 0 && position >= -3) {
      const absPos = Math.abs(position);
      return {
        transform: `translateX(-${mainOffset + (absPos - 1) * stackOffset}px) scale(${0.9 - absPos * 0.05}) rotateY(15deg)`,
        opacity: 0.6 - absPos * 0.15,
        zIndex: 50 - absPos,
        filter: `blur(${absPos * 2}px) brightness(0.7)`,
      };
    }
    
    return {
      transform: 'translateX(0) scale(0.5)',
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    };
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      <div 
        className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {markets.map((market, index) => {
          const cardStyle = getCardStyle(index);
          const position = index - currentIndex;
          const isActive = position === 0;

          return (
            <div
              key={market.id}
              className="absolute transition-all duration-700 ease-in-out cursor-pointer"
              style={cardStyle}
              onClick={() => {
                if (position > 0) goToNext();
                else if (position < 0) goToPrev();
                else if (isActive) onSelectMarket(market);
              }}
            >
              <div className="w-[320px] md:w-[400px] h-[480px] md:h-[550px] relative perspective-1000">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transform-gpu">
                  <div className="p-5 md:p-6 flex flex-col h-full">
                    {market.image && (
                      <div className="relative h-32 md:h-40 overflow-hidden rounded-2xl bg-gray-900/50 -mx-5 md:-mx-6 -mt-5 md:-mt-6 mb-4">
                        <img 
                          src={market.image} 
                          alt={market.question}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className="stat-badge text-xs">{market.category}</span>
                      <span className="text-gray-500 text-xs">Vol: {formatVolume(market.volume)}</span>
                    </div>

                    <h3 className="text-white text-lg md:text-xl font-bold leading-tight line-clamp-3 mb-3">
                      {market.question}
                    </h3>

                    {market.description && (
                      <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-3">
                        {market.description}
                      </p>
                    )}

                    {/* Spacer pushes content below to bottom */}
                    <div className="flex-1"></div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div 
                        className="outcome-btn pointer-events-none transition-all duration-700"
                        style={{
                          transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        <p className="text-gray-500 text-xs mb-1">Yes</p>
                        <p className="text-green-400 text-2xl md:text-3xl font-bold">
                          {formatProbability(market.outcomePrices[0])}
                        </p>
                      </div>
                      <div 
                        className="outcome-btn pointer-events-none transition-all duration-700"
                        style={{
                          transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        <p className="text-gray-500 text-xs mb-1">No</p>
                        <p className="text-red-400 text-2xl md:text-3xl font-bold">
                          {formatProbability(market.outcomePrices[1])}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="transition-all duration-700"
                      style={{
                        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      {isActive && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMarket(market);
                          }}
                          className="w-full btn-primary text-sm py-3"
                        >
                          Place Bet
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div 
                    className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-xl -z-10"
                    style={{
                      animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={goToPrev}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {markets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              rounded-full transition-all duration-500
              ${index === currentIndex 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'}
            `}
          />
        ))}
      </div>

      <div className="md:hidden text-center mt-4 text-gray-500 text-sm animate-pulse">
        👈 Swipe to browse 👉
      </div>
    </div>
  );
}