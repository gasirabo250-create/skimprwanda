import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitViewingRequest } from '../api/leads';
import { getVehicles } from '../api/vehicles';
import type { Vehicle } from '../types';

const BookViewing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('vehicleId') || '';
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', vehicleId: preselectedId, preferredDate: '', preferredTime: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVehicles({ limit: 100, status: 'Available' }).then((res) => setVehicles(res.data)).catch(() => {});
  }, []);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.vehicleId || !form.preferredDate || !form.preferredTime) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await submitViewingRequest(form);
      setSubmitted(true);
    } catch {
      setError('Something went wrong booking your viewing. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent/10 text-accent mb-4"><CheckCircle2 size={32} /></div>
        <h1 className="text-2xl font-bold mb-2">Viewing Requested!</h1>
        <p className="text-black/60 dark:text-white/60">
          We'll confirm your appointment shortly by phone or WhatsApp.
        </p>
      </div>
    );
  }

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Book a Viewing</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Schedule a time to see and test drive a vehicle in person.</p>

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

        <div>
          <label className="text-sm font-semibold block mb-1">Vehicle *</label>
          <select required value={form.vehicleId} onChange={(e) => update('vehicleId', e.target.value)} className={inputClass}>
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>{v.brandId?.name} {v.modelId?.name} {v.year}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Preferred Date *</label>
            <input required type="date" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Preferred Time *</label>
            <input required type="time" value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Message</label>
          <textarea rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} className={inputClass} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px] transition-colors disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Viewing'}
        </button>
      </form>
    </div>
  );
};

export default BookViewing;
