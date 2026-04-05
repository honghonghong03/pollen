import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCredits } from '../lib/credits';

export default function SurveyViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, user, addCredits, completeSurvey } = useAuth();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const survey = surveys.find((s) => s.id === id);
  if (!survey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Survey not found</p>
        <button onClick={() => navigate('/')} className="text-stem font-medium mt-2">Back to feed</button>
      </div>
    );
  }

  const credits = survey.estimated_minutes;

  const handleStart = () => {
    setStarted(true);
    window.open(survey.survey_url, '_blank');
  };

  const handleComplete = () => {
    setCompleted(true);
    completeSurvey(survey.id);
    addCredits(credits, `Completed: ${survey.title}`, 'survey_completed', survey.id);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-soil">
        <ArrowLeft size={16} /> Back to feed
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-soil mb-2">{survey.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{survey.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Clock size={14} />
            <span>{survey.estimated_minutes} min</span>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-stem/10 text-stem text-sm font-semibold">
            Earn {formatCredits(credits)} credits
          </div>
        </div>

        {completed ? (
          <div className="bg-stem/5 border border-stem/20 rounded-xl p-6 text-center">
            <CheckCircle2 size={48} className="text-stem mx-auto mb-3" />
            <p className="text-lg font-semibold text-stem mb-1">Survey completed!</p>
            <p className="text-sm text-gray-500 mb-4">
              You earned <span className="font-semibold text-stem">{formatCredits(credits)} credits</span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-honey text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-honey-light transition-colors"
            >
              Back to feed
            </button>
          </div>
        ) : !started ? (
          <div className="space-y-3">
            <div className="bg-petal rounded-lg p-4 text-sm text-soil-light">
              Complete the full survey to earn your credits. Partial completions won't be counted.
            </div>
            <button
              onClick={handleStart}
              className="w-full bg-honey text-white font-semibold py-3 rounded-lg hover:bg-honey-light transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Start survey
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-petal rounded-lg p-4 text-sm text-soil-light">
              Finished the survey? Confirm below to earn your credits.
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-stem text-white font-semibold py-3 rounded-lg hover:bg-stem-light transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              I've completed this survey
            </button>
            <button
              onClick={handleStart}
              className="w-full text-gray-400 text-sm hover:text-soil"
            >
              Reopen survey link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
