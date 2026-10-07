import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import MyIssues from './pages/MyIssues';
import IssueDetails from './pages/IssueDetails';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import { StudentProvider } from './context/StudentContext';

function App() {
  return (
    <Router>
      <StudentProvider>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
            <Route path="/my-issues" element={<MyIssues />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </StudentProvider>
    </Router>
  );
}

export default App;
