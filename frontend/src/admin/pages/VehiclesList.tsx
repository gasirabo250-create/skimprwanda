import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Vehicle } from '../../types';
import { formatPrice, primaryImage } from '../../utils/format';

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-200 text-gray-700',
  Available: 'bg-green-100 text-green-700',
  Reserved: 'bg-yellow-100 text-yellow-700',
  Sold: 'bg-red-100 text-red-700',
};

const VehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/vehicles', { params: { limit: 100, sort: '-createdAt' } })
      .then((res) => setVehicles(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return;
    await api.delete(`/vehicles/${id}`);
    load();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await api.put(`/vehicles/${id}`, { status });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Link to="/admin/dashboard/vehicles/new" className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-5 py-2.5 text-sm">
          + Add Vehicle
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/10 dark:border-white/10">
                <th className="p-3">Vehicle</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Views</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id} className="border-b border-black/5 dark:border-white/5">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={primaryImage(v.images)} alt="" className="w-14 h-10 object-cover rounded" />
                      <div>
                        <p className="font-semibold">{v.brandId?.name} {v.modelId?.name} {v.year}</p>
                        {v.isDemo && <span className="text-[10px] font-semibold bg-yellow-400 text-black px-1.5 py-0.5 rounded">DEMO</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{formatPrice(v.price)}</td>
                  <td className="p-3">
                    <select
                      value={v.status}
                      onChange={(e) => handleStatusChange(v._id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 ${statusColors[v.status]}`}
                    >
                      {['Draft', 'Available', 'Reserved', 'Sold'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3">{v.featured ? <Star size={16} fill="#FF5A1F" className="text-accent" /> : '—'}</td>
                  <td className="p-3">{v.views}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link to={`/admin/dashboard/vehicles/${v._id}/edit`} className="font-semibold hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(v._id)} className="font-semibold text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
