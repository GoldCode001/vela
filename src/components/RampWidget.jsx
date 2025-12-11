export default function RampWidget({ walletAddress, onClose }) {
  const rampUrl = `https://buy.ramp.network/?hostAppName=Vela&userAddress=${walletAddress}&swapAsset=MATIC_USDC&fiatCurrency=USD`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
    >
      <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden" style={{ height: '90vh', maxHeight: '700px' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
        >
          <span className="text-white text-xl">×</span>
        </button>

        <iframe
          src={rampUrl}
          title="Buy Crypto"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="payment; microphone; camera"
        />
      </div>
    </div>
  );
}