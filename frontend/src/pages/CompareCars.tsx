import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getVehicles, getVehicleById } from '../api/vehicles';
import type { Vehicle } from '../types';
import { formatPrice, formatMileage } from '../utils/format';
import EmptyState from '../components/EmptyState';

const CompareCars: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles({ limit: 50 }).then((res) => setAllVehicles(res.data));
  }, []);

  useEffect(() => {
    if (ids.length === 0) {
      setVehicles([]);
      return;
    }
    Promise.all(ids.map((id) => getVehicleById(id))).then(setVehicles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  const addVehicle = (id: string) => {
    if (ids.includes(id) || ids.length >= 3) return;
    setSearchParams({ ids: [...ids, id].join(',') });
  };

  const removeVehicle = (id: string) => {
    setSearchParams({ ids: ids.filter((i) => i !== id).join(',') });
  };

  const rows: { label: string; get: (v: Vehicle) => React.ReactNode }[] = [
    { label: 'Price', get: (v) => formatPrice(v.price) },
    { label: 'Year', get: (v) => v.year },
    { label: 'Mileage', get: (v) => formatMileage(v.mileage) },
    { label: 'Fuel', get: (v) => v.fuel },
    { label: 'Transmission', get: (v) => v.transmission },
    { label: 'Engine', get: (v) => v.engine || '—' },
    { label: 'Body Type', get: (v) => v.bodyType },
    { label: 'Seats', get: (v) => v.seats || '—' },
    { label: 'Drive Type', get: (v) => v.driveType || '—' },
    { label: 'Location', get: (v) => v.location || '—' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Compare Cars</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Compare up to 3 vehicles side-by-side.</p>

      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles selected"
          message="Pick up to 3 vehicles below to compare specs and pricing."
        />
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-3"></th>
                {vehicles.map((v) => (
                  <th key={v._id} className="p-3 text-left align-top">
                    <img src={v.images?.[0]?.url} alt="" className="w-full aspect-[4/3] object-cover rounded-lg mb-2" />
                    <div className="font-bold">{v.brandId?.name} {v.modelId?.name} {v.year}</div>
                    <button onClick={() => removeVehicle(v._id)} className="text-xs text-red-500 mt-1">Remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-black/5 dark:border-white/10">
                  <td className="p-3 font-semibold text-sm text-black/60 dark:text-white/60">{row.label}</td>
                  {vehicles.map((v) => (
                    <td key={v._id} className="p-3 text-sm">{row.get(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Add a vehicle to compare</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allVehicles
          .filter((v) => !ids.includes(v._id))
          .slice(0, 9)
          .map((v) => (
            <div key={v._id} className="border border-black/10 dark:border-white/10 rounded-xl p-3 flex gap-3 items-center">
              <img src={v.images?.[0]?.url} alt="" className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{v.brandId?.name} {v.modelId?.name}</p>
                <p className="text-xs text-black/60 dark:text-white/60">{formatPrice(v.price)}</p>
              </div>
              <button
                onClick={() => addVehicle(v._id)}
                disabled={ids.length >= 3}
                className="text-xs font-semibold rounded-full border border-black/10 dark:border-white/20 px-3 py-2 min-h-[36px] disabled:opacity-40"
              >
                Add
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CompareCars;
