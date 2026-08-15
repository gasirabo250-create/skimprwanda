import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVehicles } from '../api/vehicles';
import { getBrands } from '../api/brands';
import type { Vehicle, Brand } from '../types';
import VehicleCard from '../components/VehicleCard';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const BrandPage: React.FC = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then((brands) => {
      const found = brands.find((b) => b.slug === slug) || null;
      setBrand(found);
      if (found) {
        getVehicles({ brandId: found._id, limit: 24 })
          .then((res) => setVehicles(res.data))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  if (!loading && !brand) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">Brand not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{brand?.name || 'Loading...'} in Rwanda</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">
        {brand?.description || `Browse all ${brand?.name || ''} vehicles available on SKIMP Rwanda.`}
      </p>
      {loading ? (
        <VehicleGridSkeleton />
      ) : vehicles.length === 0 ? (
        <EmptyState title={`No ${brand?.name} vehicles right now`} message="Check back soon or browse our full inventory." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
        </div>
      )}
    </div>
  );
};

export default BrandPage;
