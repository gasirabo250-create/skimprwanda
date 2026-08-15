import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVehicles } from '../api/vehicles';
import { getBrands, getModels } from '../api/brands';
import type { Vehicle, Brand, ModelItem } from '../types';
import VehicleCard from '../components/VehicleCard';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

// Route: /cars/:brandSlug/:modelSlug (SEO-friendly model listing page)
const ModelPage: React.FC = () => {
  const { brandSlug, modelSlug } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<ModelItem | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then(async (brands) => {
      const foundBrand = brands.find((b) => b.slug === brandSlug) || null;
      setBrand(foundBrand);
      if (!foundBrand) return setLoading(false);

      const models = await getModels(foundBrand._id);
      const foundModel = models.find((m) => m.slug === modelSlug) || null;
      setModel(foundModel);
      if (!foundModel) return setLoading(false);

      const res = await getVehicles({ brandId: foundBrand._id, modelId: foundModel._id, limit: 24 });
      setVehicles(res.data);
      setLoading(false);
    });
  }, [brandSlug, modelSlug]);

  if (!loading && (!brand || !model)) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">Model not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{brand?.name} {model?.name} for Sale in Rwanda</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">
        Browse all {brand?.name} {model?.name} listings available on SKIMP Rwanda.
      </p>
      {loading ? (
        <VehicleGridSkeleton />
      ) : vehicles.length === 0 ? (
        <EmptyState title="No listings right now" message="Check back soon or browse our full inventory." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
        </div>
      )}
    </div>
  );
};

export default ModelPage;
