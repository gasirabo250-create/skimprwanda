import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Brand } from '../../types';

const BrandsAdmin: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/brands').then((res) => setBrands(res.data.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    try {
      await api.post('/brands', { name });
      setName('');
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add brand');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand? Models and vehicles under it may become invalid.')) return;
    await api.delete(`/brands/${id}`);
    load();
  };

  const toggleFeatured = async (b: Brand) => {
    await api.put(`/brands/${b._id}`, { featured: !b.featured });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Brands</h1>
      <form onSubmit={handleAdd} className="flex gap-3 mb-6 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New brand name" className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]" />
        <button type="submit" className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-5 py-2.5 text-sm">Add</button>
      </form>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div key={b._id} className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{b.name}</p>
              {b.featured && <span className="text-xs text-black/50 dark:text-white/50">Featured</span>}
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggleFeatured(b)} className="font-semibold hover:underline">{b.featured ? 'Unfeature' : 'Feature'}</button>
              <button onClick={() => handleDelete(b._id)} className="font-semibold text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsAdmin;
