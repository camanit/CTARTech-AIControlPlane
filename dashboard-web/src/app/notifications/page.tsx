'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Send, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Play, 
  ShieldCheck,
  Radio,
  Sliders
} from 'lucide-react';
import { getStoredNotificationSettings, saveStoredNotificationSettings, NotificationSettings } from '@/lib/api';

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(getStoredNotificationSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ type: string; msg: string; status: 'SUCCESS' | 'ERROR' } | null>(null);

  useEffect(() => {
    setSettings(getStoredNotificationSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredNotificationSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestWhatsApp = () => {
    setTestResult({
      type: 'WhatsApp',
      msg: `[SIMULASI] Notifikasi terkirim ke WhatsApp ${settings.whatsapp.targetNumber}: "🚨 AI Agent Security Alert: agent_finance_01 membutuhkan persetujuan CISO!"`,
      status: 'SUCCESS',
    });
  };

  const handleTestSms = () => {
    setTestResult({
      type: 'SMS',
      msg: `[SIMULASI] SMS Alert terkirim dengan Sender ID [${settings.sms.senderId}]: "CTARTech Security Alert: High-risk action held."`,
      status: 'SUCCESS',
    });
  };

  const handleTestEmail = () => {
    setTestResult({
      type: 'Email',
      msg: `[SIMULASI] Email Alert terkirim ke ${settings.email.adminEmail} via ${settings.email.smtpHost}:${settings.email.smtpPort}.`,
      status: 'SUCCESS',
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl mx-auto overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Send className="w-4 h-4" />
            <span>Multi-Channel Dispatcher</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Konfigurasi Gateway Notifikasi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan saluran komunikasi agar CISO &amp; tim SecOps menerima peringatan instan saat AI Agent memicu status REQUIRE_APPROVAL.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Konfigurasi seluruh saluran notifikasi berhasil disimpan!</span>
          </div>
        )}

        {testResult && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span><strong>{testResult.type} Gateway:</strong> {testResult.msg}</span>
            </div>
            <button onClick={() => setTestResult(null)} className="text-xs underline text-slate-400 hover:text-white">
              Tutup
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* WhatsApp Gateway Settings */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">WhatsApp Gateway (kaowhat.com / Fonnte)</h2>
                  <p className="text-[11px] text-slate-400">Kirim notifikasi instan langsung ke nomor WhatsApp pimpinan/CISO</p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsapp.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      whatsapp: { ...settings.whatsapp, enabled: e.target.checked },
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <span>{settings.whatsapp.enabled ? 'Aktif' : 'Nonaktif'}</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">API Endpoint URL</label>
                <input
                  type="text"
                  value={settings.whatsapp.apiUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      whatsapp: { ...settings.whatsapp, apiUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="https://kaowhat.com/api/v1/send"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">API Token / Secret Key</label>
                <input
                  type="password"
                  value={settings.whatsapp.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      whatsapp: { ...settings.whatsapp, apiKey: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="kw_live_secret_xxxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Nomor WhatsApp Admin / CISO (Penerima Alert)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.whatsapp.targetNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, targetNumber: e.target.value },
                      })
                    }
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    placeholder="082129745115"
                  />
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Kirim WA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Gateway Settings */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">SMS Gateway (OTP &amp; Emergency Fallback)</h2>
                  <p className="text-[11px] text-slate-400">Saluran fallback jika koneksi internet seluler penerima bermasalah</p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sms.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, enabled: e.target.checked },
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <span>{settings.sms.enabled ? 'Aktif' : 'Nonaktif'}</span>
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">SMS API Endpoint</label>
                <input
                  type="text"
                  value={settings.sms.apiUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, apiUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="https://sms.vendor.com/send"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Sender ID (Alpha-numeric)</label>
                <input
                  type="text"
                  value={settings.sms.senderId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, senderId: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="CTARTECH"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.sms.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, apiKey: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="sms_key_xxxx"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleTestSms}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Kirim SMS</span>
              </button>
            </div>
          </div>

          {/* Email SMTP Settings */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Email SMTP &amp; Security Digest</h2>
                  <p className="text-[11px] text-slate-400">Pengiriman laporan audit harian dan eskalasi ancaman resmi</p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, enabled: e.target.checked },
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <span>{settings.email.enabled ? 'Aktif' : 'Nonaktif'}</span>
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">SMTP Server Host</label>
                <input
                  type="text"
                  value={settings.email.smtpHost}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email Pengirim</label>
                <input
                  type="text"
                  value={settings.email.smtpUser}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUser: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="alert@ctar.tech"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Email Penerima (CISO / SecOps)</label>
                <input
                  type="email"
                  value={settings.email.adminEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, adminEmail: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  placeholder="ciso@perusahaan.com"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleTestEmail}
                  className="w-full py-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Kirim Email</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Pengaturan Gateway</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
