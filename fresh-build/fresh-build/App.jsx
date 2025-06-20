import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login from './components/Auth/Login.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './components/Dashboard.jsx';
import ResumeBuilder from './components/resume/ResumeBuilder.jsx';
import CoverLetterBuilder from './components/coverletter/CoverLetterBuilder.jsx';
import LandingPage from './components/landing/LandingPage.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navigation from './components/Navigation.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <ResumeBuilder />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cover-letter"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <CoverLetterBuilder />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;