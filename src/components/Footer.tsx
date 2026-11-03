import React from 'react';
import { OrganizationSettings } from '../types';
import { Mail, Phone, MapPin, Instagram, Youtube, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  settings: OrganizationSettings;
  onNavigate: (sectionId: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenLookup,
  onOpenAdmin
}) => {
  return (
    <footer id="contact" className="bg-[#101713] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Bio (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-white font-display">
              <span>KINETIX</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#9BE34A]" />
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings.description}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9BE34A] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9BE34A] shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9BE34A] shrink-0" />
                <span>{settings.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#9BE34A]  transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-[#9BE34A]  transition-colors">
                  Jadwal Event Terbaru
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#9BE34A]  transition-colors">
                  Profil Organisasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-[#9BE34A]  transition-colors">
                  Cabang Olahraga
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#9BE34A]  transition-colors">
                  Galeri & Dokumentasi
                </button>
              </li>
            </ul>
          </div>

          {/* Participant Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Layanan Peserta
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                {/* <button onClick={onOpenLookup} className="text-white hover:underline font-bold">
                  Cek Status Registrasi & E-Ticket
                </button> */}
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-[#9BE34A]  transition-colors">
                  Cara Pendaftaran Multi-Step
                </button>
              </li>
              <li>
                <span className="text-slate-500">Panduan Pembayaran QRIS</span>
              </li>
              <li>
                <span className="text-slate-500">Syarat & Ketentuan Lomba</span>
              </li>
              <li>
                <span className="text-slate-500">Kebijakan Privasi Peserta</span>
              </li>
            </ul>
          </div>

          {/* Socials & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Media Sosial & Admin
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#9BE34A] hover:text-[#101713] transition-colors flex items-center justify-center text-white"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#9BE34A] hover:text-[#101713] transition-colors flex items-center justify-center text-white"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[11px] text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#9BE34A]" />
                <span>Login Admin Dashboard</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 KINETIX Sports Organizer. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Running</span>
            <span>·</span>
            <span>Cycling</span>
            <span>·</span>
            <span>Badminton</span>
            <span>·</span>
            <span>Football</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
