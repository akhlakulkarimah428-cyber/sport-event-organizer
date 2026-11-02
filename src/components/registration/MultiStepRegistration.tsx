import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SportEvent, ParticipantRegistration } from '../../types';
import { storageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  CheckCircle2,
  ChevronRight,
  Upload,
  ArrowLeft,
  QrCode,
  ShieldAlert,
  Info,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface MultiStepRegistrationProps {
  event: SportEvent;
  initialCategoryId?: string;
  onBack: () => void;
  onOpenLookup: () => void;
  onViewETicket: (reg: ParticipantRegistration) => void;
}

export const MultiStepRegistration: React.FC<MultiStepRegistrationProps> = ({
  event,
  initialCategoryId,
  onBack,
  onOpenLookup,
  onViewETicket
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const settings = storageService.getSettings();

  // Selected Category
  const defaultCategory =
    event.categories.find(c => c.id === initialCategoryId && c.isActive) ||
    event.categories.find(c => c.isActive) ||
    event.categories[0];

  const [selectedCatId, setSelectedCatId] = useState<string>(defaultCategory?.id || '');

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    birthPlace: '',
    birthDate: '',
    address: '',
    jerseySize: 'L' as 'S' | 'M' | 'L' | 'XL' | 'XXL',
    photoUrl: '',
    customData: {} as Record<string, string>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState('');

  // Created registration record
  const [currentRegistration, setCurrentRegistration] = useState<ParticipantRegistration | null>(null);

  // Step 2 Payment Proof
  const [proofImage, setProofImage] = useState<string>('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofError, setProofError] = useState('');

  const activeCategory = event.categories.find(c => c.id === selectedCatId) || defaultCategory;

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCatId) newErrors.categoryId = 'Silakan pilih kategori lomba';
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi sesuai tanda pengenal';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp / HP wajib diisi';
    } else if (formData.phone.length < 9) {
      newErrors.phone = 'Nomor telepon minimal 9 digit';
    }
    if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Tempat lahir wajib diisi';
    if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat domisili lengkap wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !activeCategory) return;

    // Generate unique Registration Number
    const prefix = event.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 4)
      .toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const regNumber = `${prefix}-2026-${randomDigits}`;

    const newReg: ParticipantRegistration = {
      id: `reg-${Date.now()}`,
      registrationNumber: regNumber,
      eventId: event.id,
      eventName: event.name,
      categoryId: activeCategory.id,
      categoryName: activeCategory.name,
      amount: activeCategory.price,
      status: 'pending_payment',
      registeredAt: new Date().toISOString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      address: formData.address,
      jerseySize: formData.jerseySize,
      photoUrl: formData.photoUrl || undefined,
      customData: formData.customData,
      isCheckedIn: false,
      idCardStatus: 'not_generated'
    };

    storageService.saveRegistration(newReg);
    setCurrentRegistration(newReg);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPhotoError('Format foto harus JPG, JPEG, atau PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setProofError('Format file harus JPG, JPEG, atau PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofError('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImage) {
      setProofError('Silakan pilih dan upload bukti transfer pembayaran.');
      return;
    }

    if (!currentRegistration) return;

    setIsUploadingProof(true);

    setTimeout(() => {
      const updated: ParticipantRegistration = {
        ...currentRegistration,
        status: 'waiting_verification',
        paymentProofUrl: proofImage,
        paymentProofUploadedAt: new Date().toISOString()
      };

      storageService.saveRegistration(updated);
      setCurrentRegistration(updated);
      setIsUploadingProof(false);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // no-op
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Event
        </button>

        {/* Event Header Banner Card */}
        <div className="bg-[#101713] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#9BE34A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                Pendaftaran Resmi
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#9BE34A]" />
                  {formatDateIndo(event.eventDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#9BE34A]" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-4 h-4" />
                  Batas Pendaftaran: {formatDateIndo(event.registrationDeadline)}
                </span>
              </div>
            </div>

            {/* Quick Helper */}
            <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs max-w-xs">
              <span className="text-[#9BE34A] font-bold block mb-1">Sudah Mendaftar?</span>
              <p className="text-slate-300 text-[11px] mb-2">
                Cek status verifikasi atau cetak ulang e-ticket Anda kapan saja.
              </p>
              <button
                onClick={onOpenLookup}
                className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-center font-semibold transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Search className="w-3.5 h-3.5 text-[#9BE34A]" />
                Cek Status Pendaftaran
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Step 1 */}
            <div
              className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                step === 1
                  ? 'bg-white border-[#101713] shadow-md'
                  : step > 1
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-white/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 1
                      ? 'bg-emerald-600 text-white'
                      : step === 1
                      ? 'bg-[#101713] text-[#9BE34A]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > 1 ? '✓' : '1'}
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Step 1</span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Data Peserta
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                step === 2
                  ? 'bg-white border-[#101713] shadow-md'
                  : step > 2
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-white/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 2
                      ? 'bg-emerald-600 text-white'
                      : step === 2
                      ? 'bg-[#101713] text-[#9BE34A]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > 2 ? '✓' : '2'}
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Step 2</span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Pembayaran QRIS
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                step === 3
                  ? 'bg-white border-[#101713] shadow-md'
                  : 'bg-white/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 3 ? 'bg-[#101713] text-[#9BE34A]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  3
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Step 3</span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Konfirmasi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: FORM DATA PESERTA */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="mb-8 pb-6 border-b border-slate-100">
              <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
                LANGKAH PERTAMA
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                Lengkapi Data Peserta
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Isi identitas pelari sesuai kartu tanda pengenal resmi (KTP / KIA / Kartu Pelajar).
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-6">
              {/* 1. Kategori Race */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Pilih Kategori Race / Lomba *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {event.categories.map(cat => {
                    const isSelected = selectedCatId === cat.id;
                    const isFull = cat.quota > 0 && cat.registeredCount >= cat.quota;

                    return (
                      <button
                        type="button"
                        key={cat.id}
                        disabled={isFull || !cat.isActive}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`p-4 rounded-2xl text-left border transition-all relative ${
                          isSelected
                            ? 'bg-[#101713] text-white border-[#101713] ring-2 ring-[#9BE34A]'
                            : isFull
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-[#F9FAF8] text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-base font-display">{cat.name}</span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#9BE34A]" />
                          )}
                        </div>
                        <span className={`block text-lg font-black font-mono ${isSelected ? 'text-[#9BE34A]' : 'text-slate-900'}`}>
                          {formatRupiah(cat.price)}
                        </span>
                        {cat.description && (
                          <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {cat.description}
                          </p>
                        )}
                        {isFull && (
                          <span className="inline-block mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Kuota Penuh
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.categoryId && (
                  <p className="text-xs text-rose-500 mt-1">{errors.categoryId}</p>
                )}
              </div>

              {/* Fasilitas Callout */}
              {activeCategory && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Fasilitas Termasuk dalam Kategori Ini:</strong>
                    <p className="mt-1 text-slate-700">
                      {activeCategory.facilities.join(' · ')}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Ukuran Jersey */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Ukuran Jersey Event Finisher *
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as const).map(size => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setFormData({ ...formData, jerseySize: size })}
                      className={`w-14 h-12 rounded-xl text-sm font-bold border transition-all ${
                        formData.jerseySize === size
                          ? 'bg-[#101713] text-[#9BE34A] border-[#101713] shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <span className="block text-[11px] text-slate-500 mt-1.5">
                  Pilih ukuran jersey event lari Anda (Dri-fit unisex).
                </span>
              </div>

              {/* 3. Identitas Diri */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Identitas Peserta
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap sesuai KTP / Kartu Pelajar"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as 'Laki-laki' | 'Perempuan'
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <span className="block text-[11px] text-slate-500 mt-1">
                      Kategori podium Putra dan Putri dipisahkan.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bondowoso"
                      value={formData.birthPlace}
                      onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    />
                    {errors.birthPlace && (
                      <p className="text-xs text-rose-500 mt-1">{errors.birthPlace}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    />
                    {errors.birthDate && (
                      <p className="text-xs text-rose-500 mt-1">{errors.birthDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Alamat Domisili Lengkap *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Jl. Diponegoro No. 12, Kel. Kotakulon, Bondowoso"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nomor WhatsApp / HP *
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                    )}
                    <span className="block text-[11px] text-slate-500 mt-1">
                      E-ticket dan QR Code akan dikirim ke email ini setelah diverifikasi.
                    </span>
                  </div>
                </div>

                {/* Optional Photo Upload for Participant ID Card */}
                {event.idCardConfig?.allowPhotoUpload !== false && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Foto Wajah Peserta (Opsional)
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Untuk ID Card Resmi
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-3">
                      Unggah foto wajah terbaru untuk digunakan pada ID Card peserta. Pengunggahan foto bersifat opsional. Jika dilewati, ID Card akan menggunakan monogram siluet resmi.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handlePhotoUpload}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#101713] file:text-[#9BE34A] hover:file:bg-slate-800"
                      />

                      {formData.photoUrl && (
                        <div className="flex items-center gap-3">
                          <img
                            src={formData.photoUrl}
                            alt="Preview Foto Peserta"
                            className="w-14 h-14 rounded-xl object-cover border-2 border-[#9BE34A] shadow-sm"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800 block">Foto Terunggah</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                              className="text-rose-600 hover:underline font-semibold"
                            >
                              Hapus Foto
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {photoError && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold">{photoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Total Biaya</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {activeCategory ? formatRupiah(activeCategory.price) : '-'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="py-3.5 px-6 sm:px-8 bg-[#101713] text-[#9BE34A] font-extrabold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg text-sm"
                >
                  Lanjut ke Pembayaran QRIS
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PEMBAYARAN QRIS */}
        {step === 2 && currentRegistration && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="mb-8 pb-6 border-b border-slate-100">
              <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
                LANGKAH KEDUA
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                Pembayaran Scan QRIS Manual
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Lakukan pembayaran sejumlah nominal yang tertera melalui scan QRIS, kemudian unggah bukti transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Payment Details & QRIS Card */}
              <div className="bg-[#101713] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                    INVOICE PENDAFTARAN
                  </span>
                  <span className="font-mono text-xs text-slate-300">
                    {currentRegistration.registrationNumber}
                  </span>
                </div>

                <div className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Event:</span>
                    <strong className="text-white text-right">{currentRegistration.eventName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Peserta:</span>
                    <strong className="text-white">{currentRegistration.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kategori:</span>
                    <strong className="text-[#9BE34A]">{currentRegistration.categoryName}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400 font-bold uppercase">Total Tagihan:</span>
                    <span className="text-xl font-black text-[#9BE34A] font-mono">
                      {formatRupiah(currentRegistration.amount)}
                    </span>
                  </div>
                </div>

                {/* QRIS DISPLAY */}
                <div className="bg-white text-[#101713] rounded-2xl p-4 text-center mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-black text-xs tracking-wider text-rose-600">QRIS</span>
                    <span className="text-[10px] text-slate-500">Standar Pembayaran Nasional</span>
                  </div>
                  <div className="mx-auto w-48 h-48 bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                    <img
                      src={settings.qrisImageUrl}
                      alt="QRIS Penyelenggara"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="block mt-2 font-bold text-xs uppercase tracking-wider text-slate-800">
                    {settings.qrisMerchantName}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    NMID: ID1020023847590 · Semua Bank & E-Wallet
                  </span>
                </div>

                {/* Optional Bank Transfer Note */}
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                  <span className="block font-bold text-white mb-0.5">Alternatif Transfer Bank:</span>
                  <span>{settings.bankName}: <strong>{settings.bankAccountNumber}</strong></span>
                  <span className="block text-[10px] text-slate-400">a.n. {settings.bankAccountHolder}</span>
                </div>
              </div>

              {/* Instructions & Upload Form */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#F9FAF8] border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Petunjuk Pembayaran:
                  </h4>
                  <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                    <li>Scan QRIS menggunakan aplikasi perbankan atau e-wallet Anda.</li>
                    <li>
                      Pastikan nominal pembayaran sesuai yaitu:{' '}
                      <strong className="text-slate-900">{formatRupiah(currentRegistration.amount)}</strong>.
                    </li>
                    <li>Selesaikan pembayaran dan simpan tangkapan layar (screenshot) resi.</li>
                    <li>Unggah file bukti pembayaran pada kolom di bawah ini.</li>
                    <li>Klik tombol <strong>"Kirim Bukti Pembayaran"</strong>.</li>
                  </ol>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Upload Bukti Pembayaran (JPG, JPEG, PNG - Max 5MB) *
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#101713] file:text-white hover:file:bg-slate-800"
                    />
                    {proofError && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold">{proofError}</p>
                    )}
                  </div>

                  {/* Receipt Preview */}
                  {proofImage && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="block text-xs font-bold text-slate-700 mb-2">
                        Preview Bukti Pembayaran:
                      </span>
                      <img
                        src={proofImage}
                        alt="Bukti Transfer"
                        className="max-h-56 rounded-xl border border-slate-300 mx-auto object-contain shadow-sm"
                      />
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Verifikasi manual dilakukan oleh tim bendahara KINETIX. Status registrasi akan berubah menjadi <strong>"Menunggu Verifikasi"</strong> hingga disetujui.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingProof || !proofImage}
                    className="w-full py-3.5 px-6 bg-[#101713] text-[#9BE34A] font-extrabold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingProof ? 'Mengirim Bukti...' : 'Kirim Bukti Pembayaran'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: KONFIRMASI */}
        {step === 3 && currentRegistration && (
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
              Status: Menunggu Verifikasi Pembayaran
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Pendaftaran Berhasil Dikirim!
            </h2>

            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Terima kasih telah melakukan pendaftaran. Bukti pembayaran Anda sedang diverifikasi oleh panitia. E-ticket akan dikirimkan setelah pembayaran dinyatakan valid.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 my-6 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Nomor Registrasi:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {currentRegistration.registrationNumber}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Nama Peserta:</span>
                <strong className="text-slate-900">{currentRegistration.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Event & Kategori:</span>
                <strong className="text-slate-900">{currentRegistration.eventName} ({currentRegistration.categoryName})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Email Notifikasi:</span>
                <span className="text-slate-800 font-mono">{currentRegistration.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Nominal Pembayaran:</span>
                <strong className="text-emerald-700 text-sm font-mono">{formatRupiah(currentRegistration.amount)}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onOpenLookup}
                className="py-3 px-6 bg-[#101713] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs shadow-md"
              >
                <Search className="w-4 h-4 text-[#9BE34A]" />
                Cek Status & E-Ticket Nanti
              </button>
              <button
                onClick={onBack}
                className="py-3 px-6 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200 transition-colors text-xs"
              >
                Kembali ke Halaman Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
