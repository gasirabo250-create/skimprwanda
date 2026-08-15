import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface ViewingRequestRow {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleId: any;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

const statuses = ['New', 'Confirmed', 'Completed', 'Cancelled'];

const ViewingRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<ViewingRequestRow[]>([]);

  const load = () => api.get('/viewing-requests').then((res) => setRequests(res.data.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/viewing-requests/${id}`, { status });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Viewing Requests</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 dark:border-white/10">
              <th className="p-3">Customer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Date / Time</th>
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
                <td className="p-3">
                  {r.vehicleId?.brandId?.name} {r.vehicleId?.modelId?.name} {r.vehicleId?.year}
                </td>
                <td className="p-3">{new Date(r.preferredDate).toLocaleDateString()} {r.preferredTime}</td>
                <td className="p-3">
                  <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="text-xs font-semibold rounded-full px-2 py-1 border border-black/10 dark:border-white/10 bg-transparent">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <p className="text-black/50 dark:text-white/50 py-6">No viewing requests yet.</p>}
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
              <p><span className="text-black/60 dark:text-white/60">Vehicle:</span> <span className="font-semibold">{r.vehicleId?.brandId?.name} {r.vehicleId?.modelId?.name} {r.vehicleId?.year}</span></p>
              <p><span className="text-black/60 dark:text-white/60">Date/Time:</span> <span className="font-semibold">{new Date(r.preferredDate).toLocaleDateString()} {r.preferredTime}</span></p>
            </div>
            <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="w-full text-xs font-semibold rounded-lg px-3 py-2 border border-black/10 dark:border-white/10 bg-transparent">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {requests.length === 0 && <p className="text-black/50 dark:text-white/50 py-6">No viewing requests yet.</p>}
      </div>
    </div>
  );
};

export default ViewingRequestsAdmin;
