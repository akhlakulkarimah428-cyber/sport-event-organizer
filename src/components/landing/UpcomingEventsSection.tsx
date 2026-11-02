import React, { useState, useMemo } from 'react';
import { SportEvent, SportCategory } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles
} from 'lucide-react';

interface UpcomingEventsSectionProps {
  events: SportEvent[];
  onSelectEvent: (event: SportEvent) => void;
  onRegisterEvent: (event: SportEvent) => void;
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Cabang' },
    { id: 'running', label: 'Running / Marathon' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'badminton', label: 'Badminton' },
    { id: 'football', label: 'Football' },
    { id: 'basketball', label: 'Basketball' }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Category filter
      if (selectedCategory !== 'all' && event.sportCategory !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const isClosed = event.status === 'closed' || new Date(event.registrationDeadline) < new Date();
        if (selectedStatus === 'open' && isClosed) return false;
        if (selectedStatus === 'closed' && !isClosed) return false;
      }

      // Search keyword
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = event.name.toLowerCase().includes(query);
        const matchLoc = event.location.toLowerCase().includes(query);
        const matchCat = event.sportCategoryLabel.toLowerCase().includes(query);
        if (!matchName && !matchLoc && !matchCat) return false;
      }

      return true;
    });
  }, [events, selectedCategory, selectedStatus, searchQuery]);

  return (
    <section id="events" className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#101713] font-extrabold flex items-center gap-1.5 mb-2">
              {/* <span className="w-2 h-2 rounded-full bg-[#9BE34A]" /> */}
              UPCOMING EVENTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              JELAJAHI EVENT OLAHRAGA TERBARU
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Pilih event yang sesuai dengan minat dan target kebugaran Anda. Pendaftaran cepat dan instan dengan verifikasi e-pass QRIS.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari event atau kota..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F5F7F4] text-xs focus:outline-none focus:ring-2 focus:ring-[#9BE34A]"
            />
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs adhering to zero-pill discipline) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#101713] text-[#9BE34A] shadow-md'
                      : 'bg-[#F5F7F4] text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Status Segmented */}
          <div className="flex items-center gap-1 p-1 bg-[#F5F7F4] rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setSelectedStatus('open')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStatus === 'open' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Buka
            </button>
            <button
              onClick={() => setSelectedStatus('closed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStatus === 'closed' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ditutup
            </button>
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-[#F9FAF8] rounded-3xl border border-dashed border-slate-300">
            <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-base">Tidak Ada Event yang Sesuai</h4>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter cabang olahraga.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-[#101713] bg-[#9BE34A] rounded-xl hover:bg-[#8cd43b]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map(event => {
              const minPrice = Math.min(...event.categories.map(c => c.price));
              const isDeadlinePassed = new Date(event.registrationDeadline) < new Date(new Date().setHours(0, 0, 0, 0));
              const isClosed = event.status === 'closed' || isDeadlinePassed;
              
              // Calculate quota fullness
              const totalQuota = event.categories.reduce((acc, c) => acc + c.quota, 0);
              const totalRegistered = event.categories.reduce((acc, c) => acc + c.registeredCount, 0);
              const isAlmostFull = totalQuota > 0 && totalRegistered / totalQuota >= 0.75;

              return (
                <div
                  key={event.id}
                  className="group bg-[#FDFDFD] rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Cover */}
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={event.posterUrl}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#101713]/85 text-[#9BE34A] backdrop-blur-md border border-white/10">
                          {event.sportCategoryLabel.split('/')[0]}
                        </span>

                        {isClosed ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-600/90 text-white backdrop-blur-md">
                            Closed
                          </span>
                        ) : isAlmostFull ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md">
                            Almost Full
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md">
                            Open
                          </span>
                        )}
                      </div>

                      {/* Location bar bottom on image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center gap-1.5 drop-shadow">
                        <MapPin className="w-3.5 h-3.5 text-[#9BE34A] shrink-0" />
                        <span className="truncate font-medium">{event.location}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <h3
                        onClick={() => onSelectEvent(event)}
                        className="text-lg font-bold font-display text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {event.name}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pelaksanaan: <strong>{formatDateIndo(event.eventDate)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: <strong className={isClosed ? 'text-rose-600' : 'text-slate-700'}>{formatDateIndo(event.registrationDeadline)}</strong></span>
                        </div>
                      </div>

                      {/* Facilities quick peek */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {event.facilitiesOverview.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                          >
                            {f}
                          </span>
                        ))}
                        {event.facilitiesOverview.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                            +{event.facilitiesOverview.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-400">
                          Mulai Dari
                        </span>
                        <span className="text-base font-extrabold font-mono text-slate-900">
                          {formatRupiah(minPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => onRegisterEvent(event)}
                          disabled={isClosed}
                          className="px-4 py-2 text-xs font-black uppercase tracking-wider text-[#101713] bg-[#9BE34A] hover:bg-[#8cd43b] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>{isClosed ? 'Tutup' : 'Daftar'}</span>
                          {!isClosed && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
