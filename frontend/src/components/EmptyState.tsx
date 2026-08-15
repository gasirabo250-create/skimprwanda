import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, action, icon }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 text-accent mb-5">
      {icon || <SearchX size={28} />}
    </div>
    <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
    {message && <p className="text-black/60 dark:text-white/60 mb-6 max-w-md mx-auto">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
