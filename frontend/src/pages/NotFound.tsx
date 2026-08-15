import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
    <h1 className="text-6xl font-extrabold mb-4">404</h1>
    <p className="text-black/60 dark:text-white/60 mb-8">Page not found.</p>
    <Link to="/" className="inline-flex rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px]">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
