import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong. Please try again.', onRetry }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent/10 text-accent mb-5">
      <AlertTriangle size={28} />
    </div>
    <p className="text-black/60 dark:text-white/60 mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="rounded-full bg-ink text-white dark:bg-white dark:text-ink font-semibold px-6 py-3 min-h-[44px] hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
