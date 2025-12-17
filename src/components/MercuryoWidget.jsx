export default function MercuryoWidget({ walletAddress, onClose, onSuccess, verifyOnly = false }) {
  // Direct Mercuryo URL - NO widget_id needed for iframe!
  const mercuryoUrl = `https://exchange.mercuryo.io/?currency=USDC&amount=${verifyOnly ? '10' : '100'}&address=${walletAddress}&network=POLYGON&type=buy&fiat_currency=USD&theme=dark`;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl" 
        style={{ height: '90vh', maxHeight: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition"
        >
          <span className="text-white text-2xl font-bold">×</span>
        </button>

        {/* Mercuryo Iframe */}
        <iframe
          src={mercuryoUrl}
          title="Buy Crypto"
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none',
          }}
          allow="payment; camera; microphone"
        />
      </div>
    </div>
  );
}