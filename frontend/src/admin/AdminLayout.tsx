import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Tag, Layers, CalendarCheck, HandCoins, Star, Newspaper, Settings, LogOut, Sun, Moon, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BackToTop from '../components/BackToTop';
import { Logo } from '../components/Logo';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true, icon: LayoutDashboard },
  { to: '/admin/dashboard/vehicles', label: 'Vehicles', icon: Car },
  { to: '/admin/dashboard/brands', label: 'Brands', icon: Tag },
  { to: '/admin/dashboard/models', label: 'Models', icon: Layers },
  { to: '/admin/dashboard/viewing-requests', label: 'Viewing Requests', icon: CalendarCheck },
  { to: '/admin/dashboard/seller-requests', label: 'Seller Requests', icon: HandCoins },
  { to: '/admin/dashboard/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/dashboard/articles', label: 'SKIMP Garage', icon: Newspaper },
  { to: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Logo size={28} />
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                }`
              }
            >
              <Icon size={17} />
              <span>{l.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-black/5 dark:border-white/10">
        <p className="text-xs text-black/50 dark:text-white/50 mb-2 font-mono truncate">{admin?.name} · {admin?.role?.toUpperCase()}</p>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors">
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-ink">
      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-black/5 dark:border-white/10 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 md:hidden z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-ink border-r border-black/5 dark:border-white/10 flex flex-col z-50 overflow-y-auto">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-black/5 dark:border-white/10">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="hidden md:block flex-1" />
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <BackToTop />
    </div>
  );
};

export default AdminLayout;
