import React from 'react';
import { Target, Flag, Award, Sparkles, Check } from 'lucide-react';
import { OrganizationSettings } from '../../types';
import nightRun from '../../assets/images/night_run_poster_1793544244194.jpg';
import sportsHero from '../../assets/images/sports_hero_banner_1793544243318.jpg';
import cyclingTour from '../../assets/images/cycling_tour_poster_1793544244532.jpg';
import badmintonAction from '../../assets/images/badminton_action_poster_1793544244424.jpg';

interface AboutSectionProps {
  settings: OrganizationSettings;
  onExploreEvents: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onExploreEvents }) => {
  return (
    <section id="about" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Editorial layout inspired by Padeluxe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Text & Editorial Narrative (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#101713] font-extrabold flex items-center gap-1.5 mb-2">
              {/* <span className="w-2 h-2 rounded-full bg-[#9BE34A]" /> */}
              ABOUT US
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15]">
              YOUR HOME FOR MODERN SPORTS EXPERIENCES
            </h2>
          </div>

          <p className="text-base text-slate-600 leading-relaxed">
            {settings.description}
          </p>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#9BE34A]/20 text-[#101713] flex items-center justify-center font-bold">
                <Target className="w-4 h-4 text-emerald-800" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-display">Visi Kami</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {settings.vision}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#101713] text-[#9BE34A] flex items-center justify-center font-bold">
                <Flag className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-display">Misi Kami</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {settings.mission}
              </p>
            </div>
          </div>

          {/* Key Checklist */}
          <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#9BE34A] text-[#101713] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Sertifikasi resmi federasi atletik & olahraga nasional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#9BE34A] text-[#101713] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Sistem manajemen race pack & RFID timing transponder profesional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#9BE34A] text-[#101713] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Pendaftaran multi-cabang tanpa repot dengan e-ticket instan</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreEvents}
              className="py-3 px-6 rounded-xl bg-[#101713] text-[#9BE34A] font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <span>Jelajahi Kalender Event</span>
              {/* <Sparkles className="w-3.5 h-3.5" /> */}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Editorial Photo Montage (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-900">
            <img
              src="nightRun"
              alt="Community sports event finish line"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
              <span className="font-bold text-[#9BE34A] block uppercase text-[10px] tracking-wider">
                Dokumentasi Acara
              </span>
              <span className="font-semibold text-sm">Gema Night Run & Festival Olahraga Komunitas</span>
            </div>
          </div>

          {/* Sub photos strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-200 shadow-sm border border-slate-200">
              <img
                src="sportsHero"
                alt="Track running"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-200 shadow-sm border border-slate-200">
              <img
                src="/src/assets/images/cycling_tour_poster_1793544244532.jpg"
                alt="Cycling team"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-200 shadow-sm border border-slate-200">
              <img
                src="/src/assets/images/badminton_action_poster_1793544244424.jpg"
                alt="Badminton arena"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
