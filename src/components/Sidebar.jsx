import React, { useState } from 'react';
import { Home, PlusCircle, FileText, Compass, Bell, HelpCircle, Settings, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import LogoutConfirmation from './LogoutConfirmation';
import { useStudent } from '../context/StudentContext';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useStudent();
  const studentName = profile.name;

  const handleLogout = () => {
    setIsLogoutConfirmationOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/report', icon: PlusCircle, label: 'Raise an Issue' },
    { path: '/my-issues', icon: FileText, label: 'My Issues' },
    { path: '/explore', icon: Compass, label: 'Explore' },
  ];

  const activityNavItems = [
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const supportNavItems = [
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const bottomNavItems = [
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavItem = ({ item, isBottom = false }) => {
    const isActive = location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path)) ||
      (item.path === '/my-issues' && location.pathname.startsWith('/issues/'));
    
    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-lg border-l-2 px-[10px] py-2.5 text-sm transition-colors group ${
          isActive 
            ? 'border-primary-700 bg-primary-700 text-white font-semibold shadow-sm'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } ${isBottom ? 'mb-2' : ''}`}
      >
        <item.icon size={18} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-700'} transition-colors`} />
        <span className="flex-1">{item.label}</span>
      </Link>
    );
  };

  const NavSection = ({ title, items }) => (
    <div className="mb-5">
      {title && (
        <h3 className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 p-5">
        {/* Logo */}
        <div className="mb-8 px-1">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center">
              <span className="text-white font-semibold text-base">CP</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-base tracking-tight">Campus Pulse</h1>
              <p className="text-xs text-gray-500">Student Voice Platform</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <NavSection items={mainNavItems} />

        {/* Activity Section */}
        <NavSection title="Activity" items={activityNavItems} />

        {/* Support Section */}
        <NavSection title="Support" items={supportNavItems} />

        {/* Bottom Navigation */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.path} item={item} isBottom />
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setIsLogoutConfirmationOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Log out
          </button>

          {/* User Profile */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <Avatar alt={studentName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{studentName}</p>
                <p className="text-sm text-gray-500 truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">CP</span>
            </div>
            <span className="font-bold text-gray-900">Campus Pulse</span>
          </Link>
          
          <Avatar alt={studentName} size="sm" />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-200 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center">
                <span className="text-white font-semibold text-base">CP</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-base">Campus Pulse</h1>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            <NavSection items={mainNavItems} />
            <NavSection title="Activity" items={activityNavItems} />
            <NavSection title="Support" items={supportNavItems} />
            <div className="pt-6 border-t border-gray-100">
              <NavSection items={bottomNavItems} />
            </div>
          </nav>

          {/* Mobile User Profile */}
          <div className="pt-5 border-t border-gray-200">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <Avatar alt={studentName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{studentName}</p>
                  <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoutConfirmationOpen(true)}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoutConfirmation
        isOpen={isLogoutConfirmationOpen}
        onCancel={() => setIsLogoutConfirmationOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;
