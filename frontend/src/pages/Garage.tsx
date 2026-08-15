import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/content';
import type { Article } from '../types';
import EmptyState from '../components/EmptyState';

const categories = ['All', 'Car Buying', 'Car Care', 'EV/Hybrid', 'Driving Tips'];

const Garage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticles(category === 'All' ? undefined : category)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">SKIMP Garage</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Car buying tips, guides, and Rwanda-specific automotive content.</p>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border min-h-[44px] transition ${
              category === c
                ? 'bg-charcoal text-white border-charcoal dark:bg-white dark:text-charcoal'
                : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-black/60 dark:text-white/60">Loading articles...</p>
      ) : articles.length === 0 ? (
        <EmptyState title="No articles yet" message="Check back soon for new content." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link
              key={a._id}
              to={`/garage/${a.slug}`}
              className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 hover:-translate-y-1 transition-transform"
            >
              {a.coverImage && <img src={a.coverImage} alt={a.title} className="w-full aspect-[16/9] object-cover" />}
              <div className="p-4">
                <span className="text-xs font-semibold text-black/50 dark:text-white/50">{a.category}</span>
                <h3 className="font-bold mt-1 mb-2">{a.title}</h3>
                <p className="text-sm text-black/60 dark:text-white/60 line-clamp-2">{a.excerpt}</p>
                <p className="text-xs text-black/40 dark:text-white/40 mt-3">{a.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Garage;
