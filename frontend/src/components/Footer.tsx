import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';
import { Logo } from './Logo';

const Footer: React.FC = () => (
  <footer className="mt-24 border-t border-black/5 dark:border-white/10 bg-white dark:bg-ink">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <Logo size={28} />
        <p className="text-sm text-black/60 dark:text-white/60 mt-3">
          Your next car is closer than you think.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Explore</h4>
        <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
          <li><Link to="/cars" className="hover:text-accent transition-colors">Browse Cars</Link></li>
          <li><Link to="/find-my-car" className="hover:text-accent transition-colors">Find My Car</Link></li>
          <li><Link to="/sell-your-car" className="hover:text-accent transition-colors">Sell Your Car</Link></li>
          <li><Link to="/garage" className="hover:text-accent transition-colors">SKIMP Garage</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Company</h4>
        <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
          <li><Link to="/about" className="hover:text-accent transition-colors">About SKIMP</Link></li>
          <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-accent transition-colors">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Get in touch</h4>
        <ul className="space-y-2.5 text-sm text-black/60 dark:text-white/60">
          <li className="flex items-center gap-2"><MessageCircle size={15} className="text-accent" /> +250 793 810 796</li>
          <li className="flex items-center gap-2"><Instagram size={15} className="text-accent" /> @skimp_rwanda</li>
          <li className="flex items-center gap-2"><MapPin size={15} className="text-accent" /> Kigali, Rwanda</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-black/5 dark:border-white/10 py-6 text-center text-xs font-mono text-black/40 dark:text-white/40">
      © {new Date().getFullYear()} SKIMP RWANDA — ALL RIGHTS RESERVED
    </div>
  </footer>
);

export default Footer;
