import { useEffect } from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export default function RampWidget({ walletAddress, onClose, onSuccess }) {
  useEffect(() => {
    const widget = new RampInstantSDK({
      hostAppName: 'Vela',
      hostLogoUrl: 'https://via.placeholder.com/200', // Replace with your logo later
      userAddress: walletAddress,
      swapAsset: 'MATIC_USDC', // USDC on Polygon
      fiatCurrency: 'USD',
      fiatValue: 20, // Default $20
      variant: 'auto', // Auto-detects mobile/desktop
       
      url: 'https://app.ramp.network', // Production URL
    });

    widget.on('WIDGET_CLOSE', () => {
      console.log('Widget closed');
      onClose();
    });

    widget.on('PURCHASE_SUCCESSFUL', (event) => {
      console.log('✅ Purchase successful:', event);
      onSuccess(event);
    });

    widget.on('PURCHASE_CREATED', (event) => {
      console.log('📝 Purchase created:', event);
    });

    widget.show();

    return () => {
      widget.unsubscribe('*');
    };
  }, [walletAddress, onClose, onSuccess]);

  return null; // Widget renders itself
}