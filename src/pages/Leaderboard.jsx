import { useState } from 'react';
import { Trophy, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getLevel } from '../lib/gamification';

const TABS = [
  { key: 'top_earners', label: 'Top Earners', icon: Trophy },
  { key: 'this_week', label: 'This Week', icon: TrendingUp },
  { key: 'most_helpful', label: 'Most Helpful', icon: Heart },
];

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">{rank}</span>;
}

export default function Leaderboard() {
  const { user, totalEarned, surveysTaken } = useAuth();
  const [activeTab, setActiveTab] = useState('top_earners');

  const entries = getLeaderboard(activeTab, user, totalEarned, surveysTaken);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-honey" />
        <h1 className="text-xl font-bold text-soil">Leaderboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === key ? 'bg-honey text-white' : 'text-gray-400 hover:text-soil'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {entries.map((entry) => {
          const level = getLevel(entry.totalEarned);
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${
                entry.isCurrentUser ? 'bg-honey/5' : ''
              }`}
            >
              <RankBadge rank={entry.rank} />

              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                entry.isCurrentUser ? 'bg-honey' : 'bg-stem'
              }`}>
                {entry.name.charAt(0)}
              </div>

              {/* Name + level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-medium truncate ${entry.isCurrentUser ? 'text-honey' : 'text-soil'}`}>
                    {entry.name}
                    {entry.isCurrentUser && <span className="text-xs text-gray-400 ml-1">(you)</span>}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span>{level.emoji}</span> {level.name}
                </p>
              </div>

              {/* Stat */}
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${entry.isCurrentUser ? 'text-honey' : 'text-soil'}`}>{entry.stat}</p>
                <p className="text-[10px] text-gray-400">{entry.statLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Keep answering surveys to climb the ranks!
      </p>
    </div>
  );
}
