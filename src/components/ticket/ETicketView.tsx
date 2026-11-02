import React from 'react';
import { ParticipantRegistration, SportEvent } from '../../types';
import { QrCodeDisplay } from '../common/QrCodeDisplay';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';
import { Printer, Download, X, ShieldCheck, MapPin, Calendar, Clock, Award, CheckCircle2 } from 'lucide-react';

interface ETicketViewProps {
  registration: ParticipantRegistration;
  event?: SportEvent;
  onClose: () => void;
}

export const ETicketView: React.FC<ETicketViewProps> = ({
  registration,
  event,
  onClose
}) => {
  const qrValue = registration.ticketCode || registration.registrationNumber;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8">
        {/* Floating Actions */}
        <div className="flex items-center justify-between mb-3 no-print">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9BE34A] text-[#101713]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              E-Ticket Resmi Terverifikasi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#101713] rounded-xl hover:bg-slate-800 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4 text-[#9BE34A]" />
              Cetak / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-black/40 rounded-xl transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE TICKET CARD */}
        <div
          id="printable-eticket"
          className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 text-[#101713]"
        >
          {/* Top Brand Header */}
          <div className="relative bg-[#101713] text-white p-6 sm:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#9BE34A]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-extrabold tracking-tight text-white font-display">
                    KINETIX<span className="text-[#9BE34A]">.</span>
                  </span>
                  <span className="text-xs tracking-widest text-[#9BE34A] uppercase font-bold px-2 py-0.5 bg-[#9BE34A]/15 rounded-md border border-[#9BE34A]/30">
                    OFFICIAL E-PASS
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight">
                  {registration.eventName}
                </h2>
              </div>

              {/* BIB Display */}
              {registration.bibNumber && (
                <div className="bg-[#9BE34A] text-[#101713] rounded-2xl p-3 sm:p-4 text-center min-w-[100px] shadow-lg shrink-0">
                  <span className="block text-[10px] font-bold tracking-widest uppercase opacity-75">
                    NOMOR BIB
                  </span>
                  <span className="block text-xl sm:text-2xl font-black font-mono tracking-tight">
                    {registration.bibNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Event Meta Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9BE34A] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Tanggal</span>
                  <span className="font-semibold text-white">
                    {event ? formatDateIndo(event.eventDate) : 'Desember 2026'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9BE34A] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Waktu Flag-off</span>
                  <span className="font-semibold text-white">
                    {event ? event.eventTime : '18:30 WIB'}
                  </span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9BE34A] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Lokasi</span>
                  <span className="font-semibold text-white truncate max-w-[150px]">
                    {event ? event.location : 'Alun-alun Bondowoso'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Body with Cutout styling */}
          <div className="relative p-6 sm:p-8 bg-[#FDFDFD]">
            {/* Cutout notches */}
            <div className="absolute -top-3.5 -left-3.5 w-7 h-7 bg-black/75 rounded-full no-print" />
            <div className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-black/75 rounded-full no-print" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Participant Details (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Nama Peserta
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {registration.fullName}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Kategori Lomba
                    </span>
                    <p className="text-base sm:text-lg font-bold text-[#101713] mt-0.5 inline-block text-emerald-700 font-display">
                      {registration.categoryName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                      No. Registrasi
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {registration.registrationNumber}
                    </span>
                  </div>

                  {registration.jerseySize && (
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                        Jersey Size
                      </span>
                      <span className="font-bold text-slate-800">
                        {registration.jerseySize}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Jenis Kelamin
                    </span>
                    <span className="font-medium text-slate-700">
                      {registration.gender}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Status Pembayaran: <strong className="text-emerald-700">Lunas ({formatRupiah(registration.amount)})</strong></span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Bawa E-Ticket ini (cetak atau tampilkan di smartphone) saat pengambilan Race Pack & proses Check-in Gate.
                  </p>
                </div>
              </div>

              {/* QR Code Validation Stamp (1 Col) */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                  <QrCodeDisplay value={qrValue} size={135} />
                </div>
                <div className="mt-2 text-center">
                  <span className="block text-[10px] font-mono text-slate-500 font-semibold tracking-wider uppercase">
                    {registration.ticketCode || registration.registrationNumber}
                  </span>
                  <span className="inline-block mt-1 text-[9px] font-bold text-[#101713] bg-[#9BE34A] px-2 py-0.5 rounded-full">
                    SCAN FOR CHECK-IN
                  </span>
                </div>
              </div>
            </div>

            {/* Check-in Status Stamp if already checked in */}
            {registration.isCheckedIn && (
              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  SUDAH CHECK-IN PADA HARI-H
                </span>
                <span className="text-emerald-700 font-mono text-[11px]">
                  {registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleString('id-ID') : 'Checked-in'}
                </span>
              </div>
            )}
          </div>

          {/* Ticket Perforated Footer */}
          <div className="bg-slate-100 px-6 sm:px-8 py-3.5 border-t border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Organized by <strong>{event?.organizerName || 'KINETIX Sports Platform'}</strong>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              SECURE TOKEN: {registration.id.substring(0, 12)}
            </div>
          </div>
        </div>

        {/* Bottom instruction */}
        <p className="mt-3 text-center text-xs text-slate-300 no-print">
          Tips: Anda dapat menekan tombol <strong>Cetak / PDF</strong> di atas untuk menyimpan tiket ini ke file PDF di perangkat Anda.
        </p>
      </div>
    </div>
  );
};
