import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Review } from '../../types';

const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () => api.get('/reviews').then((res) => setReviews(res.data.data));
  useEffect(() => { load(); }, []);

  const toggleApproved = async (r: Review) => {
    await api.put(`/reviews/${r._id}`, { approved: !r.approved });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <p className="text-sm text-black/50 dark:text-white/50 mb-6">
        Only approved, genuine customer reviews are shown publicly. Never fabricate reviews — approve only real customer submissions.
      </p>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="rounded-xl border border-black/10 dark:border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{r.customerName} {r.vehiclePurchased && `· ${r.vehiclePurchased}`}</p>
                <p className="text-xs text-black/50 dark:text-white/50">{'⭐'.repeat(r.rating)}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => toggleApproved(r)} className="font-semibold hover:underline">
                  {r.approved ? 'Unapprove' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(r._id)} className="font-semibold text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <p className="text-sm text-black/70 dark:text-white/70">{r.review}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-black/50 dark:text-white/50">No reviews submitted yet.</p>}
      </div>
    </div>
  );
};

export default ReviewsAdmin;
