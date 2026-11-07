import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Video,
  Lightbulb,
  Users,
  BookOpen,
  Coins,
  Share2,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { user, plan, trialDaysLeft, signOut } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: TrendingUp },
    { label: 'My Videos', path: '/videos', icon: Video },
    { label: 'Concepts', path: '/concepts', icon: Lightbulb },
    { label: 'Following', path: '/following', icon: Users },
    { label: 'Format Library', path: '/formats', icon: BookOpen },
    { label: 'Coins', path: '/coins', icon: Coins },
  ];

  const bottomItems = [
    { label: 'Affiliate', path: '/affiliate', icon: Share2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const planLabel = (() => {
    if (plan?.plan === 'trial') {
      return `Trial · ${trialDaysLeft}d left`;
    }
    if (plan?.plan) {
      return plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1);
    }
    return 'No plan';
  })();

  return (
    <div className="min-h-screen bg-[#f6f5f4] flex flex-col md:flex-row text-[#000000]">
      {/* 5.0 Left Sidebar — brought down and equally spaced with dedicated icons */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-black/8 flex md:flex-col shrink-0 select-none">
        {/* Wordmark at top */}
        <div className="p-5 md:p-6 border-b border-black/8 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-black flex items-center gap-0.5">
            <span>{APP_NAME}</span>
            <span className="text-[#0075de]">◆</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#757575] bg-[#f6f5f4] px-2 py-0.5 rounded border border-black/5">
            studio
          </span>
        </div>

        {/* Primary nav — brought down from the header and spaced equally with clear icons */}
        <div className="flex-1 px-4 py-6 md:py-8 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-visible">
          <div className="space-y-2.5 w-full">
            <div className="hidden md:block text-[11px] font-semibold uppercase tracking-wider text-[#757575] px-3 mb-3">
              Viral Discovery
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#e6f3fe] text-[#0075de] font-semibold shadow-2xs'
                      : 'text-[#615d59] hover:text-black hover:bg-[#f6f5f4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0075de]' : 'text-[#757575]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom items — spaced equally */}
          <div className="hidden md:block pt-6 border-t border-black/8 space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] px-3 mb-3">
              Account & Growth
            </div>
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#e6f3fe] text-[#0075de] font-semibold shadow-2xs'
                      : 'text-[#615d59] hover:text-black hover:bg-[#f6f5f4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0075de]' : 'text-[#757575]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Profile snippet & logout */}
            <div className="pt-4 mt-2 border-t border-black/8 px-3.5">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-black truncate">
                    {user || 'creator@copycat.app'}
                  </div>
                  <div className="text-[11px] text-[#0075de] font-medium mt-0.5">
                    {planLabel}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Log out"
                  className="p-1.5 text-[#757575] hover:text-[#f64932] hover:bg-[#f64932]/10 rounded-lg transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
