import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LogoutConfirmation from './components/LogoutConfirmation';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import MyIssues from './pages/MyIssues';
import IssueDetails from './pages/IssueDetails';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { StudentProvider, useStudent } from './context/StudentContext';

function LoadingScreen({ message = 'Checking your session...' }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <p role="status" className="rounded-xl border border-blue-100 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
        {message}
      </p>
    </main>
  );
}

function RequireAuth() {
  const { profile, isAuthLoading, authError, refreshProfile, logout } = useStudent();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);

  const confirmLogout = () => {
    setIsLogoutConfirmationOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  if (isAuthLoading) return <LoadingScreen />;
  if (authError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
        <section className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Unable to verify your session</h1>
          <p role="alert" className="mt-2 text-sm text-gray-600">{authError}</p>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={refreshProfile} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800">
              Try again
            </button>
            <button type="button" onClick={() => setIsLogoutConfirmationOpen(true)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Log out
            </button>
          </div>
        </section>
        <LogoutConfirmation
          isOpen={isLogoutConfirmationOpen}
          onCancel={() => setIsLogoutConfirmationOpen(false)}
          onConfirm={confirmLogout}
        />
      </main>
    );
  }
  if (!profile) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function AuthenticatedLayout() {
  const { authFeedback, clearAuthFeedback } = useStudent();
  useEffect(() => {
    if (!authFeedback) return undefined;
    const timeout = window.setTimeout(clearAuthFeedback, 5000);
    return () => window.clearTimeout(timeout);
  }, [authFeedback, clearAuthFeedback]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {authFeedback && (
        <div role="status" className="fixed right-4 top-20 z-30 flex max-w-sm items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-green-800 shadow-md lg:right-8 lg:top-5">
          <CheckCircle size={18} className="shrink-0 text-green-700" />
          <span className="flex-1">{authFeedback}</span>
          <button type="button" onClick={clearAuthFeedback} aria-label="Dismiss message" className="rounded p-1 text-gray-500 hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>
      )}
      <Outlet />
    </div>
  );
}

function PublicOnly({ children }) {
  const { profile, isAuthLoading } = useStudent();
  const location = useLocation();
  if (isAuthLoading) return <LoadingScreen />;
  if (profile) return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/my-issues" element={<MyIssues />} />
          <Route path="/issues/:id" element={<IssueDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <StudentProvider>
        <AppRoutes />
      </StudentProvider>
    </Router>
  );
}

export default App;
