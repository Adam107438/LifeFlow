import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Droplet, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  user: any; // Firebase user object
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinkClass = (path: string) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      location.pathname === path 
      ? 'bg-brand-50 text-brand-700' 
      : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Droplet className="h-8 w-8 text-brand-600 fill-current" />
              <span className="ml-2 text-xl font-bold text-gray-900">LifeFlow</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 font-medium px-3 py-2">Dashboard</Link>
                <Link to="/profile" className="text-gray-600 hover:text-brand-600 font-medium px-3 py-2">My Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-brand-600 font-medium px-3 py-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass('/dashboard')}>Dashboard</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className={navLinkClass('/profile')}>My Profile</Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)} className={navLinkClass('/auth')}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
