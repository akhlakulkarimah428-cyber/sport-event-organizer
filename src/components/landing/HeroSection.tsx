import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Trophy, ShieldCheck, Zap, Users } from 'lucide-react';

interface HeroSectionProps {
  onExploreEvents: () => void;
  onDiscoverAbout: () => void;
}

// Ganti / tambah path foto di sini
const heroImages = [
  '/src/assets/images/night_run_poster_1793544244194.jpg',
  '/src/assets/images/sports_hero_banner_1793544243318.jpg',
  '/src/assets/images/cycling_tour_poster_1793544244532.jpg',
  '/src/assets/images/badminton_action_poster_1793544244424.jpg',
];

const SLIDE_DURATION_MS = 5000; // ganti sesuai kecepatan yang kamu mau

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreEvents,
  onDiscoverAbout
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen text-white overflow-hidden">

      {/* Background Slideshow - full screen, crossfade antar gambar */}
      <div className="absolute inset-0 z-0 bg-[#101713]">
        {heroImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Athletes in motion"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          />
        ))}
        {/* Measured multi-layer gradient scrim for high contrast legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101713]/95 via-[#101713]/70 to-[#101713]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101713] via-transparent to-transparent" />
      </div>

      {/* Slide indicator dots (opsional, hapus kalau gak perlu) */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-[#9BE34A]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Content wrapper */}
     <div className="relative z-10 flex flex-col justify-between min-h-screen px-4 sm:px-6 lg:px-16 pt-24 sm:pt-32 pb-6 sm:pb-12 max-w-7xl mx-auto">

        {/* Top Tagline */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-[#9BE34A] tracking-wider uppercase">
            Official Sports Organizer
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-300 font-medium">
            Running · Football · Badminton · Cycling · Basketball
          </span>
        </div>

        {/* Center/Bottom Content */}
        <div className="max-w-3xl mt-16 sm:mt-24 space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase leading-[1.05]">
            MAKE EVERY MOMENT
            <br />
            <span className="text-[#9BE34A]">A NEW CHALLENGE</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-xl font-normal leading-relaxed">
            We create meaningful sports experiences through exciting events, competitions, and communities across Indonesia.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onExploreEvents}
              className="py-4 px-8 rounded-2xl bg-[#9BE34A] text-[#101713] font-black text-sm uppercase tracking-wider hover:bg-[#8cd43b] transition-all flex items-center gap-2 shadow-xl hover:shadow-[#9BE34A]/25"
            >
              <span>Explore Events</span>
              {/* <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> */}
            </button>

            <button
              onClick={onDiscoverAbout}
              className="py-4 px-8 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Discover Our Organization</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-10 border-t border-white/15 text-xs text-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#9BE34A]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-white text-sm">48+ Events</span>
              <span className="text-[11px] text-slate-400">Terselenggara Sukses</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#9BE34A]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-white text-sm">35,000+</span>
              <span className="text-[11px] text-slate-400">Peserta & Komunitas</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#9BE34A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-white text-sm">Official Timing</span>
              <span className="text-[11px] text-slate-400">RFID Chip Accurate</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#9BE34A]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-white text-sm">Instant E-Pass</span>
              <span className="text-[11px] text-slate-400">QR Validated Check-in</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};