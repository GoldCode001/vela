import { useEffect, useState } from 'react';

export default function RampWidget({ walletAddress, onClose }) {
  const handleOpenRamp = () => {
    const params = new URLSearchParams({
      userAddress: walletAddress,
      swapAsset: 'MATIC_USDC',
      fiatCurrency: 'USD',
      hostAppName: 'Vela',
    });

    const rampUrl = `https://app.ramp.network?${params.toString()}`;
    window.open(rampUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-8 max-w-md mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-white mb-4">Add Funds</h3>
        <p className="text-gray-400 mb-6">
          You'll be redirected to Ramp Network to buy USDC with your credit card.
        </p>
        <button
          onClick={handleOpenRamp}
          className="btn-primary w-full mb-3"
        >
          Open Ramp Network
        </button>
        <button
          onClick={onClose}
          className="btn-secondary w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}