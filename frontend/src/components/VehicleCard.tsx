import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gauge, Fuel, Settings2, MapPin } from 'lucide-react';
import type { Vehicle } from '../types';
import { formatPrice, formatMileage, primaryImage } from '../utils/format';
import { useSavedCars } from '../context/SavedCarsContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onCompareToggle?: (id: string) => void;
  isComparing?: boolean;
}

const statusStyles: Record<string, string> = {
  Available: 'bg-white/95 text-ink',
  Reserved: 'bg-accent text-white',
  Sold: 'bg-black/80 text-white',
  Draft: 'bg-white/95 text-ink',
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onCompareToggle, isComparing }) => {
  const { isSaved, toggleSaved } = useSavedCars();
  const saved = isSaved(vehicle._id);

  return (
    <div className="group rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-ink-light shadow-card dark:shadow-cardDark hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <Link to={`/cars/${vehicle.slug}`}>
          <img
            src={primaryImage(vehicle.images)}
            alt={`${vehicle.brandId?.name} ${vehicle.modelId?.name}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {vehicle.isDemo && (
          <span className="absolute top-3 left-3 text-[10px] font-mono font-semibold tracking-wide bg-accent text-white px-2 py-1 rounded-full">
            DEMO
          </span>
        )}
        <button
          onClick={() => toggleSaved(vehicle._id)}
          aria-label="Save vehicle"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-ink/90 flex items-center justify-center hover:text-accent transition-colors"
        >
          <Heart size={16} fill={saved ? '#FF5A1F' : 'none'} className={saved ? 'text-accent' : ''} />
        </button>
        <span className={`absolute bottom-3 left-3 text-[10px] font-mono font-semibold tracking-wide px-2 py-1 rounded-full ${statusStyles[vehicle.status]}`}>
          {vehicle.status.toUpperCase()}
        </span>
      </div>

      <div className="p-4">
        <Link to={`/cars/${vehicle.slug}`}>
          <h3 className="font-display font-bold text-lg leading-tight mb-1 hover:text-accent transition-colors">
            {vehicle.brandId?.name} {vehicle.modelId?.name} {vehicle.year}
          </h3>
        </Link>
        <p className="data-readout text-xl font-bold mb-3">{formatPrice(vehicle.price)}</p>

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-black/60 dark:text-white/60 mb-4">
          <span className="flex items-center gap-1.5"><Gauge size={13} className="text-accent" />{formatMileage(vehicle.mileage)}</span>
          <span className="flex items-center gap-1.5"><Fuel size={13} className="text-accent" />{vehicle.fuel}</span>
          <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-accent" />{vehicle.transmission}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-accent" />{vehicle.location}</span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/cars/${vehicle.slug}`}
            className="flex-1 text-center text-sm font-semibold rounded-full border border-black/10 dark:border-white/20 py-2 min-h-[44px] flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
          >
            View Details
          </Link>
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(vehicle._id)}
              className={`text-sm font-semibold rounded-full border py-2 px-3 min-h-[44px] transition-colors ${
                isComparing
                  ? 'bg-accent text-white border-accent'
                  : 'border-black/10 dark:border-white/20 hover:border-accent hover:text-accent'
              }`}
            >
              {isComparing ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
