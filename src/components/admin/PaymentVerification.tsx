import React, { useState } from 'react';
import { ParticipantRegistration } from '../../types';
import { storageService } from '../../services/storage';
import { formatRupiah, formatDateTimeIndo } from '../../utils/formatters';
import {
  CheckCircle2,
  XCircle,
  ZoomIn,
  X,
  AlertCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface PaymentVerificationProps {
  registrations: ParticipantRegistration[];
  onRefresh: () => void;
  selectedRegistrationToVerify?: ParticipantRegistration | null;
  onViewETicket: (reg: ParticipantRegistration) => void;
}

export const PaymentVerification: React.FC<PaymentVerificationProps> = ({
  registrations,
  onRefresh,
  selectedRegistrationToVerify,
  onViewETicket
}) => {
  const [activeReceiptZoom, setActiveReceiptZoom] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<ParticipantRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState(
    'Nominal transfer pada resi tidak sesuai dengan total tagihan event. Silakan upload bukti transfer yang benar.'
  );

  const pendingList = registrations.filter(r => r.status === 'waiting_verification');
  const recentApprovedList = registrations.filter(r => r.status === 'approved').slice(0, 5);
  const recentRejectedList = registrations.filter(r => r.status === 'rejected');

  const handleApprove = (item: ParticipantRegistration) => {
    storageService.updateRegistrationStatus(item.id, 'approved');
    onRefresh();
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    storageService.updateRegistrationStatus(rejectingItem.id, 'rejected', {
      rejectionReason: rejectionReason.trim()
    });
    setRejectingItem(null);
    onRefresh();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900">
          Verifikasi Pembayaran QRIS Manual
        </h2>
        <p className="text-xs text-slate-500">
          Periksa kecocokan resi pembayaran, nominal tagihan, dan setujui penerbitan E-Ticket & BIB number resmi.
        </p>
      </div>

      {/* QUEUE OF WAITING VERIFICATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Antrean Menunggu Verifikasi
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {pendingList.length} Menunggu
            </span>
          </div>
        </div>

        {pendingList.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">Antrean Verifikasi Kosong</h4>
            <p className="text-xs text-slate-500 mt-1">
              Seluruh bukti pembayaran peserta saat ini telah diproses dengan tuntas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingList.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {item.registrationNumber}
                      </span>
                      <h4 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                        {item.fullName}
                      </h4>
                      <span className="text-xs text-slate-500">{item.eventName}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Harus Dibayar
                      </span>
                      <span className="text-lg font-black font-mono text-emerald-700">
                        {formatRupiah(item.amount)}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {item.categoryName}
                      </span>
                    </div>
                  </div>

                  {/* Body with Receipt Preview */}
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Left: Info */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">WhatsApp</span>
                        <strong className="text-slate-800 font-mono">{item.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                        <span className="text-slate-800 font-mono">{item.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Waktu Upload</span>
                        <span className="text-slate-600">
                          {formatDateTimeIndo(item.paymentProofUploadedAt || item.registeredAt)}
                        </span>
                      </div>
                      {item.jerseySize && (
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Jersey Size</span>
                          <span className="font-bold text-slate-800">{item.jerseySize}</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Receipt thumbnail with Zoom trigger */}
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square max-w-[200px] mx-auto sm:mx-0 flex items-center justify-center">
                      {item.paymentProofUrl ? (
                        <>
                          <img
                            src={item.paymentProofUrl}
                            alt="Bukti Transfer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <button
                            type="button"
                            onClick={() => setActiveReceiptZoom(item.paymentProofUrl!)}
                            className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ZoomIn className="w-6 h-6 text-[#9BE34A] mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Perbesar Resi
                            </span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 text-center p-2">
                          Tidak ada file resi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRejectingItem(item)}
                    className="py-2 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak Pembayaran
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(item)}
                    className="py-2.5 px-6 rounded-xl bg-[#101713] text-[#9BE34A] hover:bg-slate-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Setujui & Terbitkan E-Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENTLY APPROVED HISTORY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold font-display text-slate-900 mb-4">
          Riwayat Pembayaran Baru Saja Disetujui (Approved)
        </h3>
        <div className="divide-y divide-slate-100">
          {recentApprovedList.map(app => (
            <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-slate-900">{app.fullName}</strong>
                <span className="text-slate-500 font-mono ml-2">({app.registrationNumber})</span>
                <span className="text-emerald-700 font-semibold ml-2">BIB: {app.bibNumber}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900">{formatRupiah(app.amount)}</span>
                <button
                  onClick={() => onViewETicket(app)}
                  className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 hover:bg-emerald-100"
                >
                  Cetak E-Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold opacity-80">
                  Konfirmasi Penolakan
                </span>
                <h3 className="text-lg font-bold font-display mt-0.5">
                  Tolak Pembayaran: {rejectingItem.fullName}
                </h3>
              </div>
              <button onClick={() => setRejectingItem(null)} className="p-1.5 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Peserta akan menerima alasan ini saat mengecek status di portal dan diberikan kesempatan untuk mengunggah ulang bukti pembayaran yang sah.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Penolakan Pembayaran *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Simpan Penolakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX RECEIPT ZOOM */}
      {activeReceiptZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveReceiptZoom(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveReceiptZoom(null)}
              className="absolute -top-10 right-0 p-1 text-white hover:text-[#9BE34A]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeReceiptZoom}
              alt="Bukti Transfer Penuh"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
