import React, { useState } from 'react';
import { SportEvent, EventIDCardConfig, IDCardSizePreset, IDCardOrientation } from '../../../types';
import { storageService } from '../../../services/storage';
import { IDCardBadge } from '../../idcard/IDCardBadge';
import {
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Camera,
  Check
} from 'lucide-react';

interface EventIDCardSettingsProps {
  events: SportEvent[];
  onRefresh: () => void;
}

export const EventIDCardSettings: React.FC<EventIDCardSettingsProps> = ({ events, onRefresh }) => {
  const templates = storageService.getIDCardTemplates();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [regenSuccessMsg, setRegenSuccessMsg] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenReason, setRegenReason] = useState('Pembaruan desain resmi oleh panitia event');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const defaultConfig: EventIDCardConfig = currentEvent?.idCardConfig || {
    enabled: true,
    templateId: templates[0]?.id || 'tpl-athletic-neon',
    sizePreset: 'Badge',
    orientation: 'portrait',
    allowPhotoUpload: true,
    showParticipantPhoto: true,
    customBadgeNote: 'ALL ACCESS ATHLETE'
  };

  const [config, setConfig] = useState<EventIDCardConfig>(defaultConfig);

  // Sync config when selected event changes
  const handleEventChange = (evId: string) => {
    setSelectedEventId(evId);
    const ev = events.find(e => e.id === evId);
    if (ev) {
      setConfig(
        ev.idCardConfig || {
          enabled: true,
          templateId: templates[0]?.id || 'tpl-athletic-neon',
          sizePreset: 'Badge',
          orientation: 'portrait',
          allowPhotoUpload: true,
          showParticipantPhoto: true,
          customBadgeNote: 'ALL ACCESS ATHLETE'
        }
      );
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    const updatedEvent: SportEvent = {
      ...currentEvent,
      idCardConfig: config
    };

    storageService.saveEvent(updatedEvent);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleExplicitRegenerate = () => {
    if (!currentEvent) return;
    if (
      !confirm(
        `Regenerasi seluruh ID Card yang sudah diterbitkan untuk event "${currentEvent.name}"? Snapshot template versi baru akan diterapkan ke semua peserta event ini.`
      )
    ) {
      return;
    }

    setIsRegenerating(true);
    const allRegs = storageService.getRegistrations().filter(r => r.eventId === currentEvent.id && r.status === 'approved');

    let count = 0;
    for (const r of allRegs) {
      const res = storageService.regenerateParticipantIDCard(r.id, 'Admin Event Settings', regenReason);
      if (res) count++;
    }

    setIsRegenerating(false);
    setRegenSuccessMsg(`Berhasil meregenerasi ${count} ID Card peserta dengan snapshot template terbaru.`);
    setTimeout(() => setRegenSuccessMsg(null), 4000);
    onRefresh();
  };

  const activeTemplate = templates.find(t => t.id === config.templateId) || templates[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold font-display text-slate-900">
          Event ID Card Settings
        </h3>
        <p className="text-xs text-slate-500">
          Konfigurasikan template ID Card, aturan upload foto peserta, dan penerbitan badge per event olahraga.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Pengaturan ID Card event berhasil disimpan!
        </div>
      )}

      {regenSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {regenSuccessMsg}
        </div>
      )}

      {/* Select Event */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Pilih Event yang Dikonfigurasi *
          </label>
          <span className="text-xs text-slate-400">Setiap event menggunakan satu template resmi yang ditentukan admin.</span>
        </div>

        <select
          value={selectedEventId}
          onChange={e => handleEventChange(e.target.value)}
          className="px-4 py-2.5 bg-[#F9FAF8] rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#9BE34A] focus:outline-none min-w-[280px]"
        >
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({ev.sportCategoryLabel})
            </option>
          ))}
        </select>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form (7 Cols) */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            
            {/* 1. Enable / Disable Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <strong className="block text-xs font-bold text-slate-900 uppercase">
                  1. Aktifkan Penerbitan ID Card Peserta
                </strong>
                <span className="text-[11px] text-slate-500">
                  Peserta yang disetujui akan otomatis mendapatkan ID Card digital & cetak.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#101713]"></div>
              </label>
            </div>

            {/* 2. Template Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                2. Pilih Template Desain Resmi *
              </label>
              <select
                value={config.templateId}
                onChange={e => setConfig({ ...config, templateId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
              >
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.sizePreset} · {tpl.orientation})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Template ini berlaku seragam untuk seluruh peserta event ini. Peserta tidak dapat memilih template sendiri.
              </span>
            </div>

            {/* 3 & 4. Size & Orientation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  3. Preset Ukuran Cetak
                </label>
                <select
                  value={config.sizePreset}
                  onChange={e => setConfig({ ...config, sizePreset: e.target.value as IDCardSizePreset })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Badge">Event Badge (90 x 120 mm)</option>
                  <option value="CR80">CR80 / Standard (86 x 54 mm)</option>
                  <option value="Custom">Custom Size</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  4. Orientasi ID Card
                </label>
                <select
                  value={config.orientation}
                  onChange={e => setConfig({ ...config, orientation: e.target.value as IDCardOrientation })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="portrait">Portrait (Vertikal)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                </select>
              </div>
            </div>

            {/* 5 & 6. Photo Settings */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase">
                5 & 6. Pengaturan Foto Wajah Peserta (Opsional)
              </span>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowPhotoUpload}
                  onChange={e => setConfig({ ...config, allowPhotoUpload: e.target.checked })}
                  className="w-4 h-4 rounded text-[#101713] focus:ring-[#9BE34A]"
                />
                <span className="font-medium">
                  Tampilkan kolom upload foto wajah pada form pendaftaran (Foto bersifat opsional bagi peserta)
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showParticipantPhoto}
                  onChange={e => setConfig({ ...config, showParticipantPhoto: e.target.checked })}
                  className="w-4 h-4 rounded text-[#101713] focus:ring-[#9BE34A]"
                />
                <span className="font-medium">
                  Tampilkan kotak foto pada layout ID Card (Gunakan monogram atlet jika peserta tidak upload foto)
                </span>
              </label>
            </div>

            {/* 7. Custom Badge Note */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                7. Label Akses / Badge Note Kustom
              </label>
              <input
                type="text"
                value={config.customBadgeNote || ''}
                onChange={e => setConfig({ ...config, customBadgeNote: e.target.value })}
                placeholder="Contoh: ALL ACCESS ATHLETE / OFFICIAL RACER"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#101713] text-[#9BE34A] font-extrabold uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Simpan Pengaturan Event
              </button>
            </div>

          </div>

          {/* EXPLICIT REGENERATION SECTION */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Mekanisme Regenerasi Eksplisit ID Card
                </h4>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Perubahan template di atas <strong>tidak akan otomatis mengubah</strong> ID Card yang sudah diterbitkan kepada peserta (menjaga integritas snapshot desain). Jika Anda ingin memperbarui ID Card seluruh peserta lama ke versi template baru, jalankan tombol regenerasi di bawah ini.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-950 uppercase mb-1">
                Alasan / Catatan Audit Log Regenerasi:
              </label>
              <input
                type="text"
                value={regenReason}
                onChange={e => setRegenReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleExplicitRegenerate}
              disabled={isRegenerating}
              className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Sedang Meregenerasi...' : 'Regenerasi Seluruh ID Card Event Ini'}
            </button>
          </div>
        </form>

        {/* Right Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 block">
            Tampilan ID Card untuk Event Ini
          </span>

          <div className="shadow-2xl">
            <IDCardBadge
              template={activeTemplate}
              participantName="Siti Nur Aisyah"
              bibNumber="BIB-1042"
              categoryName="10K Challenge"
              registrationNumber="GNR-2026-9041"
              eventName={currentEvent.name}
              qrToken="TK-GNR26-9041-A89F"
              photoUrl={config.showParticipantPhoto ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80" : undefined}
              customBadgeNote={config.customBadgeNote || "ALL ACCESS ATHLETE"}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
