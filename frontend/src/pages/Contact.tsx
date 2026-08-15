import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { submitContact } from '../api/leads';
import { WhatsAppButton } from '../components/WhatsAppButton';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or reach us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 min-h-[44px]';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Have a question? Reach out on WhatsApp for the fastest response, or send a message below.</p>

      <div className="mb-10">
        <WhatsAppButton message="Hello SKIMP Rwanda 👋 I have a question.">Chat on WhatsApp</WhatsAppButton>
      </div>

      {submitted ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent/10 text-accent mb-4"><CheckCircle2 size={32} /></div>
          <h2 className="text-xl font-bold">Message Sent</h2>
          <p className="text-black/60 dark:text-white/60">We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold block mb-1">Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Message *</label>
            <textarea required rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} className={inputClass} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent text-white hover:bg-accent-dark font-semibold px-6 py-3 min-h-[44px] transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}

      <div className="mt-12 text-sm text-black/60 dark:text-white/60 space-y-1">
        <p><strong>Phone / WhatsApp:</strong> +250 793 810 796</p>
        <p><strong>Instagram:</strong> @skimp_rwanda</p>
        <p><strong>Location:</strong> Kigali, Rwanda</p>
      </div>
    </div>
  );
};

export default Contact;
