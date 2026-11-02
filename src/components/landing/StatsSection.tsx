import React from 'react';
import { SportEvent, ParticipantRegistration } from '../../types';
import { Calendar, Users, Layers, Handshake } from 'lucide-react';

interface StatsSectionProps {
  events: SportEvent[];
  registrations: ParticipantRegistration[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ events, registrations }) => {
  const totalEvents = events.length;
  // Calculate verified + simulated community count
  const baseParticipants = 28450;
  const currentTotal = baseParticipants + registrations.length;
  
  const categoriesCount = new Set(events.map(e => e.sportCategory)).size;

  const stats = [
    {
      label: 'Total Event Terselenggara',
      value: `${totalEvents + 45}+`,
      subtext: 'Di Jawa Timur & Seluruh Indonesia',
      icon: Calendar
    },
    {
      label: 'Total Atlet & Peserta Terdaftar',
      value: `${currentTotal.toLocaleString('id-ID')}+`,
      subtext: 'Pelari, pesepeda & pegiat olahraga',
      icon: Users
    },
    {
      label: 'Cabang Olahraga Resmi',
      value: `${categoriesCount > 4 ? categoriesCount : 6}+`,
      subtext: 'Dari marathon hingga kejuaraan beregu',
      icon: Layers
    },
    {
      label: 'Komunitas & Sponsor Partner',
      value: '120+',
      subtext: 'Klub lari, PBSI, ISSI & BUMN',
      icon: Handshake
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#F9FAF8] border border-slate-200/80 hover:border-[#101713] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#101713] text-[#9BE34A] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
