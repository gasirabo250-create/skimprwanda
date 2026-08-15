import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';

const navLinks = [
  { to: '/cars', label: 'Browse Cars' },
  { to: '/find-my-car', label: 'Find My Car' },
  { to: '/compare', label: 'Compare' },
  { to: '/sell-your-car', label: 'Sell Your Car' },
  { to: '/garage', label: 'SKIMP Garage' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink/90 backdrop-blur border-b border-black/5 dark:border-white/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link to="/" aria-label="SKIMP Rwanda home">
          <Logo size={30} />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors hover:text-black dark:hover:text-white py-1 ${
                  isActive ? 'text-black dark:text-white' : 'text-black/55 dark:text-white/55'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/saved-cars"
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
            aria-label="Saved cars"
          >
            <Heart size={18} />
          </Link>
          <button
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-black/10 dark:border-white/10"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-black/5 dark:border-white/10 px-4 py-4 flex flex-col gap-1 bg-white dark:bg-ink">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-base font-medium py-3 px-2 rounded-lg ${isActive ? 'bg-accent-50 dark:bg-white/5 text-accent' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/saved-cars" onClick={() => setOpen(false)} className="text-base font-medium py-3 px-2 flex items-center gap-2">
            <Heart size={16} /> Saved Cars
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
