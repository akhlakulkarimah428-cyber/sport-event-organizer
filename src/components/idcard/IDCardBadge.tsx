import React from 'react';
import { IDCardTemplate, IDCardOrientation, IDCardSizePreset } from '../../types';
import { QrCodeDisplay } from '../common/QrCodeDisplay';
import { User, ShieldCheck } from 'lucide-react';

interface IDCardBadgeProps {
  template: IDCardTemplate;
  participantName: string;
  bibNumber: string;
  categoryName: string;
  registrationNumber: string;
  eventName: string;
  qrToken: string;
  photoUrl?: string;
  customBadgeNote?: string;
  scale?: number;
  className?: string;
  id?: string;
}

export const IDCardBadge: React.FC<IDCardBadgeProps> = ({
  template,
  participantName,
  bibNumber,
  categoryName,
  registrationNumber,
  eventName,
  qrToken,
  photoUrl,
  customBadgeNote,
  scale = 1,
  className = '',
  id
}) => {
  const isLandscape = template.orientation === 'landscape';
  const isCR80 = template.sizePreset === 'CR80';

  // Card dimensions in pixels for standard screen rendering:
  // Badge (portrait): 340px x 480px (~90mm x 120mm ratio)
  // Badge (landscape): 480px x 340px
  // CR80 (portrait): 320px x 490px
  // CR80 (landscape): 480px x 300px (~86mm x 54mm ratio)
  const width = isLandscape ? 460 : isCR80 ? 300 : 340;
  const height = isLandscape ? (isCR80 ? 290 : 340) : (isCR80 ? 460 : 490);

  const bgColor = template.backgroundColor || '#101713';
  const accentColor = template.accentColor || '#9BE34A';
  const textColor = template.textColor || '#FFFFFF';

  // Helper to check element visibility
  const isElementVisible = (key: string) => {
    const el = template.elements?.find(e => e.key === key);
    return el ? el.visible : true;
  };

  const getElementStyle = (key: string) => {
    return template.elements?.find(e => e.key === key);
  };

  return (
    <div
      id={id}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        backgroundColor: bgColor,
        color: textColor
      }}
      className={`relative select-none overflow-hidden rounded-[24px] shadow-2xl border border-slate-700/60 font-sans transition-all flex flex-col justify-between ${className}`}
    >
      {/* Background ambient accents */}
      <div
        className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-15"
        style={{ backgroundColor: accentColor }}
      />

      {/* PORTRAIT BADGE LAYOUT */}
      {!isLandscape ? (
        <div className="relative z-10 flex flex-col h-full justify-between p-5 text-center">
          
          {/* Top Header: Brand & Event */}
          <div className="space-y-1">
            {isElementVisible('org_logo') && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="text-sm font-black font-display tracking-tight" style={{ color: textColor }}>
                  KINETIX
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span
                  className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ml-1"
                  style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                >
                  OFFICIAL ATHLETE
                </span>
              </div>
            )}

            {isElementVisible('event_name') && (
              <h3
                className="text-xs font-black font-display line-clamp-1 uppercase tracking-wide mt-1"
                style={{ color: accentColor }}
              >
                {eventName}
              </h3>
            )}
          </div>

          {/* Center Section: Photo & BIB */}
          <div className="my-auto py-2 flex flex-col items-center justify-center space-y-3">
            {/* Participant Photo */}
            {isElementVisible('participant_photo') && (
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-md flex items-center justify-center bg-slate-800"
                  style={{ borderColor: accentColor }}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={participantName}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <User className="w-10 h-10 stroke-1" />
                      <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 text-slate-500">
                        Athlete
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow"
                  style={{ backgroundColor: accentColor, color: '#101713' }}
                >
                  VERIFIED
                </div>
              </div>
            )}

            {/* BIB Number */}
            {isElementVisible('bib_number') && (
              <div className="pt-1">
                <span className="text-[10px] font-bold tracking-widest uppercase block opacity-70">
                  NOMOR BIB
                </span>
                <span
                  className="text-3xl font-black font-mono tracking-tight block leading-none mt-0.5"
                  style={{ color: accentColor }}
                >
                  {bibNumber || 'BIB-0000'}
                </span>
              </div>
            )}

            {/* Participant Name */}
            {isElementVisible('participant_name') && (
              <div className="px-2">
                <h2
                  className="text-base font-extrabold font-display leading-tight truncate max-w-[270px] mx-auto"
                  style={{ color: textColor }}
                >
                  {participantName}
                </h2>
              </div>
            )}

            {/* Category Pill */}
            {isElementVisible('category') && (
              <div
                className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm"
                style={{ backgroundColor: accentColor, color: '#101713' }}
              >
                {categoryName}
              </div>
            )}

            {isElementVisible('reg_number') && (
              <span className="text-[10px] font-mono opacity-60 block">
                {registrationNumber}
              </span>
            )}
          </div>

          {/* Bottom Section: QR Code & Badge Note */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-left">
            <div className="text-[10px] space-y-0.5 leading-tight">
              <span className="block font-bold uppercase tracking-wider text-[9px]" style={{ color: accentColor }}>
                {customBadgeNote || 'EVENT PASS'}
              </span>
              <span className="block opacity-60 text-[9px]">Gunakan untuk Gate Check-in</span>
              <span className="block opacity-40 font-mono text-[8px]">ID: {qrToken.slice(0, 14)}</span>
            </div>

            {isElementVisible('qr_code') && (
              <div className="bg-white p-1 rounded-xl shadow-md shrink-0">
                <QrCodeDisplay value={qrToken} size={58} includeMargin={false} />
              </div>
            )}
          </div>

        </div>
      ) : (
        /* LANDSCAPE BADGE / CR80 LAYOUT */
        <div className="relative z-10 flex h-full justify-between p-5 text-left">
          
          {/* Left Column: Photo & QR */}
          <div className="flex flex-col justify-between items-center w-28 shrink-0 border-r border-white/10 pr-4">
            {isElementVisible('participant_photo') && (
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-md flex items-center justify-center bg-slate-800"
                style={{ borderColor: accentColor }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={participantName}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="w-8 h-8 stroke-1" />
                    <span className="text-[8px] uppercase font-bold text-slate-500">Athlete</span>
                  </div>
                )}
              </div>
            )}

            {isElementVisible('qr_code') && (
              <div className="bg-white p-1 rounded-xl shadow-md mt-2">
                <QrCodeDisplay value={qrToken} size={64} includeMargin={false} />
              </div>
            )}
          </div>

          {/* Right Column: Event, BIB, Name, Category */}
          <div className="flex-1 pl-4 flex flex-col justify-between">
            <div>
              {/* Brand & Event */}
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black font-display tracking-tight">KINETIX</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                </div>
                <span className="text-[9px] font-mono opacity-60">{registrationNumber}</span>
              </div>

              {isElementVisible('event_name') && (
                <h3
                  className="text-xs font-black font-display uppercase tracking-wide truncate mt-1"
                  style={{ color: accentColor }}
                >
                  {eventName}
                </h3>
              )}

              {/* BIB */}
              {isElementVisible('bib_number') && (
                <div className="mt-1">
                  <span className="text-[9px] font-bold tracking-widest uppercase block opacity-60">
                    BIB NUMBER
                  </span>
                  <span
                    className="text-2xl font-black font-mono leading-none tracking-tight block"
                    style={{ color: accentColor }}
                  >
                    {bibNumber || 'BIB-0000'}
                  </span>
                </div>
              )}

              {/* Name */}
              {isElementVisible('participant_name') && (
                <h2 className="text-sm font-black font-display mt-2 leading-tight truncate">
                  {participantName}
                </h2>
              )}
            </div>

            {/* Bottom Bar: Category & Badge Note */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              {isElementVisible('category') && (
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                  style={{ backgroundColor: accentColor, color: '#101713' }}
                >
                  {categoryName}
                </span>
              )}
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                {customBadgeNote || 'OFFICIAL PASS'}
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
