import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* POLES: Tambahkan cursor-pointer dan navigate */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-white text-xl font-bold flex items-center">
            <span className="mr-2">💰</span>
            Mini Wallet
          </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm hidden sm:block">
              <span className="opacity-75">Halo,</span>{' '}
              <span className="font-semibold">{user?.username || user?.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;