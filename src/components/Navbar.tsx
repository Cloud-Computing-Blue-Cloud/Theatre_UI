import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, User, Ticket, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <NavLink to="/" active={isActive('/')} icon={<Film className="w-4 h-4" />}>
                  Browse
                </NavLink>
                <NavLink to="/bookings" active={isActive('/bookings')} icon={<Ticket className="w-4 h-4" />}>
                  My Bookings
                </NavLink>
                <NavLink to="/profile" active={isActive('/profile')} icon={<User className="w-4 h-4" />}>
                  {user?.first_name || 'Profile'}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && location.pathname !== '/login' && (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            )}
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
