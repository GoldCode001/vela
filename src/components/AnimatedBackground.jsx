import { memo } from 'react';

function AnimatedBackground() {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 z-0"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      <div className="fixed inset-0 bg-black/50 z-0"></div>
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none z-0"></div>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      </div>
    </>
  );
}

export default memo(AnimatedBackground);