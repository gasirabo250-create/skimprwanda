import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-24 lg:bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-ink dark:bg-white text-white dark:text-ink shadow-lg flex items-center justify-center hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default BackToTop;
