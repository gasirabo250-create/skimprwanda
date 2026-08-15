import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import type { Brand, ModelItem } from '../../types';

const emptyForm = {
  brandId: '', modelId: '', year: '', price: '', mileage: '', fuel: 'Petrol', transmission: 'Automatic',
  engine: '', bodyType: 'SUV', color: '', seats: '5', doors: '4', driveType: 'FWD', location: 'Kigali',
  condition: 'Used', description: '', features: '', status: 'Draft', featured: false,
};

const VehicleForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/brands').then((res) => setBrands(res.data.data));
  }, []);

  useEffect(() => {
    if (form.brandId) api.get('/models', { params: { brandId: form.brandId } }).then((res) => setModels(res.data.data));
    else setModels([]);
  }, [form.brandId]);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/vehicles/${id}`).then((res) => {
      const v = res.data.data;
      setForm({
        brandId: v.brandId._id, modelId: v.modelId._id, year: String(v.year), price: String(v.price),
        mileage: String(v.mileage), fuel: v.fuel, transmission: v.transmission, engine: v.engine || '',
        bodyType: v.bodyType, color: v.color || '', seats: String(v.seats || 5), doors: String(v.doors || 4),
        driveType: v.driveType || 'FWD', location: v.location || 'Kigali', condition: v.condition || 'Used',
        description: v.description || '', features: (v.features || []).join(', '), status: v.status,
        featured: v.featured,
      });
      setImageUrls((v.images || []).map((i: any) => i.url));
    });
  }, [id, isEdit]);

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const data = new FormData();
    Array.from(e.target.files).forEach((f) => data.append('images', f));
    try {
      const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImageUrls((prev) => [...prev, ...res.data.data]);
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImageUrls((prev) => prev.filter((u) => u !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.brandId || !form.modelId || !form.year || !form.price || !form.mileage) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      seats: Number(form.seats),
      doors: Number(form.doors),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      images: imageUrls.map((url, i) => ({ url, isPrimary: i === 0 })),
    };
    try {
      if (isEdit) await api.put(`/vehicles/${id}`, payload);
      else await api.post('/vehicles', payload);
      navigate('/admin/dashboard/vehicles');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Brand *</label>
            <select required value={form.brandId} onChange={(e) => update('brandId', e.target.value)} className={inputClass}>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Model *</label>
            <select required value={form.modelId} onChange={(e) => update('modelId', e.target.value)} className={inputClass}>
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
            <label className="text-sm font-semibold block mb-1">Price (RWF) *</label>
            <input required type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Mileage (km) *</label>
            <input required type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Fuel</label>
            <select value={form.fuel} onChange={(e) => update('fuel', e.target.value)} className={inputClass}>
              {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Transmission</label>
            <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className={inputClass}>
              {['Automatic', 'Manual'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Body Type</label>
            <select value={form.bodyType} onChange={(e) => update('bodyType', e.target.value)} className={inputClass}>
              {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Crossover'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Engine</label>
            <input value={form.engine} onChange={(e) => update('engine', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Color</label>
            <input value={form.color} onChange={(e) => update('color', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Location</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Features (comma separated)</label>
          <input value={form.features} onChange={(e) => update('features', e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="mb-3" />
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="w-24 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          {uploading && <p className="text-xs mt-2">Uploading...</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}>
              {['Draft', 'Available', 'Reserved', 'Sold'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            <span className="text-sm font-semibold">Mark as Featured</span>
          </label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Vehicle'}
          </button>
          <button type="button" onClick={() => navigate('/admin/dashboard/vehicles')} className="rounded-full border border-black/10 dark:border-white/20 font-semibold px-6 py-3 min-h-[44px]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
