import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ThemeProvider from './components/ThemeProvider';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import CalendarPage from './pages/CalendarPage';
import ContentPage from './pages/ContentPage';
import AccountsPage from './pages/AccountsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import useAuthStore from './stores/authStore';
import api from './utils/api';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Step 1: Restore auth state from localStorage first
        let token = null;
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            if (parsed.state?.user && parsed.state?.token) {
              // Restore from localStorage
              if (mounted) {
                useAuthStore.getState().login(parsed.state.user, parsed.state.token);
              }
              token = parsed.state.token;
            }
          } catch (e) {
            console.error('Failed to parse auth data:', e);
            localStorage.removeItem('auth-storage');
          }
        }

        // Step 2: Verify with backend only if we have a token
        if (token) {
          try {
            const res = await api.get('/auth/me');
            
            if (mounted && res.data && res.data.user) {
              // Update with fresh data from server
              const newToken = res.data.token || token;
              useAuthStore.getState().login(res.data.user, newToken);
            } else if (mounted) {
              // Invalid response - logout
              useAuthStore.getState().logout();
              localStorage.removeItem('auth-storage');
            }
          } catch (err) {
            // Backend verification failed - only logout if invalid token
            if (mounted && err.response?.status === 401) {
              useAuthStore.getState().logout();
              localStorage.removeItem('auth-storage');
            }
          }
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading state while auth is being verified
  if (authLoading) {
    return (
      <ThemeProvider>
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;

