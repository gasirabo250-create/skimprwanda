import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVehicleById } from '../api/vehicles';
import type { Vehicle } from '../types';
import { formatPrice, formatMileage, vehicleWhatsAppMessage } from '../utils/format';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { useSavedCars } from '../context/SavedCarsContext';
import ErrorState from '../components/ErrorState';

const VehicleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSavedCars();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVehicleById(id)
      .then(setVehicle)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">Loading vehicle...</div>;
  if (error || !vehicle) return <ErrorState message="Vehicle not found." onRetry={() => navigate('/cars')} />;

  const images = vehicle.images?.length ? vehicle.images : [];
  const saved = isSaved(vehicle._id);

  const specs = [
    { label: 'Year', value: vehicle.year },
    { label: 'Mileage', value: formatMileage(vehicle.mileage) },
    { label: 'Fuel', value: vehicle.fuel },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Engine', value: vehicle.engine || '—' },
    { label: 'Body Type', value: vehicle.bodyType },
    { label: 'Color', value: vehicle.color || '—' },
    { label: 'Seats', value: vehicle.seats || '—' },
    { label: 'Doors', value: vehicle.doors || '—' },
    { label: 'Drive Type', value: vehicle.driveType || '—' },
    { label: 'Location', value: vehicle.location || '—' },
    { label: 'Condition', value: vehicle.condition || '—' },
  ];

  const waMessage = vehicleWhatsAppMessage(vehicle.brandId?.name, vehicle.modelId?.name, vehicle.year);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-black/50 dark:text-white/50 mb-6">
        <Link to="/cars">Browse Cars</Link> / {vehicle.brandId?.name} {vehicle.modelId?.name}
      </nav>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/5">
            {vehicle.isDemo && (
              <span className="absolute top-3 left-3 z-10 text-xs font-semibold bg-yellow-400 text-black px-2 py-1 rounded-full">DEMO</span>
            )}
            <img
              src={images[activeImg]?.url}
              alt={`${vehicle.brandId?.name} ${vehicle.modelId?.name}`}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setFullscreen(true)}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImg ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div>
          <h1 className="text-3xl font-extrabold mb-1">
            {vehicle.brandId?.name} {vehicle.modelId?.name} {vehicle.year}
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50 mb-4">{vehicle.status} · {vehicle.views} views</p>
          <p className="text-3xl font-extrabold mb-6">{formatPrice(vehicle.price)}</p>

          <div className="flex flex-col gap-3 mb-8">
            <WhatsAppButton message={waMessage}>Enquire on WhatsApp</WhatsAppButton>
            <Link
              to={`/book-viewing?vehicleId=${vehicle._id}`}
              className="text-center rounded-full border border-black/10 dark:border-white/20 font-semibold px-5 py-3 min-h-[44px] hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Book a Viewing
            </Link>
            <button
              onClick={() => toggleSaved(vehicle._id)}
              className="text-center rounded-full border border-black/10 dark:border-white/20 font-semibold px-5 py-3 min-h-[44px] hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <Heart size={16} className="inline mr-1.5 -mt-0.5" fill={saved ? '#FF5A1F' : 'none'} />
              {saved ? 'Saved' : 'Save Vehicle'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-black/5 dark:border-white/10 pt-6">
            {specs.map((s) => (
              <div key={s.label}>
                <p className="text-xs text-black/50 dark:text-white/50">{s.label}</p>
                <p className="font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {vehicle.description && (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-3">Description</h2>
          <p className="text-black/70 dark:text-white/70 leading-relaxed">{vehicle.description}</p>
        </div>
      )}

      {vehicle.features && vehicle.features.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-3">Features</h2>
          <div className="flex flex-wrap gap-2">
            {vehicle.features.map((f) => (
              <span key={f} className="text-sm px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10">{f}</span>
            ))}
          </div>
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <img src={images[activeImg]?.url} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
