import React, { useState, useMemo } from 'react';
import { ParticipantRegistration, SportEvent, PaymentStatus } from '../../types';
import { formatRupiah, formatDateTimeIndo, formatDateIndo, getStatusBadge } from '../../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Eye,
  Ticket,
  CreditCard,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface ParticipantManagementProps {
  registrations: ParticipantRegistration[];
  events: SportEvent[];
  onViewETicket: (reg: ParticipantRegistration) => void;
  onOpenVerification: (reg: ParticipantRegistration) => void;
  onViewIDCard?: (reg: ParticipantRegistration) => void;
}

export const ParticipantManagement: React.FC<ParticipantManagementProps> = ({
  registrations,
  events,
  onViewETicket,
  onOpenVerification,
  onViewIDCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRegistration | null>(null);

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      // Event filter
      if (eventFilter !== 'all' && r.eventId !== eventFilter) return false;
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.fullName.toLowerCase().includes(q);
        const matchReg = r.registrationNumber.toLowerCase().includes(q);
        const matchEmail = r.email.toLowerCase().includes(q);
        const matchPhone = r.phone.toLowerCase().includes(q);
        const matchBib = r.bibNumber?.toLowerCase().includes(q);
        if (!matchName && !matchReg && !matchEmail && !matchPhone && !matchBib) return false;
      }
      return true;
    });
  }, [registrations, eventFilter, statusFilter, searchQuery]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      'No',
      'No Registrasi',
      'BIB',
      'Nama Peserta',
      'Event',
      'Kategori',
      'Biaya',
      'Status Pembayaran',
      'Email',
      'No HP',
      'Gender',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Jersey',
      'Alamat',
      'Tanggal Daftar',
      'Check In Status'
    ];

    const rows = filtered.map((r, index) => [
      index + 1,
      `"${r.registrationNumber}"`,
      `"${r.bibNumber || '-'}"`,
      `"${r.fullName}"`,
      `"${r.eventName}"`,
      `"${r.categoryName}"`,
      r.amount,
      `"${r.status}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.gender}"`,
      `"${r.birthPlace}"`,
      `"${r.birthDate}"`,
      `"${r.jerseySize || '-'}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.registeredAt}"`,
      `"${r.isCheckedIn ? 'Checked-In' : 'Belum'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kinetix_peserta_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            Data Peserta Terdaftar
          </h2>
          <p className="text-xs text-slate-500">
            Menampilkan {filtered.length} dari total {registrations.length} pendaftar.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2.5 px-4 bg-[#101713] text-[#9BE34A] hover:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm self-start sm:self-auto transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export CSV / Excel
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, no reg, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
          />
        </div>

        {/* Filter Event */}
        <div>
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
          >
            <option value="all">Semua Event Olahraga</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
          >
            <option value="all">Semua Status Pembayaran</option>
            <option value="approved">Approved (E-Ticket Aktif)</option>
            <option value="waiting_verification">Menunggu Verifikasi</option>
            <option value="pending_payment">Belum Bayar</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">No. Reg / BIB</th>
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Event & Kategori</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Biaya</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Daftar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data peserta yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const badge = getStatusBadge(r.status);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {r.registrationNumber}
                        </span>
                        {r.bibNumber && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-black text-[#101713] bg-[#9BE34A] px-1.5 py-0.2 rounded">
                            {r.bibNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 font-bold block">{r.fullName}</strong>
                        <span className="text-[10px] text-slate-400">
                          {r.gender} · Jersey: {r.jerseySize || '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium block truncate max-w-[180px]">
                          {r.eventName}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          {r.categoryName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 block font-mono">{r.phone}</span>
                        <span className="text-[11px] text-slate-400 block">{r.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900">
                          {formatRupiah(r.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {formatDateTimeIndo(r.registeredAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedParticipant(r)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="Detail Pendaftar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {r.status === 'approved' && (
                            <>
                              <button
                                onClick={() => onViewETicket(r)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                                title="Buka E-Ticket"
                              >
                                <Ticket className="w-4 h-4" />
                              </button>
                              {onViewIDCard && (
                                <button
                                  onClick={() => onViewIDCard(r)}
                                  className="p-1.5 text-slate-800 hover:text-black hover:bg-[#9BE34A]/20 rounded-lg"
                                  title="Buka ID Card Atlet (PNG/PDF)"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}

                          {r.status === 'waiting_verification' && (
                            <button
                              onClick={() => onOpenVerification(r)}
                              className="px-2 py-1 text-[10px] font-bold rounded-md bg-amber-500 text-white hover:bg-amber-600"
                            >
                              Verifikasi
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 bg-[#101713] text-white">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                  Detail Profil Pendaftar
                </span>
                <h3 className="text-xl font-bold font-display mt-0.5">
                  {selectedParticipant.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    No. Registrasi
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedParticipant.registrationNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    Nomor BIB (Race Pass)
                  </span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    {selectedParticipant.bibNumber || 'Belum di-assign (Belum Approved)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Event</span>
                  <strong className="text-slate-800">{selectedParticipant.eventName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Kategori</span>
                  <strong className="text-emerald-700">{selectedParticipant.categoryName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">WhatsApp</span>
                  <span className="text-slate-800 font-mono">{selectedParticipant.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Email</span>
                  <span className="text-slate-800 font-mono">{selectedParticipant.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Jenis Kelamin</span>
                  <span className="text-slate-800">{selectedParticipant.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Ukuran Jersey</span>
                  <span className="text-slate-800 font-bold">{selectedParticipant.jerseySize || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Tempat, Tgl Lahir</span>
                  <span className="text-slate-800">
                    {selectedParticipant.birthPlace}, {formatDateIndo(selectedParticipant.birthDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Total Biaya</span>
                  <span className="text-slate-900 font-mono font-bold">
                    {formatRupiah(selectedParticipant.amount)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Alamat Domisili</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-0.5">
                  {selectedParticipant.address}
                </p>
              </div>

              {/* Payment Proof Preview if present */}
              {selectedParticipant.paymentProofUrl && (
                <div className="pt-2">
                  <span className="text-slate-400 block uppercase text-[10px] mb-1">
                    Bukti Transfer Pembayaran:
                  </span>
                  <img
                    src={selectedParticipant.paymentProofUrl}
                    alt="Bukti Transfer"
                    className="max-h-48 rounded-xl border border-slate-300 object-contain shadow-xs"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                {selectedParticipant.status === 'approved' && (
                  <>
                    <button
                      onClick={() => {
                        onViewETicket(selectedParticipant);
                        setSelectedParticipant(null);
                      }}
                      className="py-2 px-4 bg-[#9BE34A] text-[#101713] font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Ticket className="w-4 h-4" />
                      Lihat E-Ticket
                    </button>
                    {onViewIDCard && (
                      <button
                        onClick={() => {
                          onViewIDCard(selectedParticipant);
                          setSelectedParticipant(null);
                        }}
                        className="py-2 px-4 bg-[#101713] text-[#9BE34A] font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800"
                      >
                        <CreditCard className="w-4 h-4" />
                        ID Card Digital
                      </button>
                    )}
                  </>
                )}
                {selectedParticipant.status === 'waiting_verification' && (
                  <button
                    onClick={() => {
                      onOpenVerification(selectedParticipant);
                      setSelectedParticipant(null);
                    }}
                    className="py-2 px-4 bg-amber-500 text-white font-bold rounded-xl text-xs"
                  >
                    Buka Verifikasi Pembayaran
                  </button>
                )}
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
