import React from 'react';
import { SportEvent, ParticipantRegistration } from '../../types';
import { formatRupiah, formatDateTimeIndo } from '../../utils/formatters';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Ticket
} from 'lucide-react';

interface DashboardOverviewProps {
  events: SportEvent[];
  registrations: ParticipantRegistration[];
  onNavigateTab: (tab: any) => void;
  onVerifyPayment: (reg: ParticipantRegistration) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  events,
  registrations,
  onNavigateTab,
  onVerifyPayment
}) => {
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.eventDate) >= new Date()).length;
  const totalRegistrations = registrations.length;
  
  const paidParticipants = registrations.filter(r => r.status === 'approved').length;
  const pendingPayments = registrations.filter(
    r => r.status === 'waiting_verification' || r.status === 'pending_payment'
  ).length;

  const totalRevenue = registrations
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const waitingVerificationList = registrations.filter(r => r.status === 'waiting_verification');
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Events</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900">{totalEvents}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Aktif di platform</span>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-700">{upcomingEvents}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Menjelang tanggal</span>
        </div>

        {/* Total Regs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pendaftar</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900">{totalRegistrations}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Total formulir masuk</span>
        </div>

        {/* Paid / Approved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paid / Sah</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-800">{paidParticipants}</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">E-ticket aktif</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Verify</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-display text-amber-600">{pendingPayments}</div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Perlu verifikasi</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#101713] text-white p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9BE34A]">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#9BE34A]" />
          </div>
          <div className="text-lg font-black font-mono text-[#9BE34A] truncate">
            {formatRupiah(totalRevenue)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Pembayaran terverifikasi</span>
        </div>
      </div>

      {/* VERIFICATION QUEUE CALLOUT IF ANY */}
      {waitingVerificationList.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-200/60 text-amber-900 shrink-0">
              <Clock className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950 font-display">
                {waitingVerificationList.length} Pembayaran QRIS Menunggu Verifikasi Anda
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Peserta telah mengunggah bukti bayar dan menanti penerbitan E-Ticket & Nomor BIB mereka.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('verification')}
            className="py-2.5 px-5 rounded-xl bg-[#101713] text-[#9BE34A] font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <span>Buka Antrean Verifikasi</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* TWO COLUMN GRID: Recent Registrations & Active Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Registrations (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Pendaftaran Terbaru Masuk
              </h3>
              <span className="text-xs text-slate-400">Data pendaftar real-time di sistem</span>
            </div>
            <button
              onClick={() => onNavigateTab('participants')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Lihat Semua ({totalRegistrations})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRegistrations.map(reg => (
              <div key={reg.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold truncate">{reg.fullName}</strong>
                    <span className="font-mono text-[10px] text-slate-400">{reg.registrationNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{reg.eventName}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{reg.categoryName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(reg.amount)}</span>
                  
                  {reg.status === 'approved' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                      Approved
                    </span>
                  )}
                  {reg.status === 'waiting_verification' && (
                    <button
                      onClick={() => onVerifyPayment(reg)}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                    >
                      Verifikasi
                    </button>
                  )}
                  {reg.status === 'pending_payment' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">
                      Belum Bayar
                    </span>
                  )}
                  {reg.status === 'rejected' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                      Ditolak
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Events Progress (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Status Event & Kuota
              </h3>
              <span className="text-xs text-slate-400">Kapasitas peserta per event</span>
            </div>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Kelola Event
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {events.slice(0, 3).map(event => {
              const totalQuota = event.categories.reduce((acc, c) => acc + c.quota, 0);
              const totalReg = event.categories.reduce((acc, c) => acc + c.registeredCount, 0);
              const percentage = totalQuota > 0 ? Math.min(100, Math.round((totalReg / totalQuota) * 100)) : 0;

              return (
                <div key={event.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs font-display truncate max-w-[200px]">
                        {event.name}
                      </h4>
                      <span className="text-[10px] text-slate-500">{event.location}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Keterisian Kuota:</span>
                      <strong className="text-slate-800 font-mono">
                        {totalReg} / {totalQuota} ({percentage}%)
                      </strong>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#101713] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
