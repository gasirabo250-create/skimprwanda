import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoMark } from '../components/Logo';

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-40" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md bg-white dark:bg-ink-light rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 p-3 rounded-2xl bg-ink dark:bg-white/5 shadow-glow">
            <LogoMark size={40} />
          </div>
          <h1 className="font-display text-2xl font-bold">SKIMP Admin</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1 font-mono">DASHBOARD ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent pl-10 pr-3 py-2 min-h-[44px] focus:border-accent outline-none transition-colors"
                placeholder="admin@skimprwanda.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent pl-10 pr-3 py-2 min-h-[44px] focus:border-accent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="text-sm text-accent font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-accent text-white font-semibold px-6 py-3 min-h-[44px] hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
