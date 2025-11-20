import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, Ticket } from 'lucide-react';
import { clsx } from 'clsx';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-500 hover:text-indigo-400 transition-colors">
              <Film className="w-6 h-6" />
              <span>MovieTix</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/" active={isActive('/')} icon={<Film className="w-4 h-4" />}>
              Browse
            </NavLink>
            <NavLink to="/bookings" active={isActive('/bookings')} icon={<Ticket className="w-4 h-4" />}>
              My Bookings
            </NavLink>
            <NavLink to="/profile" active={isActive('/profile')} icon={<User className="w-4 h-4" />}>
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children, icon }) => (
  <Link
    to={to}
    className={clsx(
      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      active
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    )}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
