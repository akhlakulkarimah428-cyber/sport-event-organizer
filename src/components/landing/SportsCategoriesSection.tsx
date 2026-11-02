import React from 'react';
import { Footprints, Bike, Trophy, Activity, Dribbble, Compass, ArrowRight } from 'lucide-react';

interface SportsCategoriesSectionProps {
  onSelectCategory: (categoryKey: string) => void;
}

export const SportsCategoriesSection: React.FC<SportsCategoriesSectionProps> = ({
  onSelectCategory
}) => {
  const sports = [
    {
      id: 'running',
      name: 'Running & Marathon',
      count: '18 Event Tahunan',
      desc: '5K, 10K, Half Marathon, Full Marathon, hingga Night Run dengan rute bersertifikasi.',
      icon: Footprints,
      accent: 'from-emerald-500/10 to-transparent'
    },
    {
      id: 'cycling',
      name: 'Road & Mountain Cycling',
      count: '12 Event Tahunan',
      desc: 'Gran Fondo, KOM challenge, scenic ride, dan criterium sirkuit perkotaan.',
      icon: Bike,
      accent: 'from-lime-500/10 to-transparent'
    },
    {
      id: 'badminton',
      name: 'Badminton Open',
      count: '8 Turnamen',
      desc: 'Kejuaraan terbuka tunggal & ganda grade BWF standard dengan wasit resmi.',
      icon: Activity,
      accent: 'from-teal-500/10 to-transparent'
    },
    {
      id: 'football',
      name: 'Soccer & Futsal Cup',
      count: '10 Kompetisi',
      desc: 'Turnamen sepak bola usia dini, liga komunitas, hingga trofeo antar instansi.',
      icon: Trophy,
      accent: 'from-amber-500/10 to-transparent'
    },
    {
      id: 'basketball',
      name: 'Basketball 3x3 & 5on5',
      count: '6 Kompetisi',
      desc: 'Sirkuit bola basket 3x3 FIBA rules dan turnamen antar klub sekolah/universitas.',
      icon: Dribbble,
      accent: 'from-orange-500/10 to-transparent'
    },
    {
      id: 'other',
      name: 'Multi-Sport & Outdoor',
      count: 'Event Tematik',
      desc: 'Trail run pegunungan, triathlon, aquatic swim, dan festival kebugaran massal.',
      icon: Compass,
      accent: 'from-cyan-500/10 to-transparent'
    }
  ];

  return (
    <section id="categories" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#101713] font-extrabold flex items-center justify-center gap-1.5 mb-2">
          {/* <span className="w-2 h-2 rounded-full bg-[#9BE34A]" /> */}
          SPORTS DISCIPLINES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
          CABANG OLAHRAGA YANG KAMI KELOLA
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Didukung standar teknis profesional, sertifikasi wasit, dan asuransi proteksi atlet di setiap cabang.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sports.map(item => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#101713] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#101713] text-[#9BE34A] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                    {item.count}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#101713]">
                <span>Lihat Event Terjadwal</span>
                <ArrowRight className="w-4 h-4 text-[#9BE34A] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
