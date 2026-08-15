import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatPrice, formatMileage } from '../../utils/format';

interface SellerRequestRow {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  brandName?: string;
  modelName?: string;
  year: number;
  mileage: number;
  expectedPrice: number;
  status: string;
}

const statuses = ['New', 'Reviewing', 'Offer Made', 'Accepted', 'Rejected'];

const SellerRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<SellerRequestRow[]>([]);

  const load = () => api.get('/seller-requests').then((res) => setRequests(res.data.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/seller-requests/${id}`, { status });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 dark:border-white/10">
              <th className="p-3">Seller</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Expected Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-b border-black/5 dark:border-white/5">
                <td className="p-3">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-black/50 dark:text-white/50">{r.phone} {r.email && `· ${r.email}`}</p>
                </td>
                <td className="p-3">{r.year} · {formatMileage(r.mileage)}</td>
                <td className="p-3">{formatPrice(r.expectedPrice)}</td>
                <td className="p-3">
                  <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="text-xs font-semibold rounded-full px-2 py-1 border border-black/10 dark:border-white/10 bg-transparent">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <p className="text-black/50 dark:text-white/50 py-6">No seller submissions yet.</p>}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {requests.map((r) => (
          <div key={r._id} className="rounded-lg border border-black/10 dark:border-white/10 p-4">
            <div className="mb-3">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">{r.phone} {r.email && `· ${r.email}`}</p>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-black/60 dark:text-white/60">Vehicle:</span> <span className="font-semibold">{r.year} · {formatMileage(r.mileage)}</span></p>
              <p><span className="text-black/60 dark:text-white/60">Expected Price:</span> <span className="font-semibold">{formatPrice(r.expectedPrice)}</span></p>
            </div>
            <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="w-full text-xs font-semibold rounded-lg px-3 py-2 border border-black/10 dark:border-white/10 bg-transparent">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {requests.length === 0 && <p className="text-black/50 dark:text-white/50 py-6">No seller submissions yet.</p>}
      </div>
    </div>
  );
};

export default SellerRequestsAdmin;
