export default function AnimatedBackground() {
  return (
    <>
      {/* Dark gradient base */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0"></div>
      
      {/* Animated blue light beams */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Beam 1 */}
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
          style={{
            left: '15%',
            animation: 'floatBeam 8s ease-in-out infinite',
            animationDelay: '0s'
          }}
        ></div>
        
        {/* Beam 2 */}
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
          style={{
            left: '40%',
            animation: 'floatBeam 10s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
        
        {/* Beam 3 */}
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          style={{
            left: '65%',
            animation: 'floatBeam 12s ease-in-out infinite',
            animationDelay: '4s'
          }}
        ></div>
        
        {/* Beam 4 */}
        <div 
          className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent"
          style={{
            left: '85%',
            animation: 'floatBeam 9s ease-in-out infinite',
            animationDelay: '1s'
          }}
        ></div>

        {/* Floating orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          style={{
            animation: 'floatOrb 15s ease-in-out infinite',
            animationDelay: '0s'
          }}
        ></div>
        
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          style={{
            animation: 'floatOrb 18s ease-in-out infinite',
            animationDelay: '3s'
          }}
        ></div>

        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
          style={{
            animation: 'floatOrb 20s ease-in-out infinite',
            animationDelay: '6s'
          }}
        ></div>
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </>
  );
}