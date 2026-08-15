import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Article } from '../../types';

const categories = ['Car Buying', 'Car Care', 'EV/Hybrid', 'Driving Tips'];
const emptyForm = { title: '', category: 'Car Buying', excerpt: '', content: '', author: 'SKIMP Rwanda', readTime: '5', published: false };

const ArticlesAdmin: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => api.get('/articles').then((res) => setArticles(res.data.data));
  useEffect(() => { load(); }, []);

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const startEdit = (a: Article) => {
    setEditingId(a._id);
    setForm({
      title: a.title, category: a.category, excerpt: a.excerpt || '', content: a.content,
      author: a.author, readTime: String(a.readTime), published: a.published,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    const payload = { ...form, readTime: Number(form.readTime) };
    try {
      if (editingId) await api.put(`/articles/${editingId}`, payload);
      else await api.post('/articles', payload);
      resetForm();
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save article.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await api.delete(`/articles/${id}`);
    load();
  };

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SKIMP Garage</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mb-10 border border-black/10 dark:border-white/10 rounded-xl p-5">
        <h2 className="font-semibold">{editingId ? 'Edit Article' : 'New Article'}</h2>
        <input placeholder="Title" value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        <div className="grid sm:grid-cols-2 gap-4">
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Read time (min)" value={form.readTime} onChange={(e) => update('readTime', e.target.value)} className={inputClass} />
        </div>
        <textarea placeholder="Excerpt" rows={2} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} className={inputClass} />
        <textarea placeholder="Content" rows={6} value={form.content} onChange={(e) => update('content', e.target.value)} className={inputClass} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
          <span className="text-sm font-semibold">Published</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-2.5 text-sm">
            {editingId ? 'Save Changes' : 'Create Article'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-black/10 dark:border-white/20 font-semibold px-6 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a._id} className="flex items-center justify-between border border-black/10 dark:border-white/10 rounded-xl p-4">
            <div>
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-black/50 dark:text-white/50">{a.category} · {a.published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => startEdit(a)} className="font-semibold hover:underline">Edit</button>
              <button onClick={() => handleDelete(a._id)} className="font-semibold text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesAdmin;
