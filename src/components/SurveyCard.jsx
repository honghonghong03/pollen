import { Clock, MessageSquare, Calendar } from 'lucide-react';
import { creditRewardTier, formatCredits } from '../lib/credits';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function SurveyCard({ survey }) {
  const navigate = useNavigate();
  const { user, authUser, hasCompletedSurvey } = useAuth();
  const outletContext = useOutletContext() || {};
  const showSignupPrompt = outletContext.showSignupPrompt;
  const credits = survey.estimated_minutes;
  const tier = creditRewardTier(credits);
  const progress = (survey.responses_collected / survey.responses_needed) * 100;
  const isFull = survey.responses_collected >= survey.responses_needed;
  const isOwn = user?.id === survey.creator_id;
  const isDone = hasCompletedSurvey(survey.id);

  const tierColors = {
    high: 'bg-stem/15 text-stem border-stem/30',
    mid: 'bg-honey/15 text-honey border-honey/30',
    low: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const isMatch = user && survey.targeting_enabled && (
    (survey.target_age_range && survey.target_age_range === user.age_range) ||
    (survey.target_country && survey.target_country === user.country) ||
    (survey.target_education && survey.target_education === user.education_level)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-soil text-[15px] leading-snug">{survey.title}</h3>
        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierColors[tier]}`}>
          {formatCredits(credits)} cr
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
        <span className="inline-flex items-center gap-1"><Clock size={12} />{survey.estimated_minutes} min</span>
        <span className="inline-flex items-center gap-1"><MessageSquare size={12} />{survey.responses_needed} responses</span>
        <span className="inline-flex items-center gap-1"><Calendar size={12} />{timeAgo(survey.created_at)}</span>
      </div>

      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{survey.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {survey.topics.map((topic) => (
          <span key={topic} className="px-2 py-0.5 rounded-full bg-petal-dark text-soil-light text-xs font-medium">
            {topic}
          </span>
        ))}
        {isMatch && (
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            Profile match
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{survey.responses_collected}/{survey.responses_needed} responses</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-stem rounded-full h-1.5 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (!authUser && showSignupPrompt) return showSignupPrompt();
            isOwn ? navigate(`/survey/${survey.id}/results`) : navigate(`/survey/${survey.id}`);
          }}
          disabled={isFull && !isOwn || isDone}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isDone
              ? 'bg-stem/10 text-stem cursor-not-allowed'
              : isOwn
                ? 'bg-stem/10 text-stem hover:bg-stem/20'
                : isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-honey text-white hover:bg-honey-light'
          }`}
        >
          {isDone ? 'Completed' : isOwn ? 'View results' : isFull ? 'Full' : 'Take survey'}
        </button>
      </div>
    </div>
  );
}
