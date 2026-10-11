import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  ClipboardList,
  FileCheck2,
  Home,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import LogoutConfirmation from './LogoutConfirmation';
import { useStudent } from '../context/StudentContext';

const navItems = [
  { path: '/staff', icon: Home, label: 'Dashboard' },
  { path: '/staff/issues', icon: ClipboardList, label: 'Issue Queue' },
  { path: '/staff/assigned', icon: FileCheck2, label: 'Assigned to Me' },
  { path: '/staff/resolved', icon: ShieldCheck, label: 'Resolved' },
  { path: '/staff/escalations', icon: AlertTriangle, label: 'Escalations & SLA' },
  { path: '/staff/insights', icon: BarChart3, label: 'Campus Insights' },
];

function StaffSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useStudent();
  const portalRole = profile.role === 'admin' ? 'Administrator' : 'Staff / Resolver';

  const handleLogout = () => {
    setIsLogoutOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    if (path === '/staff') return location.pathname === '/staff';
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.path}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm transition-colors ${
        isActive(item.path)
          ? 'border-primary-700 bg-primary-700 font-semibold text-white shadow-sm'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon size={18} className={isActive(item.path) ? 'text-white' : 'text-gray-500'} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white p-5 lg:flex">
        <Link to="/staff" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700 text-base font-semibold text-white">
            CP
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Campus Pulse</h1>
            <p className="text-xs text-gray-500">{portalRole}</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => <NavItem key={item.path} item={item} />)}
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <div className="flex items-center gap-3">
              <Avatar alt={profile.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{profile.name}</p>
                <p className="truncate text-xs text-gray-500">{profile.department || 'General Department'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle staff menu" className="rounded-lg p-2 hover:bg-gray-100">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-semibold text-white">CP</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Campus Pulse</p>
              <p className="text-[10px] text-gray-500">{portalRole}</p>
            </div>
          </div>
          <Avatar alt={profile.name} size="sm" />
        </div>
      </header>

      {isOpen && (
        <nav className="fixed inset-x-0 top-16 bottom-0 z-40 bg-white p-5 lg:hidden">
          <div className="space-y-1">
            {navItems.map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </nav>
      )}

      <LogoutConfirmation isOpen={isLogoutOpen} onCancel={() => setIsLogoutOpen(false)} onConfirm={handleLogout} />
    </>
  );
}

export default StaffSidebar;
