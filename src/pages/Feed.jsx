import { useState, useMemo } from 'react';
import SurveyCard from '../components/SurveyCard';
import TopicFilter from '../components/TopicFilter';
import { useAuth } from '../context/AuthContext';

const TABS = ['For you', 'New', 'Highest paying', 'Quick'];

export default function Feed() {
  const { surveys, user } = useAuth();
  const [activeTab, setActiveTab] = useState('For you');
  const [activeTopic, setActiveTopic] = useState('All');

  const filteredSurveys = useMemo(() => {
    let list = surveys.filter((s) => s.status === 'active' && s.responses_collected < s.responses_needed);

    // Topic filter
    if (activeTopic !== 'All') {
      list = list.filter((s) => s.topics.includes(activeTopic));
    }

    // Tab sorting
    switch (activeTab) {
      case 'New':
        list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'Highest paying':
        list = [...list].sort((a, b) => b.estimated_minutes - a.estimated_minutes);
        break;
      case 'Quick':
        list = list.filter((s) => s.estimated_minutes <= 3);
        break;
      case 'For you':
      default:
        // Score: interest match + credits + freshness
        list = [...list].sort((a, b) => {
          const scoreA = getForYouScore(a, user);
          const scoreB = getForYouScore(b, user);
          return scoreB - scoreA;
        });
        break;
    }

    return list;
  }, [surveys, activeTab, activeTopic, user]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-honey text-white'
                : 'text-gray-400 hover:text-soil'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Topic filters */}
      <TopicFilter selected={activeTopic} onSelect={setActiveTopic} />

      {/* Survey cards */}
      <div className="space-y-3">
        {filteredSurveys.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium mb-1">No surveys found</p>
            <p className="text-sm">Try a different tab or topic filter</p>
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))
        )}
      </div>
    </div>
  );
}

function getForYouScore(survey, user) {
  let score = 0;
  // Interest match
  if (user?.interests) {
    const matches = survey.topics.filter((t) => user.interests.includes(t)).length;
    score += matches * 10;
  }
  // Profile match bonus
  if (survey.targeting_enabled && user) {
    if (survey.target_age_range === user.age_range) score += 5;
    if (survey.target_country === user.country) score += 5;
    if (survey.target_education === user.education_level) score += 5;
  }
  // Credit reward
  score += survey.estimated_minutes;
  // Freshness (hours old, less = better)
  const hoursOld = (Date.now() - new Date(survey.created_at).getTime()) / 3600000;
  score += Math.max(0, 20 - hoursOld);
  return score;
}
