import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Resume & Cover Letter Builder
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="ml-4 flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/resume" className="text-gray-700 hover:text-gray-900">
                  Resume
                </Link>
                <Link to="/cover-letter" className="text-gray-700 hover:text-gray-900">
                  Cover Letter
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-4">
                <Link to="/signup" className="text-gray-700 hover:text-gray-900">
                  Sign Up
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
