import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search, TrendingUp, User, LogOut, Menu, X, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/bookshelf', label: 'My Books', icon: BookOpen },
    { path: '/explore', label: 'Explore', icon: TrendingUp },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/history', label: 'History', icon: History },
  ];
  const navItemsPublic = [
    { path: '/explore', label: 'Explore', icon: TrendingUp },
  ];

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">BookBurst</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
            {navItemsPublic.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/bookshelf" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">BookBurst</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={`/profile/${user?.username}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{user?.displayName}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-amber-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === path
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              <Link
                to={`/profile/${user?.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;