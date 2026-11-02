import React, { useState } from 'react';
import { ParticipantRegistration, ParticipantIDCardRecord } from '../../types';
import { storageService } from '../../services/storage';
import { formatRupiah, formatDateTimeIndo } from '../../utils/formatters';
import { Search, X, CheckCircle2, Clock, AlertTriangle, XCircle, Ticket, Upload, ArrowRight, CreditCard } from 'lucide-react';

interface TicketLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (reg: ParticipantRegistration) => void;
  onViewIDCard?: (card: ParticipantIDCardRecord) => void;
  onPayNow?: (reg: ParticipantRegistration) => void;
}

export const TicketLookupModal: React.FC<TicketLookupModalProps> = ({
  isOpen,
  onClose,
  onViewTicket,
  onViewIDCard,
  onPayNow
}) => {
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<ParticipantRegistration | null>(null);
  const [reuploadProof, setReuploadProof] = useState<string>('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim() || !email.trim()) return;

    const found = storageService.findRegistration(regNumber, email);
    setResult(found || null);
    setSearched(true);
    setFeedbackMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReuploadProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReuploadSubmit = () => {
    if (!result || !reuploadProof) return;
    setIsSubmittingProof(true);

    setTimeout(() => {
      const updated: ParticipantRegistration = {
        ...result,
        status: 'waiting_verification',
        paymentProofUrl: reuploadProof,
        paymentProofUploadedAt: new Date().toISOString(),
        rejectionReason: undefined
      };
      storageService.saveRegistration(updated);
      setResult(updated);
      setIsSubmittingProof(false);
      setReuploadProof('');
      setFeedbackMsg('Bukti pembayaran baru berhasil dikirim ulang! Mohon tunggu verifikasi admin.');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#101713] text-white">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
              Layanan Peserta
            </span>
            <h3 className="text-xl font-bold font-display mt-0.5">
              Cek Status Pendaftaran & E-Ticket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor Registrasi *
              </label>
              <input
                type="text"
                placeholder="Contoh: GNR-2026-9041"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#9BE34A] focus:border-[#101713] text-sm font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Email Terdaftar *
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#9BE34A] focus:border-[#101713] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#101713] text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Search className="w-4 h-4 text-[#9BE34A]" />
              Periksa Status Saya
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Tester */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Contoh Data Demo Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setRegNumber('GNR-2026-9041');
                  setEmail('siti.aisyah@example.com');
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Tiket Sah (GNR-2026-9041)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegNumber('GNR-2026-8812');
                  setEmail('dimas.prasetyo@example.com');
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                Menunggu Verifikasi (GNR-2026-8812)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegNumber('GNR-2026-2210');
                  setEmail('agus.setiawan@example.com');
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                Ditolak (GNR-2026-2210)
              </button>
            </div>
          </div>

          {feedbackMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
              {feedbackMsg}
            </div>
          )}

          {/* Search Result */}
          {searched && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              {!result ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Data Tidak Ditemukan</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Kombinasi Nomor Registrasi dan Email tidak cocok. Pastikan penulisan sesuai bukti konfirmasi awal.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                        Status Pendaftaran
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {result.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            PEMBAYARAN SAH (APPROVED)
                          </span>
                        )}
                        {result.status === 'waiting_verification' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            MENUNGGU VERIFIKASI ADMIN
                          </span>
                        )}
                        {result.status === 'pending_payment' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
                            BELUM UPLOAD BUKTI QRIS
                          </span>
                        )}
                        {result.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            BUKTI PEMBAYARAN DITOLAK
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Nominal</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {formatRupiah(result.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Event</span>
                      <strong className="text-slate-800 block truncate">{result.eventName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Kategori</span>
                      <strong className="text-emerald-700 block">{result.categoryName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nama Peserta</span>
                      <span className="text-slate-800 block">{result.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tanggal Daftar</span>
                      <span className="text-slate-600 block">{formatDateTimeIndo(result.registeredAt)}</span>
                    </div>
                  </div>

                  {/* ACTION BASED ON STATUS */}
                  {result.status === 'approved' && (
                    <div className="pt-2 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onViewTicket(result);
                            onClose();
                          }}
                          className="py-3 px-4 bg-[#101713] text-[#9BE34A] font-extrabold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                        >
                          <Ticket className="w-4 h-4" />
                          Buka E-Ticket
                        </button>

                        {(() => {
                          const cardRecord = storageService.getParticipantIDCardByRegId(result.id);
                          if (cardRecord && onViewIDCard) {
                            return (
                              <button
                                onClick={() => {
                                  onViewIDCard(cardRecord);
                                  onClose();
                                }}
                                className="py-3 px-4 bg-[#9BE34A] text-[#101713] font-black uppercase tracking-wider rounded-xl hover:bg-[#8cd43b] transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                              >
                                <CreditCard className="w-4 h-4" />
                                Digital ID Card (PNG/PDF)
                              </button>
                            );
                          }
                          return (
                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 text-[11px] flex items-center justify-center text-center">
                              ID Card dalam antrean cetak
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {result.status === 'waiting_verification' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                      <p className="font-semibold">Bukti pembayaran Anda sedang diproses oleh admin.</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Verifikasi umumnya berlangsung 1x24 jam. Begitu diverifikasi, E-Ticket dan Nomor BIB Anda akan langsung aktif di sini.
                      </p>
                    </div>
                  )}

                  {result.status === 'pending_payment' && onPayNow && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onPayNow(result);
                          onClose();
                        }}
                        className="w-full py-3 px-4 bg-[#101713] text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                      >
                        Lanjutkan Pembayaran QRIS
                        <ArrowRight className="w-4 h-4 text-[#9BE34A]" />
                      </button>
                    </div>
                  )}

                  {result.status === 'rejected' && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                        <strong className="block text-rose-800">Alasan Penolakan:</strong>
                        <p className="mt-1 text-rose-700">{result.rejectionReason}</p>
                      </div>

                      {/* Reupload form */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                          Upload Ulang Bukti Pembayaran yang Sah
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleFileUpload}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                        />
                        {reuploadProof && (
                          <div className="mt-3">
                            <span className="block text-[11px] text-slate-500 mb-1">Preview Bukti Baru:</span>
                            <img
                              src={reuploadProof}
                              alt="Bukti Baru"
                              className="w-32 h-32 object-cover rounded-lg border border-slate-300"
                            />
                            <button
                              type="button"
                              onClick={handleReuploadSubmit}
                              disabled={isSubmittingProof}
                              className="mt-2 py-2 px-4 bg-[#101713] text-white text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#9BE34A]" />
                              {isSubmittingProof ? 'Mengirim...' : 'Kirim Bukti Pembayaran Baru'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
