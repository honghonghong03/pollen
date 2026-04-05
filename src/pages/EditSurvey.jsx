import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TOPICS } from '../data/mock';
import QuestionBuilder from '../components/QuestionBuilder';

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, user, updateSurvey } = useAuth();

  const survey = surveys.find((s) => s.id === id);
  const isOwner = user?.id === survey?.creator_id;

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form from survey data
  useEffect(() => {
    if (survey && isOwner) {
      setForm({
        title: survey.title || '',
        description: survey.description || '',
        questions: survey.questions || [],
        topics: survey.topics || [],
        responses_needed: survey.responses_needed,
        estimated_minutes: survey.estimated_minutes,
      });
    }
  }, [survey, isOwner]);

  if (!survey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Survey not found</p>
        <button onClick={() => navigate('/')} className="text-stem font-medium mt-2">Back to feed</button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">You can only edit your own surveys</p>
        <button onClick={() => navigate('/')} className="text-stem font-medium mt-2">Back to feed</button>
      </div>
    );
  }

  if (!form) return null;

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const toggleTopic = (topic) => {
    setForm((prev) => {
      const has = prev.topics.includes(topic);
      const topics = has ? prev.topics.filter((t) => t !== topic) : prev.topics.length < 3 ? [...prev.topics, topic] : prev.topics;
      return { ...prev, topics };
    });
    setError(null);
    setSuccess(false);
  };

  const isBuiltin = survey.survey_type === 'builtin';
  const autoEstimatedMinutes = isBuiltin ? Math.max(1, Math.ceil(form.questions.length * 0.5)) : form.estimated_minutes;

  const canSave = form.title.trim() && form.description.trim() && form.topics.length > 0 && (
    !isBuiltin || (form.questions.length > 0 && form.questions.every((q) => q.text.trim()))
  ) && form.responses_needed >= survey.responses_collected;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const updates = {
      title: form.title.trim(),
      description: form.description.trim(),
      topics: form.topics,
      responses_needed: form.responses_needed,
    };

    if (isBuiltin) {
      updates.questions = form.questions;
      updates.estimated_minutes = autoEstimatedMinutes;
    }

    const result = await updateSurvey(survey.id, updates);
    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate(`/survey/${survey.id}/results`), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(`/survey/${id}/results`)} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-soil">
        <ArrowLeft size={16} /> Back to results
      </button>

      <h1 className="text-xl font-bold text-soil">Edit survey</h1>

      <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-soil mb-1">Survey title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g., Consumer Habits Survey 2026"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-soil mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is your survey about?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey resize-none"
          />
        </div>

        {/* Questions (builtin only) */}
        {isBuiltin && (
          <div>
            <label className="block text-sm font-medium text-soil mb-2">Questions</label>
            {survey.responses_collected > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-honey mb-2">
                <AlertCircle size={12} />
                <span>This survey has {survey.responses_collected} responses. Editing questions may affect data consistency.</span>
              </div>
            )}
            <QuestionBuilder
              questions={form.questions}
              onChange={(questions) => update('questions', questions)}
            />
          </div>
        )}

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-soil mb-1">Topics (up to 3)</label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.filter((t) => t !== 'All').map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  form.topics.includes(topic) ? 'bg-stem text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Responses needed */}
        <div>
          <label className="block text-sm font-medium text-soil mb-1">Number of responses needed</label>
          <input
            type="number"
            min={survey.responses_collected || 1}
            max={500}
            value={form.responses_needed}
            onChange={(e) => update('responses_needed', Math.max(survey.responses_collected || 1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
          />
          {survey.responses_collected > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Minimum: {survey.responses_collected} (already collected)
            </p>
          )}
        </div>

        {isBuiltin && form.questions.length > 0 && (
          <div className="bg-petal rounded-lg p-3 text-xs text-gray-500">
            Estimated time: ~{autoEstimatedMinutes} min
          </div>
        )}
      </div>

      {/* Error / Success messages */}
      {error && (
        <div className="flex items-center gap-2 bg-terracotta/10 border border-terracotta/20 rounded-lg p-3">
          <AlertCircle size={14} className="text-terracotta shrink-0" />
          <p className="text-sm text-terracotta">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-stem/10 border border-stem/20 rounded-lg p-3">
          <p className="text-sm text-stem font-medium">Survey updated successfully! Redirecting...</p>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        className="w-full bg-stem text-white font-semibold py-3 rounded-lg hover:bg-stem-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  );
}
