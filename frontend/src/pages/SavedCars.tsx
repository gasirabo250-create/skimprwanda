import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedCars } from '../context/SavedCarsContext';
import { getVehicleById } from '../api/vehicles';
import type { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';
import EmptyState from '../components/EmptyState';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';

const SavedCars: React.FC = () => {
  const { savedIds } = useSavedCars();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (savedIds.length === 0) {
      setVehicles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(savedIds.map((id) => getVehicleById(id).catch(() => null)))
      .then((res) => setVehicles(res.filter(Boolean) as Vehicle[]))
      .finally(() => setLoading(false));
  }, [savedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Saved Cars</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Vehicles you've favorited, saved on this device.</p>

      {loading ? (
        <VehicleGridSkeleton count={4} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          title="No saved cars yet"
          message="Tap the heart icon on any vehicle to save it here."
          action={
            <Link to="/cars" className="inline-flex rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px]">
              Browse Cars
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
        </div>
      )}
    </div>
  );
};

export default SavedCars;
