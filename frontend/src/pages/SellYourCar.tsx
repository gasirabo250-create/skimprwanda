import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { submitSellerRequest } from '../api/leads';
import { getBrands, getModels } from '../api/brands';
import type { Brand, ModelItem } from '../types';

const SellYourCar: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', brandId: '', modelId: '', year: '', mileage: '', expectedPrice: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.brandId) getModels(form.brandId).then(setModels).catch(() => {});
    else setModels([]);
  }, [form.brandId]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.year || !form.mileage || !form.expectedPrice) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await submitSellerRequest({
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage),
        expectedPrice: Number(form.expectedPrice),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong submitting your car. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent/10 text-accent mb-4"><CheckCircle2 size={32} /></div>
        <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
        <p className="text-black/60 dark:text-white/60">
          We've received your vehicle details. Our team will review it and reach out to you shortly.
        </p>
      </div>
    );
  }

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Sell Your Car</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">
        Tell us about your vehicle and our team will get back to you with a fair offer.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Full Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Phone Number *</label>
            <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Brand</label>
            <select value={form.brandId} onChange={(e) => update('brandId', e.target.value)} className={inputClass}>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Model</label>
            <select value={form.modelId} onChange={(e) => update('modelId', e.target.value)} className={inputClass}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Year *</label>
            <input required type="number" value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Mileage (km) *</label>
            <input required type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Expected Price (RWF) *</label>
            <input required type="number" value={form.expectedPrice} onChange={(e) => update('expectedPrice', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className={inputClass} />
        </div>

        <p className="text-xs text-black/50 dark:text-white/50">
          Image upload for your vehicle can be shared with our team directly on WhatsApp after you submit this form.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit My Car'}
        </button>
      </form>
    </div>
  );
};

export default SellYourCar;
