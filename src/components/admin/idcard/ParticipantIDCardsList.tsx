import React, { useState, useMemo } from 'react';
import { ParticipantRegistration, SportEvent, ParticipantIDCardRecord, IDCardStatus } from '../../../types';
import { storageService } from '../../../services/storage';
import { formatDateTimeIndo } from '../../../utils/formatters';
import { IDCardBadge } from '../../idcard/IDCardBadge';
import {
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface ParticipantIDCardsListProps {
  events: SportEvent[];
  registrations: ParticipantRegistration[];
  onRefresh: () => void;
  onPreviewCard: (cardRecord: ParticipantIDCardRecord) => void;
}

export const ParticipantIDCardsList: React.FC<ParticipantIDCardsListProps> = ({
  events,
  registrations,
  onRefresh,
  onPreviewCard
}) => {
  const idCards = storageService.getParticipantIDCards();

  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [cardStatusFilter, setCardStatusFilter] = useState('all');

  // Selected for bulk actions
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);
  
  // Modals
  const [auditLogCard, setAuditLogCard] = useState<ParticipantIDCardRecord | null>(null);
  const [regeneratingRegId, setRegeneratingRegId] = useState<string | null>(null);
  const [regenReason, setRegenReason] = useState('Koreksi data nomor BIB / foto atlet');
  const [isBulkPrintingOpen, setIsBulkPrintingOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Combine registrations with their ID card record if any
  const combinedList = useMemo(() => {
    return registrations.map(reg => {
      const card = idCards.find(c => c.registrationId === reg.id);
      return {
        reg,
        card,
        status: card ? card.status : ('not_generated' as IDCardStatus)
      };
    });
  }, [registrations, idCards]);

  const filtered = useMemo(() => {
    return combinedList.filter(item => {
      if (eventFilter !== 'all' && item.reg.eventId !== eventFilter) return false;
      if (paymentFilter !== 'all' && item.reg.status !== paymentFilter) return false;
      if (cardStatusFilter !== 'all' && item.status !== cardStatusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.reg.fullName.toLowerCase().includes(q);
        const matchReg = item.reg.registrationNumber.toLowerCase().includes(q);
        const matchBib = item.reg.bibNumber?.toLowerCase().includes(q);
        if (!matchName && !matchReg && !matchBib) return false;
      }
      return true;
    });
  }, [combinedList, eventFilter, paymentFilter, cardStatusFilter, searchQuery]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedRegIds.length === filtered.length) {
      setSelectedRegIds([]);
    } else {
      setSelectedRegIds(filtered.map(f => f.reg.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRegIds.includes(id)) {
      setSelectedRegIds(selectedRegIds.filter(i => i !== id));
    } else {
      setSelectedRegIds([...selectedRegIds, id]);
    }
  };

  // Actions
  const handleGenerateSingle = (regId: string) => {
    const res = storageService.generateParticipantIDCard(regId, 'Admin ID Card');
    if (res) {
      setNotificationMsg(`ID Card ${res.participantName} (${res.bibNumber}) berhasil diterbitkan!`);
      setTimeout(() => setNotificationMsg(null), 3000);
      onRefresh();
    }
  };

  const handleRegenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regeneratingRegId) return;

    const res = storageService.regenerateParticipantIDCard(regeneratingRegId, 'Admin ID Card', regenReason);
    if (res) {
      setNotificationMsg(`ID Card ${res.participantName} berhasil diregenerasi dengan template versi terbaru!`);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
    setRegeneratingRegId(null);
    onRefresh();
  };

  const handleBulkGenerate = () => {
    if (selectedRegIds.length === 0) return;
    const res = storageService.bulkGenerateIDCards(selectedRegIds, 'Admin Bulk Tool');
    setNotificationMsg(`Berhasil menghasilkan ${res.successCount} ID Card peserta.`);
    if (res.errors.length > 0) {
      alert(`Catatan:\n${res.errors.join('\n')}`);
    }
    setTimeout(() => setNotificationMsg(null), 4000);
    setSelectedRegIds([]);
    onRefresh();
  };

  const handleDownloadPng = async (card: ParticipantIDCardRecord) => {
    onPreviewCard(card);
  };

  const handlePrintCard = (card: ParticipantIDCardRecord) => {
    onPreviewCard(card);
  };

  // Collect cards for bulk printing
  const bulkPrintCards = useMemo(() => {
    if (selectedRegIds.length > 0) {
      return idCards.filter(c => selectedRegIds.includes(c.registrationId));
    }
    return idCards;
  }, [idCards, selectedRegIds]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900">
            Participant ID Cards Management
          </h3>
          <p className="text-xs text-slate-500">
            Kelola penerbitan ID Card, cetak satuan atau massal, dan lacak riwayat audit snapshot template.
          </p>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedRegIds.length > 0 && (
            <button
              onClick={handleBulkGenerate}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Bulk Generate ({selectedRegIds.length})
            </button>
          )}

          <button
            onClick={() => setIsBulkPrintingOpen(true)}
            className="py-2 px-4 bg-[#101713] text-[#9BE34A] hover:bg-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Bulk Printing Sheet ({bulkPrintCards.length})
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, reg, BIB..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
          />
        </div>

        <div>
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
          >
            <option value="all">Semua Event</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="approved">Approved</option>
            <option value="waiting_verification">Menunggu Verifikasi</option>
            <option value="pending_payment">Belum Bayar</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div>
          <select
            value={cardStatusFilter}
            onChange={e => setCardStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
          >
            <option value="all">Semua Status ID Card</option>
            <option value="published">Published (Terbit)</option>
            <option value="generated">Generated</option>
            <option value="not_generated">Belum Diterbitkan</option>
            <option value="revoked">Revoked (Dicabut)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRegIds.length > 0 && selectedRegIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded text-[#101713]"
                  />
                </th>
                <th className="py-3.5 px-3">No. Reg / BIB</th>
                <th className="py-3.5 px-3">Nama Peserta</th>
                <th className="py-3.5 px-3">Event & Kategori</th>
                <th className="py-3.5 px-3">Status Bayar</th>
                <th className="py-3.5 px-3">Status ID Card</th>
                <th className="py-3.5 px-3">Penerbitan</th>
                <th className="py-3.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ditemukan peserta yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map(({ reg, card, status }) => {
                  const isSelected = selectedRegIds.includes(reg.id);

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(reg.id)}
                          className="rounded text-[#101713]"
                        />
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-slate-900 block">
                          {reg.registrationNumber}
                        </span>
                        {reg.bibNumber && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-black text-[#101713] bg-[#9BE34A] px-1.5 py-0.2 rounded">
                            {reg.bibNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          {reg.photoUrl ? (
                            <img
                              src={reg.photoUrl}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-300"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                              {reg.fullName[0]}
                            </div>
                          )}
                          <strong className="text-slate-900 font-bold block">{reg.fullName}</strong>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-800 font-medium block truncate max-w-[170px]">
                          {reg.eventName}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          {reg.categoryName}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            reg.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : reg.status === 'waiting_verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        {status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9BE34A]/25 text-[#101713] border border-[#9BE34A]/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#101713]" />
                            Published
                          </span>
                        ) : status === 'generated' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Generated
                          </span>
                        ) : status === 'revoked' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Revoked
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Belum Ada</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                        {card ? formatDateTimeIndo(card.generatedAt) : '-'}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {card ? (
                            <>
                              <button
                                onClick={() => onPreviewCard(card)}
                                className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg"
                                title="Lihat & Download ID Card"
                              >
                                <Eye className="w-4 h-4 text-emerald-700" />
                              </button>

                              <button
                                onClick={() => setRegeneratingRegId(reg.id)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                title="Regenerasi Snapshot Template"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setAuditLogCard(card)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                title="Riwayat Audit Log"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleGenerateSingle(reg.id)}
                              disabled={reg.status !== 'approved'}
                              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#101713] text-[#9BE34A] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Terbitkan
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

      {/* REGENERATE MODAL */}
      {regeneratingRegId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 font-display">
                Regenerasi ID Card Peserta
              </h4>
              <button onClick={() => setRegeneratingRegId(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegenerateSubmit} className="pt-4 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                ID Card akan dibuat ulang menggunakan snapshot template versi terbaru yang aktif di event ini.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Regenerasi (Dicatat di Audit Log) *
                </label>
                <input
                  type="text"
                  value={regenReason}
                  onChange={e => setRegenReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegeneratingRegId(null)}
                  className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#101713] text-[#9BE34A] font-bold text-xs uppercase"
                >
                  Proses Regenerasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOG MODAL */}
      {auditLogCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Audit Log</span>
                <h4 className="font-bold text-sm text-slate-900 font-display mt-0.5">
                  Riwayat ID Card: {auditLogCard.participantName}
                </h4>
              </div>
              <button onClick={() => setAuditLogCard(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div><strong>Template Terpasang:</strong> {auditLogCard.templateSnapshot?.name || 'Default'} (v{auditLogCard.templateVersion})</div>
                <div><strong>Tanggal Pertama Diterbitkan:</strong> {formatDateTimeIndo(auditLogCard.generatedAt)}</div>
              </div>

              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Log Perubahan:
              </span>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {auditLogCard.auditLogs?.map((log, idx) => (
                  <div key={idx} className="py-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-100">
                        {log.action}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {formatDateTimeIndo(log.timestamp)}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-1">Oleh: <strong>{log.actor}</strong></div>
                    {log.reason && <p className="text-slate-500 italic mt-0.5 text-[11px]">"{log.reason}"</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setAuditLogCard(null)}
                className="py-1.5 px-4 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK PRINTING MULTI-BADGE SHEET MODAL */}
      {isBulkPrintingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl p-6 shadow-2xl my-6 flex flex-col max-h-[95vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
                  Printable Sheet (A4 Multi-Badge)
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  Cetak Massal ID Card ({bulkPrintCards.length} Kartu Siap Cetak)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2 px-4 bg-[#101713] text-[#9BE34A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Mulai Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setIsBulkPrintingOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area with Multi-Badge Grid */}
            <div id="printable-bulk-sheet" className="p-6 overflow-y-auto flex-1 bg-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                {bulkPrintCards.map(card => (
                  <div key={card.id} className="p-2 bg-white rounded-2xl shadow-sm border border-slate-300">
                    <IDCardBadge
                      template={card.templateSnapshot}
                      participantName={card.participantName}
                      bibNumber={card.bibNumber}
                      categoryName={card.categoryName}
                      registrationNumber={card.registrationNumber}
                      eventName={card.eventName}
                      qrToken={card.qrToken}
                      photoUrl={card.participantPhotoUrl}
                      customBadgeNote="OFFICIAL ATHLETE"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
