import { useRef, useEffect } from 'react';

export default function AnimatedBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays
    video.play().catch(err => console.log('Video autoplay prevented:', err));
  }, []);

  return (
    <>
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover opacity-30 z-0"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-0" style={{ pointerEvents: 'none' }}></div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none z-0"></div>
      
      {/* Blue light beams (keeping these too for extra effect) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"
          style={{
            left: '20%',
            animation: 'floatBeam 8s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"
          style={{
            left: '50%',
            animation: 'floatBeam 10s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"
          style={{
            left: '80%',
            animation: 'floatBeam 12s ease-in-out infinite',
            animationDelay: '4s'
          }}
        ></div>
      </div>
    </>
  );
}