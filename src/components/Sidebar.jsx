import React, { useState } from 'react';
import { Home, PlusCircle, FileText, Compass, Bell, HelpCircle, Settings, User, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './Avatar';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold' 
            : 'text-gray-600 hover:bg-gray-50'
        } ${isBottom ? 'mb-2' : ''}`}
      >
        <item.icon size={20} className={`${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`} />
        <span className="flex-1">{item.label}</span>
        {isActive && <ChevronRight size={16} className="text-primary-600" />}
      </Link>
    );
  };

  const NavSection = ({ title, items }) => (
    <div className="mb-6">
      {title && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 p-6">
        {/* Logo */}
        <div className="mb-10 px-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-xl tracking-tight">Campus Pulse</h1>
              <p className="text-xs text-gray-500 font-medium">Student Voice Platform</p>
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
        <div className="mt-auto pt-6 border-t border-gray-100">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.path} item={item} isBottom />
            ))}
          </nav>

          {/* User Profile */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar alt="Student" size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">Student</p>
                <p className="text-sm text-gray-500 truncate">student@campus.edu</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <span className="font-bold text-gray-900">Campus Pulse</span>
          </Link>
          
          <Avatar alt="Student" size="sm" />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-xl">Campus Pulse</h1>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100"
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
          <div className="pt-6 border-t border-gray-100">
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar alt="Student" size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">Student</p>
                  <p className="text-sm text-gray-500 truncate">student@campus.edu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
