import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVehicles } from '../api/vehicles';
import { getBrands, getModels } from '../api/brands';
import type { Vehicle, Brand, ModelItem, VehicleFilters } from '../types';
import VehicleCard from '../components/VehicleCard';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

const bodyTypes = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Crossover'];
const fuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Automatic', 'Manual'];

const BrowseCars: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filters: VehicleFilters = {
    page: Number(searchParams.get('page') || 1),
    search: searchParams.get('search') || undefined,
    brandId: searchParams.get('brandId') || undefined,
    bodyType: searchParams.get('bodyType') || undefined,
    fuel: searchParams.get('fuel') || undefined,
    transmission: searchParams.get('transmission') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
    maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
  };

  useEffect(() => {
    getBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    if (filters.brandId) getModels(filters.brandId).then(setModels).catch(() => {});
    else setModels([]);
  }, [filters.brandId]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getVehicles(filters)
      .then((res) => {
        setVehicles(res.data);
        setTotal(res.pagination.total);
        setPages(res.pagination.pages);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Browse Cars</h1>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="lg:hidden rounded-full border border-black/10 dark:border-white/10 px-4 py-2 min-h-[44px] text-sm font-semibold"
        >
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
          <div>
            <label className="text-sm font-semibold block mb-1">Search</label>
            <input
              defaultValue={filters.search}
              onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', (e.target as HTMLInputElement).value)}
              onBlur={(e) => updateFilter('search', e.target.value)}
              placeholder="Keyword..."
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Brand</label>
            <select
              value={filters.brandId || ''}
              onChange={(e) => updateFilter('brandId', e.target.value)}
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {models.length > 0 && (
            <div>
              <label className="text-sm font-semibold block mb-1">Model</label>
              <select
                value={searchParams.get('modelId') || ''}
                onChange={(e) => updateFilter('modelId', e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
              >
                <option value="">All Models</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold block mb-1">Body Type</label>
            <select
              value={filters.bodyType || ''}
              onChange={(e) => updateFilter('bodyType', e.target.value)}
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
            >
              <option value="">Any</option>
              {bodyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Fuel</label>
            <select
              value={filters.fuel || ''}
              onChange={(e) => updateFilter('fuel', e.target.value)}
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
            >
              <option value="">Any</option>
              {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Transmission</label>
            <select
              value={filters.transmission || ''}
              onChange={(e) => updateFilter('transmission', e.target.value)}
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
            >
              <option value="">Any</option>
              {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold block mb-1">Min Price (RWF)</label>
              <input
                type="number"
                defaultValue={filters.minPrice}
                onBlur={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Max Price (RWF)</label>
              <input
                type="number"
                defaultValue={filters.maxPrice}
                onBlur={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="w-full text-sm font-semibold rounded-full border border-black/10 dark:border-white/10 py-2 min-h-[44px] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Clear Filters
          </button>
        </aside>

        {/* Results */}
        <div>
          <p className="text-sm text-black/60 dark:text-white/60 mb-4">{loading ? 'Searching...' : `${total} vehicles found`}</p>

          {loading ? (
            <VehicleGridSkeleton />
          ) : error ? (
            <ErrorState onRetry={() => setSearchParams(searchParams)} />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="No vehicles match your filters"
              message="Try broadening your search or clearing some filters."
              action={
                <button onClick={clearFilters} className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px]">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter('page', String(i + 1))}
                      className={`w-10 h-10 rounded-full text-sm font-semibold ${
                        (filters.page || 1) === i + 1
                          ? 'bg-accent text-white hover:bg-accent-dark'
                          : 'border border-black/10 dark:border-white/10'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCars;
