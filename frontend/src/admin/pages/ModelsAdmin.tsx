import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Brand, ModelItem } from '../../types';

const bodyTypes = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Crossover'];

const ModelsAdmin: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [form, setForm] = useState({ name: '', brandId: '', bodyType: 'SUV' });
  const [error, setError] = useState('');

  const load = () => {
    api.get('/brands').then((res) => setBrands(res.data.data));
    api.get('/models').then((res) => setModels(res.data.data));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brandId) return;
    setError('');
    try {
      await api.post('/models', form);
      setForm({ name: '', brandId: '', bodyType: 'SUV' });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add model');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this model? Vehicles under it may become invalid.')) return;
    await api.delete(`/models/${id}`);
    load();
  };

  const inputClass = 'rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Models</h1>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <select value={form.brandId} onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))} className={inputClass}>
          <option value="">Select brand</option>
          {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Model name" className={inputClass} />
        <select value={form.bodyType} onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value }))} className={inputClass}>
          {bodyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-5 py-2.5 text-sm">Add Model</button>
      </form>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 dark:border-white/10">
              <th className="p-3">Model</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Body Type</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m._id} className="border-b border-black/5 dark:border-white/5">
                <td className="p-3 font-semibold">{m.name}</td>
                <td className="p-3">{typeof m.brandId === 'object' ? m.brandId.name : ''}</td>
                <td className="p-3">{m.bodyType}</td>
                <td className="p-3 text-right"><button onClick={() => handleDelete(m._id)} className="font-semibold text-red-500 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid sm:grid-cols-2 gap-4">
        {models.map((m) => (
          <div key={m._id} className="rounded-lg border border-black/10 dark:border-white/10 p-4">
            <p className="font-semibold mb-2">{m.name}</p>
            <div className="space-y-1 text-sm mb-4">
              <p className="text-black/60 dark:text-white/60">Brand: <span className="font-semibold text-black dark:text-white">{typeof m.brandId === 'object' ? m.brandId.name : ''}</span></p>
              <p className="text-black/60 dark:text-white/60">Type: <span className="font-semibold text-black dark:text-white">{m.bodyType}</span></p>
            </div>
            <button onClick={() => handleDelete(m._id)} className="w-full font-semibold text-red-500 hover:underline text-sm py-2 border border-red-500 rounded-lg">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelsAdmin;
