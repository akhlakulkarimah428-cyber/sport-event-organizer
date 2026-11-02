import React, { useState } from 'react';
import { OrganizationSettings } from '../../types';
import { storageService } from '../../services/storage';
import { Check, QrCode, CreditCard, Shield, Phone, Mail, Building } from 'lucide-react';

interface AdminSettingsProps {
  settings: OrganizationSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<OrganizationSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    // In production/demo, we can save in settings or local storage
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setNewPassword('');
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900">
          Pengaturan Sistem & Gateway Pembayaran
        </h2>
        <p className="text-xs text-slate-500">
          Konfigurasi QRIS statis, rekening bank transfer panitia, dan saluran notifikasi e-ticket.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* QRIS Configuration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Pengaturan QRIS Penyelenggara
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Merchant QRIS *
              </label>
              <input
                type="text"
                value={formData.qrisMerchantName}
                onChange={e => setFormData({ ...formData, qrisMerchantName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                URL Gambar QRIS (Image Source) *
              </label>
              <input
                type="text"
                value={formData.qrisImageUrl}
                onChange={e => setFormData({ ...formData, qrisImageUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={formData.qrisImageUrl}
              alt="QRIS Preview"
              className="w-24 h-24 object-contain bg-white p-2 rounded-xl border border-slate-300"
            />
            <div className="text-xs text-slate-600">
              <span className="font-bold block text-slate-900">Preview QRIS yang Tampil ke Peserta:</span>
              <span className="text-[11px] text-slate-500">
                Setiap peserta di Step 2 registrasi akan memindai kode QRIS di atas untuk melakukan transfer manual.
              </span>
            </div>
          </div>
        </div>

        {/* Bank Transfer Alternatives */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Rekening Bank Alternatif Panitia
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Atas Nama (Holder)
              </label>
              <input
                type="text"
                value={formData.bankAccountHolder}
                onChange={e => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Kontak & Alamat Kantor
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor WhatsApp Official
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Dukungan Peserta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Alamat Sekretariat Organisasi
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 bg-[#101713] text-[#9BE34A] font-extrabold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-800 shadow-md"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </form>
    </div>
  );
};
