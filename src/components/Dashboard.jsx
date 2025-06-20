import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaFileAlt, FaPen, FaHistory, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';

export default function Dashboard() {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Should never reach here due to ProtectedRoute
  }

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!currentUser) {
      window.location.href = '/login';
    }
  }, [currentUser, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-gradient-to-b from-purple-800 to-blue-800 text-white h-full fixed left-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-8">Career Hub</h2>
            <nav className="space-y-2">
              <Link to="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-purple-700 transition-colors">
                <FaHome className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link to="/resume" className="flex items-center p-3 rounded-lg hover:bg-purple-700 transition-colors">
                <FaFileAlt className="w-5 h-5 mr-3" />
                Resume Builder
              </Link>
              <Link to="/cover-letter" className="flex items-center p-3 rounded-lg hover:bg-purple-700 transition-colors">
                <FaPen className="w-5 h-5 mr-3" />
                Cover Letter
              </Link>
            </nav>
          </div>
          <div className="absolute bottom-0 w-full p-6 border-t border-purple-600">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Sign Out
            </motion.button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome Back, {currentUser?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-xl text-white/90">
                Get started with your career documents
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6">
                  <FaFileAlt className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Resume Builder
                </h3>
                <p className="text-white-600 mb-6">
                  Create and customize your professional resume with our AI-powered tools
                </p>
                <Link to="/resume" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                  <motion.span
                    className="mr-2"
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                  Start Building
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-6">
                  <FaPen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Cover Letter
                </h3>
                <p className="text-black-600 mb-6">
                  Generate professional cover letters tailored to your job applications
                </p>
                <Link to="/cover-letter" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                  <motion.span
                    className="mr-2"
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                  Start Writing
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        <FaUser className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {currentUser?.email?.split('@')[0] || 'User'}
                        </h3>
                        <p className="text-gray-600">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="inline-flex items-center px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-2" />
                    Sign Out
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}