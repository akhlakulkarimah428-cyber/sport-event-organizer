import React, { useState } from 'react';
import { OrganizationSettings, SponsorPartner, GalleryItem } from '../../types';
import { storageService } from '../../services/storage';
import { Plus, Trash2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ContentManagementProps {
  settings: OrganizationSettings;
  sponsors: SponsorPartner[];
  gallery: GalleryItem[];
  onRefresh: () => void;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({
  settings,
  sponsors,
  gallery,
  onRefresh
}) => {
  const [formData, setFormData] = useState<OrganizationSettings>({ ...settings });
  const [sponsorsList, setSponsorsList] = useState<SponsorPartner[]>([...sponsors]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([...gallery]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState('Running');
  const [newGalleryUrl, setNewGalleryUrl] = useState('/src/assets/images/night_run_poster_1793544244194.jpg');

  // New sponsor state
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorCat, setNewSponsorCat] = useState<SponsorPartner['category']>('Official Partner');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(formData);
    storageService.saveSponsors(sponsorsList);
    storageService.saveGallery(galleryList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleAddSponsor = () => {
    if (!newSponsorName.trim()) return;
    const item: SponsorPartner = {
      id: `sp-${Date.now()}`,
      name: newSponsorName.trim(),
      category: newSponsorCat,
      logoText: newSponsorName.trim().toUpperCase()
    };
    setSponsorsList([...sponsorsList, item]);
    setNewSponsorName('');
  };

  const handleRemoveSponsor = (id: string) => {
    setSponsorsList(sponsorsList.filter(s => s.id !== id));
  };

  const handleAddGallery = () => {
    if (!newGalleryTitle.trim()) return;
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle.trim(),
      category: newGalleryCat,
      imageUrl: newGalleryUrl || '/src/assets/images/sports_hero_banner_1793544243318.jpg',
      date: 'Terbaru'
    };
    setGalleryList([...galleryList, item]);
    setNewGalleryTitle('');
  };

  const handleRemoveGallery = (id: string) => {
    setGalleryList(galleryList.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900">
          Manajemen Konten Publik Website
        </h2>
        <p className="text-xs text-slate-500">
          Perbarui teks hero banner, profil organisasi, galeri dokumentasi, dan sponsor partner.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Perubahan konten berhasil disimpan dan langsung tayang di Landing Page!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Profil & Visi Misi Organisasi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Organisasi
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Deskripsi Profil Lengkap
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Visi Organisasi
              </label>
              <textarea
                rows={2}
                value={formData.vision}
                onChange={e => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Misi Organisasi
              </label>
              <textarea
                rows={2}
                value={formData.mission}
                onChange={e => setFormData({ ...formData, mission: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Gallery Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Galeri Dokumentasi Event
            </h3>
            <span className="text-xs text-slate-400">{galleryList.length} Foto Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {galleryList.map(item => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3]">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[11px]">
                  <span>{item.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGallery(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add gallery row */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Judul Foto Momen..."
              value={newGalleryTitle}
              onChange={e => setNewGalleryTitle(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs flex-1"
            />
            <input
              type="text"
              placeholder="URL Gambar..."
              value={newGalleryUrl}
              onChange={e => setNewGalleryUrl(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs flex-1"
            />
            <button
              type="button"
              onClick={handleAddGallery}
              className="px-4 py-2 bg-[#101713] text-[#9BE34A] rounded-xl text-xs font-bold whitespace-nowrap"
            >
              Tambah Foto
            </button>
          </div>
        </div>

        {/* Sponsor & Partner Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Sponsor & Mitra Kerjasama
            </h3>
            <span className="text-xs text-slate-400">{sponsorsList.length} Partner</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sponsorsList.map(sp => (
              <div key={sp.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-slate-800">{sp.name}</strong>
                  <span className="text-[10px] text-slate-400">{sp.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSponsor(sp.id)}
                  className="p-1 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add sponsor row */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nama Brand Sponsor..."
              value={newSponsorName}
              onChange={e => setNewSponsorName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs flex-1"
            />
            <select
              value={newSponsorCat}
              onChange={e => setNewSponsorCat(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
            >
              <option value="Title Sponsor">Title Sponsor</option>
              <option value="Official Partner">Official Partner</option>
              <option value="Media Partner">Media Partner</option>
              <option value="Supporting Partner">Supporting Partner</option>
            </select>
            <button
              type="button"
              onClick={handleAddSponsor}
              className="px-4 py-2 bg-[#101713] text-[#9BE34A] rounded-xl text-xs font-bold whitespace-nowrap"
            >
              Tambah Sponsor
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 bg-[#101713] text-[#9BE34A] font-extrabold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-800 shadow-md"
          >
            Simpan Seluruh Perubahan Konten
          </button>
        </div>
      </form>
    </div>
  );
};
