import React, { useState } from 'react';
import { IDCardTemplate, IDCardSizePreset, IDCardOrientation, IDCardElementConfig } from '../../../types';
import { storageService } from '../../../services/storage';
import { IDCardBadge } from '../../idcard/IDCardBadge';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Eye,
  X,
  Palette,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface TemplateManagementProps {
  onRefresh: () => void;
}

export const TemplateManagement: React.FC<TemplateManagementProps> = ({ onRefresh }) => {
  const templates = storageService.getIDCardTemplates();
  const [editingTemplate, setEditingTemplate] = useState<IDCardTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<IDCardTemplate | null>(null);

  // Form State for Template Editor
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sizePreset, setSizePreset] = useState<IDCardSizePreset>('Badge');
  const [orientation, setOrientation] = useState<IDCardOrientation>('portrait');
  const [backgroundColor, setBackgroundColor] = useState('#101713');
  const [accentColor, setAccentColor] = useState('#9BE34A');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [elements, setElements] = useState<IDCardElementConfig[]>([]);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setName('Template Sporty Baru');
    setDescription('Template ID Card kustom untuk event olahraga');
    setSizePreset('Badge');
    setOrientation('portrait');
    setBackgroundColor('#101713');
    setAccentColor('#9BE34A');
    setTextColor('#FFFFFF');
    setElements([
      { id: 'el-1', key: 'org_logo', label: 'Logo Organisasi', visible: true, x: 50, y: 6, fontSize: 13, align: 'center' },
      { id: 'el-2', key: 'event_name', label: 'Nama Event', visible: true, x: 50, y: 13, fontSize: 13, align: 'center' },
      { id: 'el-3', key: 'participant_photo', label: 'Foto Peserta', visible: true, x: 50, y: 28, align: 'center' },
      { id: 'el-4', key: 'bib_number', label: 'Nomor BIB', visible: true, x: 50, y: 50, fontSize: 32, align: 'center' },
      { id: 'el-5', key: 'participant_name', label: 'Nama Peserta', visible: true, x: 50, y: 62, fontSize: 15, align: 'center' },
      { id: 'el-6', key: 'category', label: 'Kategori Race', visible: true, x: 50, y: 69, fontSize: 12, align: 'center' },
      { id: 'el-7', key: 'reg_number', label: 'Nomor Registrasi', visible: true, x: 50, y: 77, fontSize: 10, align: 'center' },
      { id: 'el-8', key: 'qr_code', label: 'QR Code Check-In', visible: true, x: 50, y: 88, align: 'center' },
      { id: 'el-9', key: 'custom_badge_note', label: 'Badge Note', visible: true, x: 50, y: 97, fontSize: 9, align: 'center' }
    ]);
  };

  const openEditModal = (tpl: IDCardTemplate) => {
    setEditingTemplate(tpl);
    setIsCreating(false);
    setName(tpl.name);
    setDescription(tpl.description);
    setSizePreset(tpl.sizePreset);
    setOrientation(tpl.orientation);
    setBackgroundColor(tpl.backgroundColor);
    setAccentColor(tpl.accentColor);
    setTextColor(tpl.textColor);
    setElements(JSON.parse(JSON.stringify(tpl.elements || [])));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tpl: IDCardTemplate = {
      id: editingTemplate ? editingTemplate.id : `tpl-${Date.now()}`,
      name,
      description,
      sizePreset,
      customWidthMm: sizePreset === 'CR80' ? 86 : 90,
      customHeightMm: sizePreset === 'CR80' ? 54 : 120,
      orientation,
      backgroundColor,
      accentColor,
      textColor,
      isActive: true,
      isDefault: editingTemplate?.isDefault || false,
      version: editingTemplate ? (editingTemplate.version || 1) + 1 : 1,
      elements,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storageService.saveIDCardTemplate(tpl);
    setIsCreating(false);
    setEditingTemplate(null);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus template ID Card ini?')) {
      const res = storageService.deleteIDCardTemplate(id);
      if (!res.success) {
        alert(res.message);
      } else {
        onRefresh();
      }
    }
  };

  const toggleElementVisibility = (index: number) => {
    const updated = [...elements];
    updated[index].visible = !updated[index].visible;
    setElements(updated);
  };

  // Mock template for live preview editor
  const currentDraftTemplate: IDCardTemplate = {
    id: editingTemplate?.id || 'tpl-draft',
    name,
    description,
    sizePreset,
    orientation,
    backgroundColor,
    accentColor,
    textColor,
    isActive: true,
    version: editingTemplate?.version || 1,
    elements,
    createdAt: '',
    updatedAt: ''
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900">
            ID Card Templates
          </h3>
          <p className="text-xs text-slate-500">
            Desain template ID Card resmi untuk kartu atlet peserta, badge event, dan kartu panitia.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 bg-[#101713] text-[#9BE34A] hover:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Buat Template Baru
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(tpl => (
          <div
            key={tpl.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Card Preview Thumbnail */}
            <div
              className="p-6 flex items-center justify-center bg-slate-100 border-b border-slate-100 min-h-[220px]"
              style={{
                background: `linear-gradient(135deg, ${tpl.backgroundColor}20, #f1f5f9)`
              }}
            >
              <div className="transform scale-[0.45] origin-center -my-24 shadow-2xl">
                <IDCardBadge
                  template={tpl}
                  participantName="Siti Nur Aisyah"
                  bibNumber="BIB-1042"
                  categoryName="10K Challenge"
                  registrationNumber="GNR-2026-9041"
                  eventName="Gema Night Run 2026"
                  qrToken="TK-DEMO-PREVIEW"
                  photoUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
                  customBadgeNote="ATHLETE PASS"
                />
              </div>
            </div>

            {/* Template Info */}
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {tpl.sizePreset} · {tpl.orientation}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  v{tpl.version || 1}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 font-display text-sm">
                {tpl.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {tpl.description}
              </p>

              {/* Color dots */}
              <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: tpl.backgroundColor }} title="Background" />
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: tpl.accentColor }} title="Accent" />
                <span>{tpl.elements?.length || 0} Elemen Desain</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(tpl)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                Preview Penuh
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(tpl)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  title="Edit Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                  title="Hapus Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL LIVE PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h4 className="font-bold text-sm text-slate-900">{previewTemplate.name}</h4>
              <button onClick={() => setPreviewTemplate(null)} className="p-1 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex justify-center">
              <IDCardBadge
                template={previewTemplate}
                participantName="Siti Nur Aisyah"
                bibNumber="BIB-1042"
                categoryName="10K Challenge"
                registrationNumber="GNR-2026-9041"
                eventName="Gema Night Run Bondowoso 2026"
                qrToken="TK-GNR26-9041-A89F"
                photoUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
                customBadgeNote="ALL ACCESS ATHLETE"
              />
            </div>
          </div>
        </div>
      )}

      {/* VISUAL LIVE EDITOR MODAL */}
      {(isCreating || editingTemplate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-[#101713] text-white shrink-0">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                  Visual Template Editor
                </span>
                <h3 className="text-xl font-bold font-display mt-0.5">
                  {isCreating ? 'Buat Template ID Card Baru' : `Edit Template: ${name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingTemplate(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Editor Body: Left Controls, Right Real-time Live Preview */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Properties & Element Toggles (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Properti Utama
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nama Template *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Deskripsi
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset & Orientation */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Ukuran & Orientasi Cetak
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Preset Ukuran
                      </label>
                      <select
                        value={sizePreset}
                        onChange={e => setSizePreset(e.target.value as IDCardSizePreset)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      >
                        <option value="Badge">Event Badge (90 x 120 mm)</option>
                        <option value="CR80">CR80 Standard (86 x 54 mm)</option>
                        <option value="Custom">Custom Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Orientasi Kartu
                      </label>
                      <select
                        value={orientation}
                        onChange={e => setOrientation(e.target.value as IDCardOrientation)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      >
                        <option value="portrait">Portrait (Vertikal)</option>
                        <option value="landscape">Landscape (Horizontal)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Theme Colors */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Warna & Identitas Visual
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={e => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={e => setBackgroundColor(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Aksen (Neon)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={e => setAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={e => setAccentColor(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Warna Teks
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={e => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={e => setTextColor(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Element Toggles */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Elemen Desain yang Ditampilkan
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {elements.map((el, idx) => (
                      <button
                        type="button"
                        key={el.id}
                        onClick={() => toggleElementVisibility(idx)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          el.visible
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span>{el.label}</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          el.visible ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {el.visible ? '✓' : '✕'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingTemplate(null);
                    }}
                    className="py-2.5 px-5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#101713] text-[#9BE34A] text-xs font-bold uppercase tracking-wider hover:bg-slate-800 shadow-md"
                  >
                    Simpan Template
                  </button>
                </div>
              </div>

              {/* Right Column: Live Real-Time Preview (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 block">
                  Live Preview Interaktif
                </span>

                <div className="shadow-2xl">
                  <IDCardBadge
                    template={currentDraftTemplate}
                    participantName="Siti Nur Aisyah"
                    bibNumber="BIB-1042"
                    categoryName="10K Challenge"
                    registrationNumber="GNR-2026-9041"
                    eventName="Gema Night Run 2026"
                    qrToken="TK-DEMO-PREVIEW"
                    photoUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
                    customBadgeNote="ALL ACCESS ATHLETE"
                  />
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
