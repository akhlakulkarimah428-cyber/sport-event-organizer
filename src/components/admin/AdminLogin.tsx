import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { Lock, ArrowLeft, ShieldAlert, KeyRound, Check } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageService.adminLogin(password)) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    storageService.adminLogin('admin123');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Website Utama
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#101713] text-[#9BE34A] mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#101713]">
              Portal Keamanan
            </span>
            <h1 className="text-2xl font-black font-display text-slate-900 mt-1">
              Admin KINETIX
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Masuk untuk mengelola event, memverifikasi pembayaran peserta, dan operasional check-in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password Administrator *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Ketik password admin..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9BE34A] focus:border-[#101713]"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {error && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Password salah. Gunakan default: admin123
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#101713] text-[#9BE34A] font-extrabold rounded-xl hover:bg-slate-800 transition-all text-sm shadow-md"
            >
              Masuk ke Dashboard
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500 mb-2">
                Akses Demo Cepat: Password default <strong>admin123</strong>
              </span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Login Cepat 1-Klik (Sebagai Admin)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
