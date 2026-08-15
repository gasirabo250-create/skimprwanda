import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '../api/content';
import type { Article } from '../types';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug).then(setArticle).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">Loading...</div>;
  if (!article) return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">Article not found.</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/garage" className="text-sm text-black/50 dark:text-white/50">← Back to SKIMP Garage</Link>
      <span className="block text-xs font-semibold text-black/50 dark:text-white/50 mt-6">{article.category}</span>
      <h1 className="text-3xl font-extrabold mt-2 mb-4">{article.title}</h1>
      <p className="text-sm text-black/50 dark:text-white/50 mb-8">By {article.author} · {article.readTime} min read</p>
      {article.coverImage && <img src={article.coverImage} alt={article.title} className="w-full rounded-2xl mb-8" />}
      <div className="prose dark:prose-invert max-w-none whitespace-pre-line leading-relaxed">
        {article.content}
      </div>
    </article>
  );
};

export default ArticleDetail;
