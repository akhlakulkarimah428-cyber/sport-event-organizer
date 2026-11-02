import React, { useState } from 'react';
import { SportEvent } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  ChevronDown,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface EventDetailPageProps {
  event: SportEvent;
  onRegister: (categoryId?: string) => void;
  onBack: () => void;
  onOpenLookup: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onRegister,
  onBack,
  onOpenLookup
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Check deadline
  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date(new Date().setHours(0, 0, 0, 0));
  const isRegistrationClosed = event.status === 'closed' || event.status === 'completed' || isDeadlinePassed;

  const minPrice = Math.min(...event.categories.map(c => c.price));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Ikuti event ${event.name} di ${event.location}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] pb-24">
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onBack} className="hover:text-slate-900 transition-colors">
              Beranda
            </button>
            <span>/</span>
            <span>Events</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {event.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Tersalin!' : 'Bagikan'}
            </button>
            <button
              onClick={onOpenLookup}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#101713] bg-[#9BE34A] rounded-xl hover:bg-[#8cd43b] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Cek Status Pendaftaran
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Main Grid: Left content (8 cols), Right Sticky Summary Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Event Hero Cover & Header */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={event.posterUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#9BE34A] text-[#101713] shadow-md uppercase tracking-wider">
                    {event.sportCategoryLabel}
                  </span>
                  {event.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#101713] shadow-md">
                      Featured Event
                    </span>
                  )}
                </div>

                {/* Overlay Bottom Title */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight text-white drop-shadow-md">
                    {event.name}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#9BE34A] shrink-0" />
                    <span>{event.location}</span>
                  </p>
                </div>
              </div>

              {/* Quick Key Facts Strip */}
              <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border-b border-slate-100 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tanggal Event</span>
                  <strong className="text-slate-900 block mt-0.5">{formatDateIndo(event.eventDate)}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Waktu Mulai</span>
                  <strong className="text-slate-900 block mt-0.5">{event.eventTime}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Pendaftaran Ditutup</span>
                  <strong className={`block mt-0.5 ${isDeadlinePassed ? 'text-rose-600' : 'text-amber-600'}`}>
                    {formatDateIndo(event.registrationDeadline)}
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Biaya Mulai Dari</span>
                  <strong className="text-emerald-700 block mt-0.5 text-sm font-mono font-bold">
                    {formatRupiah(minPrice)}
                  </strong>
                </div>
              </div>

              {/* Event Description */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Tentang Event Ini
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {event.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Titik Kumpul & Lokasi Pelaksanaan:
                    </strong>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {event.locationDetails}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kategori Lomba & Kelas Kompetisi */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
                    PILIHAN KELAS
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                    Kategori & Biaya Pendaftaran
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {event.categories.length} Kategori Tersedia
                </span>
              </div>

              <div className="space-y-4">
                {event.categories.map(cat => {
                  const isFull = cat.quota > 0 && cat.registeredCount >= cat.quota;
                  const availableSlots = Math.max(0, cat.quota - cat.registeredCount);

                  return (
                    <div
                      key={cat.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-[#F9FAF8] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-slate-900 font-display">
                            {cat.name}
                          </h4>
                          {isFull ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              Sold Out
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Sisa {availableSlots} Kuota
                            </span>
                          )}
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-500">{cat.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cat.facilities.map((fac, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-600 font-medium"
                            >
                              ✓ {fac}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center md:flex-col md:items-end justify-between pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 shrink-0">
                        <div className="md:text-right">
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Biaya</span>
                          <span className="text-xl font-black font-mono text-slate-900">
                            {formatRupiah(cat.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => onRegister(cat.id)}
                          disabled={isRegistrationClosed || isFull || !cat.isActive}
                          className="mt-2 py-2 px-5 bg-[#101713] text-[#9BE34A] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          {isRegistrationClosed ? 'Ditutup' : isFull ? 'Penuh' : 'Pilih & Daftar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fasilitas Peserta */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <span className="text-xs uppercase tracking-widest text-[#101713] font-bold">
                BENEFIT ATLET
              </span>
              <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5 mb-4">
                Fasilitas Peserta (Race Pack & Finisher)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.facilitiesOverview.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Podium info if available */}
            {event.rulesAndPodium && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Informasi Hadiah Podium & Ketentuan
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {event.rulesAndPodium}
                </p>
              </div>
            )}

            {/* FAQ Accordion */}
            {event.faqList && event.faqList.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Pertanyaan yang Sering Diajukan (FAQ)
                  </h3>
                </div>

                <div className="space-y-3">
                  {event.faqList.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Penyelenggara & Kontak */}
            <div className="bg-[#101713] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-bold">
                  OFFICIAL ORGANIZER
                </span>
                <h4 className="text-xl font-bold font-display text-white mt-1">
                  {event.organizerName}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Memiliki pertanyaan seputar teknis lomba atau sponsorship? Hubungi panitia pelaksana.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <a
                  href={`https://wa.me/${event.organizerContact.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#9BE34A] text-[#101713] font-bold text-xs rounded-xl hover:bg-[#8cd43b] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT STICKY ACTION CARD (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Biaya Pendaftaran
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                    {formatRupiah(minPrice)}
                  </span>
                  <span className="text-xs text-slate-500">/ peserta</span>
                </div>
              </div>

              {/* Status Warning / Notice */}
              {isRegistrationClosed ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Pendaftaran Ditutup</strong>
                    <span>
                      {isDeadlinePassed
                        ? `Batas akhir pendaftaran telah lewat pada ${formatDateIndo(event.registrationDeadline)}.`
                        : 'Pendaftaran untuk event ini telah resmi ditutup oleh panitia.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Pendaftaran dibuka hingga <strong>{formatDateIndo(event.registrationDeadline)}</strong>
                  </span>
                </div>
              )}

              {/* Primary Register CTA */}
              <button
                type="button"
                onClick={() => onRegister()}
                disabled={isRegistrationClosed}
                className="w-full py-4 px-6 bg-[#101713] text-[#9BE34A] font-extrabold text-sm uppercase tracking-wider rounded-2xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                {isRegistrationClosed ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'}
                {!isRegistrationClosed && <ArrowRight className="w-4 h-4 text-white" />}
              </button>

              <button
                type="button"
                onClick={onOpenLookup}
                className="w-full py-3 px-4 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-600" />
                Cek Tiket Saya yang Sudah Terdaftar
              </button>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verifikasi pembayaran manual via QRIS</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>E-ticket & QR Code resmi untuk race check-in</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Asuransi keselamatan peserta resmi</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
