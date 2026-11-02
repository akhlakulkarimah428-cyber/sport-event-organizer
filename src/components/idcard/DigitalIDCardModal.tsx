import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ParticipantIDCardRecord } from '../../types';
import { IDCardBadge } from './IDCardBadge';
import { formatDateIndo } from '../../utils/formatters';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  Share2,
  Sparkles,
  QrCode,
  ShieldCheck,
  FileImage,
  Info
} from 'lucide-react';

interface DigitalIDCardModalProps {
  cardRecord: ParticipantIDCardRecord;
  onClose: () => void;
}

export const DigitalIDCardModal: React.FC<DigitalIDCardModalProps> = ({
  cardRecord,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadPng = async () => {
    const el = document.getElementById(`idcard-render-node-${cardRecord.id}`);
    if (!el) return;

    try {
      setIsExportingPng(true);
      const canvas = await html2canvas(el, {
        scale: 3, // High DPI output for crystal sharp print quality
        useCORS: true,
        backgroundColor: null
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `IDCard_${cardRecord.registrationNumber}_${cardRecord.bibNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
      alert('Gagal mengekspor gambar ID Card. Silakan gunakan tombol Cetak / PDF.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Digital ID Card - ${cardRecord.participantName}`,
        text: `ID Card Peserta ${cardRecord.eventName} (${cardRecord.bibNumber})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 flex flex-col items-center">
        
        {/* Floating Top Bar (No Print) */}
        <div className="w-full flex items-center justify-between mb-4 no-print">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#9BE34A] text-[#101713] shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Digital ID Card Resmi
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline-block">
              {cardRecord.bibNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#101713] rounded-xl hover:bg-slate-800 transition-colors shadow-md border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 text-[#9BE34A]" />
              Cetak / PDF
            </button>
            <button
              onClick={handleDownloadPng}
              disabled={isExportingPng}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#101713] bg-[#9BE34A] rounded-xl hover:bg-[#8cd43b] transition-colors shadow-md disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExportingPng ? 'Memproses...' : 'Download PNG'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-black/40 rounded-xl transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BADGE WRAPPER */}
        <div id="printable-idcard-badge" className="p-3 sm:p-5 flex justify-center w-full">
          <div id={`idcard-render-node-${cardRecord.id}`} ref={cardRef}>
            <IDCardBadge
              template={cardRecord.templateSnapshot}
              participantName={cardRecord.participantName}
              bibNumber={cardRecord.bibNumber}
              categoryName={cardRecord.categoryName}
              registrationNumber={cardRecord.registrationNumber}
              eventName={cardRecord.eventName}
              qrToken={cardRecord.qrToken}
              photoUrl={cardRecord.participantPhotoUrl}
              customBadgeNote="OFFICIAL ATHLETE"
            />
          </div>
        </div>

        {/* Helper Footer (No Print) */}
        <div className="w-full max-w-md mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs space-y-2 no-print text-center">
          <div className="flex items-center justify-center gap-2 text-[#9BE34A] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>QR Code Terhubung dengan Modul Check-In Gate</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Tunjukkan ID Card ini (cetak atau di layar HP) kepada petugas saat tiba di lokasi untuk pengambilan race kit dan verifikasi kehadiran.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleShare}
              className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-[#9BE34A]" />
              {copiedLink ? 'Link Tersalin!' : 'Bagikan ID Card'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
