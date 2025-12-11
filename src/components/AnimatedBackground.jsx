import { useRef, useEffect } from 'react';

export default function AnimatedBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays and loops without causing re-renders
    video.play().catch(err => console.log('Video autoplay prevented:', err));

    // Prevent any events from bubbling up
    const preventBubble = (e) => {
      e.stopPropagation();
    };

    video.addEventListener('ended', preventBubble);
    video.addEventListener('play', preventBubble);
    video.addEventListener('pause', preventBubble);

    return () => {
      video.removeEventListener('ended', preventBubble);
      video.removeEventListener('play', preventBubble);
      video.removeEventListener('pause', preventBubble);
    };
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
      
      {/* Light beams */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      </div>
    </>
  );
}