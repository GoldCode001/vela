import { useEffect } from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export default function RampWidget({ walletAddress, onClose, onSuccess }) {
  useEffect(() => {
    const widget = new RampInstantSDK({
      hostAppName: 'Vela',
      hostLogoUrl: window.location.origin + '/vite.svg',
      hostApiKey: '', // Leave empty for now - works in test mode
      userAddress: walletAddress,
      swapAsset: 'MATIC_USDC',
      swapAmount: '20000000', // $20 in smallest unit (6 decimals for USDC)
      fiatCurrency: 'USD',
      fiatValue: '20',
      variant: 'auto',
      // IMPORTANT: Use correct endpoint
      url: 'https://app.ramp.network',
    })
      .on('WIDGET_CLOSE', () => {
        console.log('Widget closed');
        onClose();
      })
      .on('PURCHASE_SUCCESSFUL', (event) => {
        console.log('✅ Purchase successful:', event);
        onSuccess(event);
      })
      .on('PURCHASE_CREATED', (event) => {
        console.log('📝 Purchase created:', event);
      })
      .on('*', (event) => {
        console.log('Ramp event:', event);
      });

    widget.show();

    return () => {
      widget.unsubscribe('*');
    };
  }, [walletAddress, onClose, onSuccess]);

  return null;
}