export default function AnimatedBackground() {
  return (
    <>
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 z-0"
        onEnded={(e) => e.target.play()}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-0"></div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none z-0"></div>
      
      {/* Light beams - REDUCED BRIGHTNESS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-beam"></div>
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent animate-beam-delay-1"></div>
        <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-beam-delay-2"></div>
      </div>
    </>
  );
}