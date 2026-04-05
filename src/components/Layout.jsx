import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Trophy, Wallet, User } from 'lucide-react';
import CreditPill from './CreditPill';
import { useAuth } from '../context/AuthContext';
import { getLevel } from '../lib/gamification';

const navItems = [
  { to: '/', icon: Home, label: 'Feed' },
  { to: '/create', icon: PlusCircle, label: 'Create' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranks' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const { user, totalEarned } = useAuth();
  const navigate = useNavigate();
  const level = getLevel(totalEarned);

  return (
    <div className="flex flex-col min-h-dvh bg-petal">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" className="shrink-0">
              <circle cx="16" cy="16" r="4" fill="#F2A623"/>
              <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
            </svg>
            <span className="font-bold text-soil text-lg">Pollen</span>
          </button>
          {user && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.bg} ${level.color} border ${level.border}`}>
                {level.emoji} {level.name}
              </span>
              <CreditPill amount={user.credit_balance} />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-honey' : 'text-gray-400 hover:text-soil-light'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
