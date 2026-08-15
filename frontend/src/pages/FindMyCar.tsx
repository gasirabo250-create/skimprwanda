import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles } from '../api/vehicles';
import type { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';
import { VehicleGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

type Answers = {
  vehicleType: string;
  passengers: string;
  budget: string;
  fuel: string;
};

const steps = ['Vehicle Type', 'Passengers', 'Budget', 'Fuel Preference', 'Results'];

const FindMyCar: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ vehicleType: '', passengers: '', budget: '', fuel: '' });
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const runSearch = async () => {
    setLoading(true);
    next();
    const budgetRanges: Record<string, { minPrice?: number; maxPrice?: number }> = {
      'Under 15M RWF': { maxPrice: 15_000_000 },
      '15M - 30M RWF': { minPrice: 15_000_000, maxPrice: 30_000_000 },
      '30M - 50M RWF': { minPrice: 30_000_000, maxPrice: 50_000_000 },
      'Over 50M RWF': { minPrice: 50_000_000 },
    };
    try {
      const res = await getVehicles({
        bodyType: answers.vehicleType || undefined,
        fuel: answers.fuel !== 'No preference' ? answers.fuel || undefined : undefined,
        ...budgetRanges[answers.budget],
        limit: 12,
      });
      setResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  const choiceButton = (value: string, key: keyof Answers, label: string) => (
    <button
      key={value}
      onClick={() => {
        setAnswers((a) => ({ ...a, [key]: value }));
        setTimeout(() => (key === 'fuel' ? runSearch() : next()), 150);
      }}
      className={`text-left rounded-xl border p-4 min-h-[44px] font-medium transition ${
        answers[key] === value
          ? 'border-accent bg-black/5 dark:bg-white/10'
          : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Find My Car</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Answer a few quick questions and we'll match you with the right vehicle.</p>

      {step < steps.length - 1 && (
        <div className="flex gap-2 mb-8">
          {steps.slice(0, -1).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-charcoal dark:bg-white' : 'bg-black/10 dark:bg-white/10'}`} />
          ))}
        </div>
      )}

      {step === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">What type of vehicle are you looking for?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Crossover', 'Van'].map((t) => choiceButton(t, 'vehicleType', t))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">How many passengers do you usually carry?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {['1-2 people', '3-4 people', '5+ people', '7+ (family/group)'].map((t) => choiceButton(t, 'passengers', t))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">What's your budget?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Under 15M RWF', '15M - 30M RWF', '30M - 50M RWF', 'Over 50M RWF'].map((t) => choiceButton(t, 'budget', t))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Any fuel preference?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'No preference'].map((t) => choiceButton(t, 'fuel', t))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your matches</h2>
          {loading ? (
            <VehicleGridSkeleton count={4} />
          ) : results.length === 0 ? (
            <EmptyState
              title="No exact matches found"
              message="Try browsing the full inventory instead — you might still find something great."
              action={
                <button onClick={() => navigate('/cars')} className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px]">
                  Browse All Cars
                </button>
              }
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {results.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          )}
          <button onClick={() => setStep(0)} className="mt-8 text-sm font-semibold underline">
            Start over
          </button>
        </div>
      )}

      {step > 0 && step < steps.length - 1 && (
        <button onClick={back} className="mt-8 text-sm font-semibold underline">
          ← Back
        </button>
      )}
    </div>
  );
};

export default FindMyCar;
