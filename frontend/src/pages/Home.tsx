import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SearchCheck, CalendarCheck, MessageCircle } from 'lucide-react';
import { getFeaturedVehicles, getRecentVehicles } from '../api/vehicles';
import { getBrands } from '../api/brands';
import type { Vehicle, Brand } from '../types';
import VehicleCard from '../components/VehicleCard';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [recent, setRecent] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getFeaturedVehicles(), getRecentVehicles(), getBrands()])
      .then(([f, r, b]) => {
        setFeatured(f);
        setRecent(r);
        setBrands(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/cars${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-30" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=80"
            alt="Premium automotive showroom"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
          />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <span className="inline-block font-mono text-xs tracking-[0.2em] text-accent mb-4 border border-accent/30 rounded-full px-3 py-1">
            KIGALI, RWANDA
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] max-w-3xl">
            Your next car is <span className="text-accent">closer</span> than you think.
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl">
            Quality vehicles. Clear information. A simpler way to buy.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, model, or keyword..."
                className="w-full rounded-full pl-11 pr-5 py-3 min-h-[44px] text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent text-white font-semibold px-6 py-3 min-h-[44px] hover:bg-accent-dark transition-colors"
            >
              Search Cars
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/find-my-car" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-accent transition-colors">
              <SearchCheck size={15} /> Not sure what you need? Try Find My Car →
            </Link>
          </div>
        </div>
      </section>

      {/* Brands strip */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {brands.map((b) => (
              <Link
                key={b._id}
                to={`/brands/${b.slug}`}
                className="flex-shrink-0 text-sm font-semibold px-5 py-2 rounded-full border border-black/10 dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Vehicles</h2>
          <Link to="/cars" className="text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {loading ? (
          <VehicleGridSkeleton count={4} />
        ) : featured.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">No featured vehicles right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      {/* Recently added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recently Added</h2>
          <Link to="/cars" className="text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {loading ? (
          <VehicleGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recent.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-black/[0.02] dark:bg-white/5 py-16 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Search, title: 'Browse & Filter', desc: 'Search our verified inventory by brand, budget, and body type.' },
            { icon: CalendarCheck, title: 'Book a Viewing', desc: 'Schedule a time to see and test drive the car in person.' },
            { icon: MessageCircle, title: 'Chat on WhatsApp', desc: 'Talk directly to our team for pricing and financing questions.' },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink dark:bg-white/10 text-accent mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-black/60 dark:text-white/60">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sell your car CTA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center overflow-hidden">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Have a car to sell?</h2>
        <p className="text-black/60 dark:text-white/60 mb-6 max-w-xl mx-auto">
          Submit your vehicle details and our team will get back to you with a fair offer.
        </p>
        <Link
          to="/sell-your-car"
          className="inline-flex rounded-full bg-accent text-white font-semibold px-8 py-3 min-h-[44px] hover:bg-accent-dark transition-colors"
        >
          Sell Your Car
        </Link>
      </section>
    </div>
  );
};

export default Home;
