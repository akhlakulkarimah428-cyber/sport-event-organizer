import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  QrCode,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { storageService } from '../../services/storage';

export type AdminTab =
  | 'overview'
  | 'events'
  | 'participants'
  | 'verification'
  | 'idcard'
  | 'checkin'
  | 'content'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  onViewWebsite,
  children
}) => {
  const registrations = storageService.getRegistrations();
  const pendingCount = registrations.filter(r => r.status === 'waiting_verification').length;

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Event Management', icon: Calendar },
    { id: 'participants', label: 'Data Peserta', icon: Users },
    {
      id: 'verification',
      label: 'Verifikasi Pembayaran',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'idcard', label: 'ID Card Management', icon: CreditCard },
    { id: 'checkin', label: 'Event Check-In (QR)', icon: QrCode },
    { id: 'content', label: 'Konten Website', icon: FileText },
    { id: 'settings', label: 'Pengaturan Sistem', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#101713] text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xl font-black tracking-tight text-white font-display">
              <span>KINETIX</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#9BE34A]" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9BE34A] bg-[#9BE34A]/10 px-2 py-0.5 rounded border border-[#9BE34A]/20">
              PANEL
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#9BE34A] text-[#101713] shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#101713] text-[#9BE34A]'
                          : 'bg-amber-400 text-[#101713]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button
            onClick={onViewWebsite}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#9BE34A]" />
            <span>Lihat Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-900 capitalize">
              {menuItems.find(m => m.id === currentTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800">Admin Utama</span>
              <span className="block text-[10px] text-slate-400 font-mono">admin@kinetix.id</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#101713] text-[#9BE34A] flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
