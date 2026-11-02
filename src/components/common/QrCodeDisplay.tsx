import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  includeMargin?: boolean;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  value,
  size = 200,
  className = '',
  includeMargin = true
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: includeMargin ? 2 : 0,
      color: {
        dark: '#101713',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setDataUrl(url))
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
  }, [value, size, includeMargin]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200 animate-pulse ${className}`}
      >
        <span className="text-xs text-slate-400 font-mono">Generating QR...</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Generated QR Code"
      width={size}
      height={size}
      className={`rounded-lg object-contain shadow-sm ${className}`}
    />
  );
};
