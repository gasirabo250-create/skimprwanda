import React, { createContext, useContext, useEffect, useState } from 'react';

interface SavedCarsContextType {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedCarsContext = createContext<SavedCarsContextType | undefined>(undefined);
const STORAGE_KEY = 'skimp-saved-cars';

export const SavedCarsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return (
    <SavedCarsContext.Provider value={{ savedIds, toggleSaved, isSaved }}>
      {children}
    </SavedCarsContext.Provider>
  );
};

export const useSavedCars = () => {
  const ctx = useContext(SavedCarsContext);
  if (!ctx) throw new Error('useSavedCars must be used within SavedCarsProvider');
  return ctx;
};
