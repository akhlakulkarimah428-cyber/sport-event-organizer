import React from 'react';
import { SponsorPartner } from '../../types';

interface SponsorsSectionProps {
  sponsors: SponsorPartner[];
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ sponsors }) => {
  return (
    <section className="py-14 sm:py-18 bg-[#F5F7F4] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Official Sponsors, Partners & Sanctioning Bodies
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs hover:border-slate-400 transition-colors"
            >
              <span className="block text-sm font-black font-display text-slate-800 tracking-wider">
                {sponsor.logoText}
              </span>
              <span className="block text-[10px] text-slate-400 uppercase mt-0.5 font-medium">
                {sponsor.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
