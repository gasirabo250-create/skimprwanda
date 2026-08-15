import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/format';

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ message, className = '', children }) => (
  <a
    href={buildWhatsAppLink(message)}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white font-semibold px-5 py-3 min-h-[44px] hover:bg-accent-dark transition-colors ${className}`}
  >
    <MessageCircle size={18} />
    {children || 'Chat on WhatsApp'}
  </a>
);

// Sticky mobile WhatsApp button shown on all pages
export const StickyWhatsApp: React.FC = () => (
  <a
    href={buildWhatsAppLink('Hello SKIMP Rwanda 👋 I have a question about your vehicles.')}
    target="_blank"
    rel="noopener noreferrer"
    className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-glow"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={24} />
  </a>
);
