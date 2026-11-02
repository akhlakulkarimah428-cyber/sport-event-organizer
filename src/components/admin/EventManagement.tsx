import React, { useState } from 'react';
import { SportEvent, EventRaceCategory, SportCategory, EventStatus, DynamicFormField } from '../../types';
import { storageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Layers,
  X,
  Check,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface EventManagementProps {
  events: SportEvent[];
  onRefresh: () => void;
}

export const EventManagement: React.FC<EventManagementProps> = ({ events, onRefresh }) => {
  const [editingEvent, setEditingEvent] = useState<SportEvent | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sportCategory, setSportCategory] = useState<SportCategory>('running');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [status, setStatus] = useState<EventStatus>('published');
  const [organizerName, setOrganizerName] = useState('KINETIX Sports Organizer');
  const [organizerContact, setOrganizerContact] = useState('+62 812-3456-7890');
  const [facilitiesStr, setFacilitiesStr] = useState('Nomor BIB, Medali Finisher, Jersey Event, Race Pack, Refreshment');
  const [rulesAndPodium, setRulesAndPodium] = useState('');

  // Categories list state
  const [categories, setCategories] = useState<EventRaceCategory[]>([]);
  // Dynamic form field template
  const [formFieldsType, setFormFieldsType] = useState<'running' | 'football' | 'general'>('running');

  // ID Card Config State
  const allTemplates = storageService.getIDCardTemplates();
  const [idCardEnabled, setIdCardEnabled] = useState(true);
  const [idCardTemplateId, setIdCardTemplateId] = useState(allTemplates[0]?.id || 'tpl-athletic-neon');
  const [idCardSizePreset, setIdCardSizePreset] = useState<'CR80' | 'Badge' | 'Custom'>('Badge');
  const [idCardOrientation, setIdCardOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [idCardAllowPhoto, setIdCardAllowPhoto] = useState(true);
  const [idCardShowPhoto, setIdCardShowPhoto] = useState(true);
  const [idCardNote, setIdCardNote] = useState('ALL ACCESS ATHLETE');

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingEvent(null);
    setName('');
    setSlug('');
    setSportCategory('running');
    setDescription('');
    setPosterUrl('/src/assets/images/sports_hero_banner_1793544243318.jpg');
    setEventDate('2026-12-25');
    setEventTime('06:00 WIB');
    setLocation('Gelora Stadion Utama');
    setLocationDetails('Pintu Gerbang Utama A, Parkir Timur');
    setRegistrationDeadline('2026-12-10');
    setStatus('published');
    setFacilitiesStr('Nomor BIB, Medali Finisher, Jersey Event, Race Pack, Refreshment');
    setRulesAndPodium('Podium Juara 1, 2, dan 3 Kategori Putra & Putri dengan total hadiah jutaan rupiah.');
    setIdCardEnabled(true);
    setIdCardTemplateId(allTemplates[0]?.id || 'tpl-athletic-neon');
    setIdCardSizePreset('Badge');
    setIdCardOrientation('portrait');
    setIdCardAllowPhoto(true);
    setIdCardShowPhoto(true);
    setIdCardNote('ALL ACCESS ATHLETE');
    setCategories([
      {
        id: `cat-${Date.now()}-1`,
        name: '5K Fun Run',
        description: 'Jarak 5 kilometer untuk pemula dan umum',
        price: 125000,
        quota: 300,
        registeredCount: 0,
        isActive: true,
        facilities: ['Nomor BIB', 'Medali Finisher', 'Jersey Event']
      },
      {
        id: `cat-${Date.now()}-2`,
        name: '10K Challenge',
        description: 'Tantangan 10 kilometer dengan RFID timing',
        price: 150000,
        quota: 200,
        registeredCount: 0,
        isActive: true,
        facilities: ['Nomor BIB RFID', 'Medali Finisher', 'Jersey Event', 'Podium Prize']
      }
    ]);
  };

  const openEditModal = (event: SportEvent) => {
    setEditingEvent(event);
    setIsCreatingNew(false);
    setName(event.name);
    setSlug(event.slug);
    setSportCategory(event.sportCategory);
    setDescription(event.description);
    setPosterUrl(event.posterUrl);
    setEventDate(event.eventDate);
    setEventTime(event.eventTime);
    setLocation(event.location);
    setLocationDetails(event.locationDetails);
    setRegistrationDeadline(event.registrationDeadline);
    setStatus(event.status);
    setOrganizerName(event.organizerName);
    setOrganizerContact(event.organizerContact);
    setFacilitiesStr(event.facilitiesOverview.join(', '));
    setRulesAndPodium(event.rulesAndPodium || '');
    setCategories([...event.categories]);

    // ID Card config
    if (event.idCardConfig) {
      setIdCardEnabled(event.idCardConfig.enabled !== false);
      setIdCardTemplateId(event.idCardConfig.templateId || allTemplates[0]?.id || 'tpl-athletic-neon');
      setIdCardSizePreset(event.idCardConfig.sizePreset || 'Badge');
      setIdCardOrientation(event.idCardConfig.orientation || 'portrait');
      setIdCardAllowPhoto(event.idCardConfig.allowPhotoUpload !== false);
      setIdCardShowPhoto(event.idCardConfig.showParticipantPhoto !== false);
      setIdCardNote(event.idCardConfig.customBadgeNote || 'ALL ACCESS ATHLETE');
    } else {
      setIdCardEnabled(true);
      setIdCardTemplateId(allTemplates[0]?.id || 'tpl-athletic-neon');
      setIdCardSizePreset('Badge');
      setIdCardOrientation('portrait');
      setIdCardAllowPhoto(true);
      setIdCardShowPhoto(true);
      setIdCardNote('ALL ACCESS ATHLETE');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Configure form fields based on sport
    const standardRunningFields: DynamicFormField[] = [
      { id: 'f-1', label: 'Kategori Race', fieldName: 'categoryId', type: 'select', required: true },
      { id: 'f-2', label: 'Ukuran Jersey Event Finisher', fieldName: 'jerseySize', type: 'select', required: true, options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'f-3', label: 'Nama Lengkap', fieldName: 'fullName', type: 'text', required: true },
      { id: 'f-4', label: 'Jenis Kelamin', fieldName: 'gender', type: 'select', required: true, options: ['Laki-laki', 'Perempuan'] },
      { id: 'f-5', label: 'Tempat Lahir', fieldName: 'birthPlace', type: 'text', required: true },
      { id: 'f-6', label: 'Tanggal Lahir', fieldName: 'birthDate', type: 'date', required: true },
      { id: 'f-7', label: 'Alamat Domisili Lengkap', fieldName: 'address', type: 'textarea', required: true },
      { id: 'f-8', label: 'Nomor WhatsApp / HP', fieldName: 'phone', type: 'tel', required: true },
      { id: 'f-9', label: 'Alamat Email', fieldName: 'email', type: 'email', required: true }
    ];

    const standardFootballFields: DynamicFormField[] = [
      { id: 'fb-1', label: 'Kategori Kompetisi', fieldName: 'categoryId', type: 'select', required: true },
      { id: 'fb-2', label: 'Nama Tim / Klub', fieldName: 'teamName', type: 'text', required: true },
      { id: 'fb-3', label: 'Nama Manajer / Kapten Tim', fieldName: 'fullName', type: 'text', required: true },
      { id: 'fb-4', label: 'Nomor WhatsApp Official', fieldName: 'phone', type: 'tel', required: true },
      { id: 'fb-5', label: 'Email Official Tim', fieldName: 'email', type: 'email', required: true },
      { id: 'fb-6', label: 'Alamat Asal Klub / Kota', fieldName: 'address', type: 'text', required: true }
    ];

    const targetFields = formFieldsType === 'football' ? standardFootballFields : standardRunningFields;

    const eventPayload: SportEvent = {
      id: editingEvent ? editingEvent.id : `event-${Date.now()}`,
      name,
      slug: generatedSlug,
      sportCategory,
      sportCategoryLabel: sportCategory === 'running' ? 'Running / Marathon' : sportCategory === 'cycling' ? 'Cycling' : sportCategory === 'badminton' ? 'Badminton' : sportCategory === 'football' ? 'Football / Soccer' : 'Sports Event',
      description,
      posterUrl: posterUrl || '/src/assets/images/sports_hero_banner_1793544243318.jpg',
      eventDate,
      eventTime,
      location,
      locationDetails,
      registrationDeadline,
      status,
      organizerName,
      organizerContact,
      idCardConfig: {
        enabled: idCardEnabled,
        templateId: idCardTemplateId,
        sizePreset: idCardSizePreset,
        orientation: idCardOrientation,
        allowPhotoUpload: idCardAllowPhoto,
        showParticipantPhoto: idCardShowPhoto,
        customBadgeNote: idCardNote
      },
      categories: categories.length > 0 ? categories : [
        {
          id: 'cat-default',
          name: 'General Participant',
          price: 100000,
          quota: 200,
          registeredCount: 0,
          isActive: true,
          facilities: ['Medali', 'Sertifikat']
        }
      ],
      facilitiesOverview: facilitiesStr.split(',').map(s => s.trim()).filter(Boolean),
      rulesAndPodium,
      formFields: targetFields,
      isFeatured: false
    };

    storageService.saveEvent(eventPayload);
    setIsCreatingNew(false);
    setEditingEvent(null);
    onRefresh();
  };

  const handleDelete = (id: string, eventName: string) => {
    if (confirm(`Yakin ingin menghapus event "${eventName}"? Data pendaftar terkait akan tetap aman di riwayat.`)) {
      storageService.deleteEvent(id);
      onRefresh();
    }
  };

  const addCategoryRow = () => {
    setCategories([
      ...categories,
      {
        id: `cat-${Date.now()}`,
        name: 'Kategori Baru',
        description: 'Deskripsi kategori',
        price: 150000,
        quota: 100,
        registeredCount: 0,
        isActive: true,
        facilities: ['BIB', 'Jersey', 'Medali']
      }
    ]);
  };

  const updateCategoryRow = (index: number, updates: Partial<EventRaceCategory>) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], ...updates };
    setCategories(updated);
  };

  const removeCategoryRow = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">
            Event Management
          </h2>
          <p className="text-xs text-slate-500">
            Kelola event olahraga, kategori lomba, kuota pendaftaran, dan struktur formulir peserta.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 bg-[#101713] text-[#9BE34A] hover:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Event Baru
        </button>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Event & Cabang</th>
                <th className="py-3.5 px-4">Tanggal & Lokasi</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Kategori & Biaya</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map(event => {
                const totalQuota = event.categories.reduce((acc, c) => acc + c.quota, 0);
                const totalReg = event.categories.reduce((acc, c) => acc + c.registeredCount, 0);

                return (
                  <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.posterUrl}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <strong className="text-slate-900 font-bold block text-sm line-clamp-1">
                            {event.name}
                          </strong>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {event.sportCategoryLabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {formatDateIndo(event.eventDate)}
                      </span>
                      <span className="text-slate-500 text-[11px] block truncate max-w-xs">
                        {event.location}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-700 font-mono">
                        {formatDateIndo(event.registrationDeadline)}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {event.categories.map(c => (
                          <div key={c.id} className="text-[11px] flex items-center gap-2">
                            <span className="font-medium text-slate-800">{c.name}:</span>
                            <span className="font-mono text-emerald-700">{formatRupiah(c.price)}</span>
                          </div>
                        ))}
                        <span className="text-[10px] text-slate-400 block pt-0.5">
                          Total Kuota: {totalReg}/{totalQuota}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          event.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : event.status === 'closed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {event.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id, event.name)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREATE / EDIT EVENT */}
      {(isCreatingNew || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-[#101713] text-white shrink-0">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                  {isCreatingNew ? 'Buat Baru' : 'Perbarui Data'}
                </span>
                <h3 className="text-xl font-bold font-display mt-0.5">
                  {isCreatingNew ? 'Tambah Event Olahraga Baru' : `Edit: ${name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingEvent(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Informasi Utama Event
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nama Event *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Contoh: Gema Night Run Bondowoso 2026"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Cabang Olahraga *
                    </label>
                    <select
                      value={sportCategory}
                      onChange={e => setSportCategory(e.target.value as SportCategory)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    >
                      <option value="running">Running / Marathon</option>
                      <option value="cycling">Cycling / Sepeda</option>
                      <option value="badminton">Badminton / Bulutangkis</option>
                      <option value="football">Football / Soccer</option>
                      <option value="basketball">Basketball</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tanggal Pelaksanaan *
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Waktu / Jam Flag-off *
                    </label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={e => setEventTime(e.target.value)}
                      placeholder="18:30 WIB"
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Deadline Pendaftaran *
                    </label>
                    <input
                      type="date"
                      value={registrationDeadline}
                      onChange={e => setRegistrationDeadline(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Lokasi / Venue *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Contoh: Alun-alun Bondowoso"
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Status Event *
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as EventStatus)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                    >
                      <option value="published">Published (Dibuka untuk Umum)</option>
                      <option value="draft">Draft (Belum Tampil di Beranda)</option>
                      <option value="closed">Closed (Pendaftaran Ditutup)</option>
                      <option value="completed">Completed (Selesai)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detail Titik Kumpul
                  </label>
                  <input
                    type="text"
                    value={locationDetails}
                    onChange={e => setLocationDetails(e.target.value)}
                    placeholder="Contoh: Depan Monumen Gerbong Maut, Alun-alun Ki Ronggo"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Deskripsi Lengkap Event
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    URL Poster / Cover Image
                  </label>
                  <input
                    type="text"
                    value={posterUrl}
                    onChange={e => setPosterUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  />
                </div>
              </div>

              {/* KATEGORI & BIAYA CRUD */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Kategori Lomba & Biaya Pendaftaran
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tambahkan kelas kompetisi seperti 5K, 10K, 21K, atau Kelas Tunggal/Ganda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCategoryRow}
                    className="py-1 px-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Kategori
                  </button>
                </div>

                <div className="space-y-3">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id || idx}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Nama Kategori</label>
                          <input
                            type="text"
                            value={cat.name}
                            onChange={e => updateCategoryRow(idx, { name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Biaya (Rp)</label>
                          <input
                            type="number"
                            value={cat.price}
                            onChange={e => updateCategoryRow(idx, { price: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-600 uppercase">Kuota Peserta</label>
                            <input
                              type="number"
                              value={cat.quota}
                              onChange={e => updateCategoryRow(idx, { quota: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCategoryRow(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Form Fields Selection */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Struktur Formulir Pendaftaran Peserta
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="formFieldsType"
                      checked={formFieldsType === 'running'}
                      onChange={() => setFormFieldsType('running')}
                      className="accent-[#101713]"
                    />
                    <span>Formulir Individu / Lari (KTP, Jersey, Gender, TTL, Domisili)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="formFieldsType"
                      checked={formFieldsType === 'football'}
                      onChange={() => setFormFieldsType('football')}
                      className="accent-[#101713]"
                    />
                    <span>Formulir Tim / Sepak Bola (Nama Tim, Kapten, Official WA)</span>
                  </label>
                </div>
              </div>

              {/* Fasilitas & Ketentuan */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fasilitas Peserta (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={facilitiesStr}
                    onChange={e => setFacilitiesStr(e.target.value)}
                    placeholder="Nomor BIB, Medali Finisher, Jersey Event, Race Pack"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Informasi Hadiah Podium & Peraturan
                  </label>
                  <textarea
                    rows={2}
                    value={rulesAndPodium}
                    onChange={e => setRulesAndPodium(e.target.value)}
                    placeholder="Podium Juara 1, 2, 3 Putra & Putri..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Konfigurasi ID Card Peserta Event */}
              <div className="space-y-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#101713] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9BE34A]" />
                      Pengaturan ID Card Peserta
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kelola penerbitan ID Card, pilihan template resmi, ukuran, dan opsi foto peserta
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={idCardEnabled}
                      onChange={e => setIdCardEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#101713]"></div>
                  </label>
                </div>

                {idCardEnabled && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Template Desain ID Card
                        </label>
                        <select
                          value={idCardTemplateId}
                          onChange={e => setIdCardTemplateId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none bg-white"
                        >
                          {allTemplates.map(tpl => (
                            <option key={tpl.id} value={tpl.id}>
                              {tpl.name} ({tpl.sizePreset} - {tpl.orientation})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Ukuran ID Card
                        </label>
                        <select
                          value={idCardSizePreset}
                          onChange={e => setIdCardSizePreset(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none bg-white"
                        >
                          <option value="Badge">Event Badge (90 x 120 mm / 3.5x4.7")</option>
                          <option value="CR80">CR80 Standard (86 x 54 mm / Kartu ATM)</option>
                          <option value="Custom">Custom Standard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Orientasi
                        </label>
                        <select
                          value={idCardOrientation}
                          onChange={e => setIdCardOrientation(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none bg-white"
                        >
                          <option value="portrait">Portrait (Vertikal - Rekomendasi)</option>
                          <option value="landscape">Landscape (Horizontal)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                          <input
                            type="checkbox"
                            checked={idCardAllowPhoto}
                            onChange={e => setIdCardAllowPhoto(e.target.checked)}
                            className="w-4 h-4 rounded text-[#101713] focus:ring-[#9BE34A]"
                          />
                          <span>Izinkan Peserta Upload Foto saat Registrasi</span>
                        </label>
                        <p className="text-[11px] text-slate-500 pl-6">
                          Peserta dapat memilih mengunggah foto wajah atau melewatinya (opsional).
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                          <input
                            type="checkbox"
                            checked={idCardShowPhoto}
                            onChange={e => setIdCardShowPhoto(e.target.checked)}
                            className="w-4 h-4 rounded text-[#101713] focus:ring-[#9BE34A]"
                          />
                          <span>Tampilkan Slot Foto pada Desain ID Card</span>
                        </label>
                        <p className="text-[11px] text-slate-500 pl-6">
                          Jika peserta tidak upload foto, inisial nama atau siluet atlet akan otomatis digunakan.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Catatan / Label Pita Badge
                      </label>
                      <input
                        type="text"
                        value={idCardNote}
                        onChange={e => setIdCardNote(e.target.value)}
                        placeholder="Contoh: ALL ACCESS ATHLETE / OFFICIAL PARTICIPANT"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9BE34A] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingEvent(null);
                  }}
                  className="py-2.5 px-5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#101713] text-[#9BE34A] text-xs font-bold uppercase tracking-wider hover:bg-slate-800 shadow-md"
                >
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
