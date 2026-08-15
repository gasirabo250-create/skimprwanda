import React, { useEffect, useState } from 'react';
import { Car, CheckCircle2, Clock, Ban, CalendarCheck, HandCoins } from 'lucide-react';
import api from '../../api/axios';

interface Stats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  viewingRequests: number;
  sellerRequests: number;
}

const Overview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [all, available, reserved, sold, viewings, sellers] = await Promise.all([
        api.get('/vehicles', { params: { limit: 1 } }),
        api.get('/vehicles', { params: { limit: 1, status: 'Available' } }),
        api.get('/vehicles', { params: { limit: 1, status: 'Reserved' } }),
        api.get('/vehicles', { params: { limit: 1, status: 'Sold' } }),
        api.get('/viewing-requests'),
        api.get('/seller-requests'),
      ]);
      setStats({
        total: all.data.pagination.total,
        available: available.data.pagination.total,
        reserved: reserved.data.pagination.total,
        sold: sold.data.pagination.total,
        viewingRequests: viewings.data.data.length,
        sellerRequests: sellers.data.data.length,
      });
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Cars', value: stats.total, icon: Car },
        { label: 'Available', value: stats.available, icon: CheckCircle2 },
        { label: 'Reserved', value: stats.reserved, icon: Clock },
        { label: 'Sold', value: stats.sold, icon: Ban },
        { label: 'Viewing Requests', value: stats.viewingRequests, icon: CalendarCheck },
        { label: 'Seller Requests', value: stats.sellerRequests, icon: HandCoins },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Overview</h1>
      {loading ? (
        <p className="font-mono text-sm text-black/50 dark:text-white/50">LOADING STATS...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-2xl border border-black/5 dark:border-white/10 p-6 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-black/50 dark:text-white/50">{c.label}</p>
                  <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent/10 text-accent flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                </div>
                <p className="data-readout text-3xl font-bold">{c.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Overview;
