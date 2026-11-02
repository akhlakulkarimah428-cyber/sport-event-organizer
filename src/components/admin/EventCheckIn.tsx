import React, { useState } from 'react';
import { ParticipantRegistration, SportEvent } from '../../types';
import { storageService } from '../../services/storage';
import { formatDateTimeIndo } from '../../utils/formatters';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';

interface EventCheckInProps {
  events: SportEvent[];
  registrations: ParticipantRegistration[];
  onRefresh: () => void;
}

export const EventCheckIn: React.FC<EventCheckInProps> = ({ events, registrations, onRefresh }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [scanQuery, setScanQuery] = useState('');
  const [gateOfficerName, setGateOfficerName] = useState('Petugas Gate A');

  // Result state
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    participant?: ParticipantRegistration;
    alreadyCheckedIn?: boolean;
  } | null>(null);

  // Filtered stats for selected event
  const eventParticipants = registrations.filter(
    r => r.eventId === selectedEventId && r.status === 'approved'
  );
  const checkedInCount = eventParticipants.filter(r => r.isCheckedIn).length;
  const remainingCount = Math.max(0, eventParticipants.length - checkedInCount);
  const percentage = eventParticipants.length > 0 ? Math.round((checkedInCount / eventParticipants.length) * 100) : 0;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleProcessCode = (code: string) => {
    if (!code.trim()) return;

    const res = storageService.verifyCheckIn(code.trim(), gateOfficerName);
    setScanResult(res);
    setScanQuery('');
    onRefresh();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessCode(scanQuery);
  };

  return (
    <div className="space-y-8">
      {/* Top Title & Event Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            Event Race-Day Check-In (QR Scanner)
          </h2>
          <p className="text-xs text-slate-500">
            Validasi E-Ticket peserta secara instan pada pintu gerbang / pengambilan Race Pack.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase whitespace-nowrap">
            Pilih Event:
          </label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Total Peserta Approved
          </span>
          <span className="text-2xl font-black font-display text-slate-900 block mt-1">
            {eventParticipants.length}
          </span>
          <span className="text-[10px] text-slate-400">Pendaftar siap tanding</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block tracking-wider">
            Sudah Check-In
          </span>
          <span className="text-2xl font-black font-display text-emerald-900 block mt-1">
            {checkedInCount}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Telah hadir di venue ({percentage}%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Belum Check-In
          </span>
          <span className="text-2xl font-black font-display text-slate-700 block mt-1">
            {remainingCount}
          </span>
          <span className="text-[10px] text-slate-400">Masih dalam perjalanan</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#101713] text-white border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold uppercase text-[#9BE34A] block tracking-wider">
            Pos / Gate Petugas
          </span>
          <input
            type="text"
            value={gateOfficerName}
            onChange={e => setGateOfficerName(e.target.value)}
            className="mt-1 w-full bg-white/10 px-2 py-1 rounded text-xs font-bold text-white border border-white/20 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block mt-1">Tercatat di log check-in</span>
        </div>
      </div>

      {/* SCANNER & VALIDATION INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input & Scanner Console (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
              KONSOL VALIDASI
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5">
              Scan Barcode / Masukkan Kode Tiket
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan barcode scanner, kamera HP, atau ketik langsung Nomor Registrasi / Kode Tiket.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kode QR Tiket / Nomor Registrasi *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: TK-GNR26-9041-A89F atau GNR-2026-9041"
                  value={scanQuery}
                  onChange={e => setScanQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 font-mono text-sm uppercase focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  autoFocus
                />
                <QrCode className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-[#101713] text-[#9BE34A] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <UserCheck className="w-4 h-4" />
                Validasi & Proses Check-In
              </button>
            </div>
          </form>

          {/* Quick Demo Scan Buttons for Testing */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Coba Uji Skenario dengan Data Sampel:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleProcessCode('TK-GNR26-9041-A89F')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                1. Check-In Sah (Siti Nur Aisyah)
              </button>
              <button
                type="button"
                onClick={() => handleProcessCode('TK-GNR26-7734-C33B')}
                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                2. Uji Check-In Ganda (Budi Santoso)
              </button>
              <button
                type="button"
                onClick={() => handleProcessCode('TK-INVALID-CODE-999')}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                3. Uji QR Palsu / Tidak Terdaftar
              </button>
            </div>
          </div>
        </div>

        {/* Right: Validation Result Card (5 Cols) */}
        <div className="lg:col-span-5">
          {!scanResult ? (
            <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-300 text-center text-slate-400">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h4 className="font-bold text-sm text-slate-700">Menunggu Input Tiket</h4>
              <p className="text-xs text-slate-500 mt-1">
                Arahkan barcode scanner ke layar tiket peserta atau pilih data demonstrasi di sebelah kiri.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-3xl p-6 border shadow-lg transition-all ${
                scanResult.success
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : scanResult.alreadyCheckedIn
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {/* Header Icon */}
              <div className="flex items-center gap-3 pb-4 border-b border-black/10">
                {scanResult.success ? (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : scanResult.alreadyCheckedIn ? (
                  <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold font-display text-base">
                    {scanResult.success
                      ? 'CHECK-IN BERHASIL'
                      : scanResult.alreadyCheckedIn
                      ? 'PERINGATAN: CHECK-IN GANDA'
                      : 'CHECK-IN DITOLAK'}
                  </h4>
                  <p className="text-xs leading-snug opacity-85 mt-0.5">{scanResult.message}</p>
                </div>
              </div>

              {/* Participant Details Card if found */}
              {scanResult.participant && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2 text-xs text-slate-800">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-base font-display">{scanResult.participant.fullName}</span>
                    {scanResult.participant.bibNumber && (
                      <span className="px-2 py-0.5 rounded font-mono font-black text-[#101713] bg-[#9BE34A]">
                        {scanResult.participant.bibNumber}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block uppercase">Kategori</span>
                      <strong className="text-emerald-700">{scanResult.participant.categoryName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Jersey Size</span>
                      <strong className="text-slate-800">{scanResult.participant.jerseySize || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">No. Registrasi</span>
                      <span className="font-mono text-slate-800">{scanResult.participant.registrationNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Waktu Check-In</span>
                      <span className="font-mono text-slate-800">
                        {scanResult.participant.checkedInAt
                          ? new Date(scanResult.participant.checkedInAt).toLocaleTimeString('id-ID')
                          : 'Baru saja'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
