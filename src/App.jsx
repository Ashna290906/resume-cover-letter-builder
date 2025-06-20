import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/landing/LandingPage';
import Login from '@/components/Auth/Login';
import SignUp from '@/components/Auth/SignUp';
import Dashboard from '@/components/Dashboard';
import ResumeBuilder from '@/components/resume/ResumeBuilder';
import CoverLetterBuilder from '@/components/coverletter/CoverLetterBuilder';
import History from '@/components/History';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
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

  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  try {
    return (
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cover-letter"
                  element={
                    <ProtectedRoute>
                      <CoverLetterBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
          <p className="mt-2 text-gray-600">An error occurred in the App component.</p>
          <p className="mt-2 text-gray-600">Please check the browser console for more details.</p>
        </div>
      </div>
    );
  }
}

export default App;