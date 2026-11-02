import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Ticket } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenLookup,
  onOpenAdmin,
  currentView
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Events', target: 'events' },
    { label: 'Tentang Kami', target: 'about' },
    { label: 'Kategori', target: 'categories' },
    { label: 'Galeri', target: 'gallery' },
    { label: 'Kontak', target: 'contact' }
  ];

  // Dipakai berulang supaya warna teks konsisten antara state transparan & solid
  const textTone = isScrolled ? 'text-slate-700' : 'text-white/90';
  const textToneHover = isScrolled ? 'hover:text-[#101713]' : 'hover:text-white';
  const brandTone = isScrolled ? 'text-[#101713]' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-gradient-to-b from-black/40 via-black/10 to-transparent py-5 sm:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-1.5 text-2xl font-black tracking-tight font-display whitespace-nowrap shrink-0 group text-left transition-colors duration-500 ${brandTone}`}
        >
          <span>KINETIX</span>
          {/* <span className="w-2 h-2 rounded-full bg-[#9BE34A] group-hover:scale-125 transition-transform" /> */}
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className={`hidden md:flex items-center gap-7 text-sm font-semibold transition-colors duration-500 ${textTone}`}>
          {navItems.map(item => (
            <button
              key={item.target}
              onClick={() => onNavigate(item.target)}
              className={`relative transition-colors whitespace-nowrap shrink-0 pb-1 ${textToneHover} ${
                currentView === item.target
                  ? isScrolled ? 'text-[#101713]' : 'text-white'
                  : ''
              } group`}
            >
              {item.label}
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#9BE34A] transition-all duration-300 ${
                  currentView === item.target ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Zone 3: Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLookup}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              isScrolled
                ? 'text-slate-700 hover:text-[#101713] hover:bg-slate-200/60'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Ticket className={`w-4 h-4 ${isScrolled ? 'text-[#101713]' : 'text-[#9BE34A]'}`} />
            Cek E-Ticket
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#101713] bg-[#9BE34A] rounded-xl hover:bg-[#8cd43b] transition-all shadow-sm whitespace-nowrap"
          >
            <span>Daftar Event</span>
            {/* <ArrowUpRight className="w-4 h-4" /> */}
          </button>

          <button
            onClick={onOpenAdmin}
            className={`text-[11px] font-semibold transition-colors px-2 py-1 ${
              isScrolled ? 'text-slate-400 hover:text-slate-800' : 'text-white/50 hover:text-white'
            }`}
            title="Portal Admin"
          >
            Admin
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={onOpenLookup}
            className={`p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-slate-700 hover:text-black' : 'text-white hover:text-[#9BE34A]'
            }`}
            title="Cek E-Ticket"
          >
            <Ticket className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg focus:outline-none transition-colors ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown — selalu solid putih biar tetap kebaca di atas foto apapun */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl mt-3 sm:mt-0">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.target}
                onClick={() => {
                  onNavigate(item.target);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl hover:bg-slate-50 ${
                  currentView === item.target ? 'text-[#101713] bg-slate-50' : 'text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 rounded-xl flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              Cek Status & E-Ticket
            </button>
            <button
              onClick={() => {
                onNavigate('events');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#101713] bg-[#9BE34A] rounded-xl flex items-center justify-center gap-2"
            >
              <span>Explore Events</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-center text-xs text-slate-400 py-1"
            >
              Admin Portal Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};