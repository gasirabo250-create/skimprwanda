import React from 'react';

export const VehicleCardSkeleton: React.FC = () => (
  <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 animate-pulse">
    <div className="aspect-[4/3] bg-black/10 dark:bg-white/10" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
      <div className="h-5 bg-black/10 dark:bg-white/10 rounded w-1/2" />
      <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-full" />
    </div>
  </div>
);

export const VehicleGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <VehicleCardSkeleton key={i} />
    ))}
  </div>
);
