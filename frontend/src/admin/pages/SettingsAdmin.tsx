import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Settings } from '../../types';

const SettingsAdmin: React.FC = () => {
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then((res) => setForm(res.data.data));
  }, []);

  if (!form) return <p>Loading settings...</p>;

  const update = (key: keyof Settings, value: any) => setForm((f) => f && { ...f, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/settings', form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">WhatsApp Number</label>
            <input value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">Email</label>
          <input value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">Address</label>
          <input value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Instagram Handle</label>
            <input value={form.instagramHandle} onChange={(e) => update('instagramHandle', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Facebook URL</label>
            <input value={form.facebookUrl} onChange={(e) => update('facebookUrl', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">Homepage Hero Title</label>
          <input
            value={form.homepageHero?.title || ''}
            onChange={(e) => update('homepageHero', { ...form.homepageHero, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">Homepage Hero Subtitle</label>
          <input
            value={form.homepageHero?.subtitle || ''}
            onChange={(e) => update('homepageHero', { ...form.homepageHero, subtitle: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">About Page Content</label>
          <textarea rows={5} value={form.aboutContent || ''} onChange={(e) => update('aboutContent', e.target.value)} className={inputClass} />
        </div>

        {saved && <p className="text-sm text-green-600">Settings saved.</p>}
        <button type="submit" disabled={saving} className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsAdmin;
