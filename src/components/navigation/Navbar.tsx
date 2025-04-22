import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mic, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  userType: 'guest' | 'host';
}

const Navbar: React.FC<NavbarProps> = ({ userType }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="w-8 h-8 text-purple-600" />
          <span className="text-xl font-semibold text-gray-900">PodConnect</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {userType === 'guest' ? (
            <>
              <Link to="/guest" className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</Link>
              <Link to="/guest/requests" className="text-gray-700 hover:text-purple-600 transition-colors">My Requests</Link>
            </>
          ) : (
            <>
              <Link to="/host" className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</Link>
              <Link to="/host/availability" className="text-gray-700 hover:text-purple-600 transition-colors">My Availability</Link>
            </>
          )}
          
          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors">
              <User className="w-5 h-5" />
              <span>{user?.name}</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link 
                to={userType === 'guest' ? '/guest/profile' : '/host/profile'} 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {userType === 'guest' ? (
              <>
                <Link 
                  to="/guest" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/guest/requests" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Requests
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/host" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/host/availability" 
                  className="block text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Availability
                </Link>
              </>
            )}
            
            <Link 
              to={userType === 'guest' ? '/guest/profile' : '/host/profile'} 
              className="block text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
            <button 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;