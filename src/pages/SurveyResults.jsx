import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, Clock, MessageSquare, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCredits } from '../lib/credits';

function BarChart({ data, color = 'bg-honey' }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      {data.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-28 shrink-0 truncate text-right">{label}</span>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className={`${color} h-5 rounded-full transition-all flex items-center justify-end pr-2`}
                style={{ width: `${Math.max((count / max) * 100, count > 0 ? 8 : 0)}%` }}
              >
                {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
              </div>
            </div>
            <span className="text-xs text-gray-400 w-8">{Math.round((count / data.reduce((s, d) => s + d.count, 0)) * 100) || 0}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RatingChart({ responses, questionId }) {
  const counts = [0, 0, 0, 0, 0];
  let sum = 0;
  let total = 0;
  responses.forEach((r) => {
    const val = r.answers[questionId];
    if (val >= 1 && val <= 5) {
      counts[val - 1]++;
      sum += val;
      total++;
    }
  });
  const avg = total > 0 ? (sum / total).toFixed(1) : '0';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-honey">{avg}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`text-lg ${n <= Math.round(avg) ? 'text-honey' : 'text-gray-200'}`}>&#9733;</span>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-1">({total} responses)</span>
      </div>
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-4">{star}</span>
            <span className="text-xs text-gray-300">&#9733;</span>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-honey h-3 rounded-full"
                style={{ width: `${total > 0 ? (counts[star - 1] / total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-6">{counts[star - 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextResponses({ responses, questionId }) {
  const answers = responses.map((r) => r.answers[questionId]).filter((a) => a && a.trim());
  if (answers.length === 0) return <p className="text-sm text-gray-400 italic">No responses yet</p>;
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {answers.map((answer, i) => (
        <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-soil">
          "{answer}"
        </div>
      ))}
    </div>
  );
}

function YesNoChart({ responses, questionId }) {
  let yes = 0, no = 0;
  responses.forEach((r) => {
    if (r.answers[questionId] === 'Yes') yes++;
    if (r.answers[questionId] === 'No') no++;
  });
  const total = yes + no;
  const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
  const noPct = total > 0 ? Math.round((no / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex rounded-full overflow-hidden h-8">
          {yesPct > 0 && (
            <div className="bg-stem flex items-center justify-center text-white text-xs font-bold" style={{ width: `${yesPct}%` }}>
              {yesPct}%
            </div>
          )}
          {noPct > 0 && (
            <div className="bg-terracotta flex items-center justify-center text-white text-xs font-bold" style={{ width: `${noPct}%` }}>
              {noPct}%
            </div>
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-stem font-medium">Yes ({yes})</span>
          <span className="text-xs text-terracotta font-medium">No ({no})</span>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({ survey, onConfirm, onCancel, deleting }) {
  const creditsUsed = survey.responses_collected * survey.credit_cost_per_response;
  const refundAmount = Math.max(0, survey.total_credits_spent - creditsUsed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-terracotta" />
          </div>
          <div>
            <h3 className="text-base font-bold text-soil">Delete survey?</h3>
            <p className="text-xs text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold">"{survey.title}"</span>?
          All {survey.responses_collected} collected responses will be lost.
        </p>
        {refundAmount > 0 && (
          <div className="bg-stem/10 border border-stem/20 rounded-lg p-3">
            <p className="text-sm text-stem font-medium">
              {formatCredits(refundAmount)} credits will be refunded to your balance.
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg bg-terracotta text-white text-sm font-semibold hover:bg-terracotta/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SurveyResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, user, getSurveyResponses, deleteSurvey } = useAuth();

  const survey = surveys.find((s) => s.id === id);
  if (!survey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Survey not found</p>
        <button onClick={() => navigate('/')} className="text-stem font-medium mt-2">Back to feed</button>
      </div>
    );
  }

  const isOwner = user?.id === survey.creator_id;
  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">You can only view results for your own surveys</p>
        <button onClick={() => navigate('/')} className="text-stem font-medium mt-2">Back to feed</button>
      </div>
    );
  }

  const [responses, setResponses] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSurveyResponses(survey.id).then((data) => setResponses(data || []));
  }, [survey.id, getSurveyResponses]);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteSurvey(survey.id);
    setDeleting(false);
    if (!result.error) {
      navigate('/feed');
    }
  };

  const progress = (survey.responses_collected / survey.responses_needed) * 100;
  const isBuiltin = survey.survey_type === 'builtin';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-soil">
          <ArrowLeft size={16} /> Back to feed
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/survey/${survey.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-soil hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-terracotta/30 text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteConfirmDialog
          survey={survey}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          deleting={deleting}
        />
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h1 className="text-lg font-bold text-soil mb-1">{survey.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{survey.description}</p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { icon: Users, label: 'Responses', value: `${survey.responses_collected}/${survey.responses_needed}`, color: 'text-stem' },
            { icon: BarChart3, label: 'Progress', value: `${Math.round(progress)}%`, color: 'text-honey' },
            { icon: Clock, label: 'Est. time', value: `${survey.estimated_minutes}m`, color: 'text-gray-500' },
            { icon: MessageSquare, label: 'Credits spent', value: formatCredits(survey.total_credits_spent), color: 'text-terracotta' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-petal rounded-lg p-2 text-center">
              <Icon size={14} className={`mx-auto mb-0.5 ${color}`} />
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
          <div className="bg-stem rounded-full h-2 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {survey.responses_needed - survey.responses_collected > 0
            ? `${survey.responses_needed - survey.responses_collected} more responses needed`
            : 'Target reached!'
          }
        </p>
      </div>

      {/* Question-by-question breakdown */}
      {isBuiltin && survey.questions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-soil flex items-center gap-2">
            <BarChart3 size={16} className="text-honey" />
            Response breakdown
          </h2>

          {survey.questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xs font-bold text-gray-300 mt-0.5">{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-soil">{q.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {responses.filter((r) => r.answers[q.id] !== undefined && r.answers[q.id] !== '' && (!Array.isArray(r.answers[q.id]) || r.answers[q.id].length > 0)).length} responses
                    &middot; {q.type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Multiple choice / Checkbox */}
              {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                <BarChart
                  color={q.type === 'checkbox' ? 'bg-stem' : 'bg-honey'}
                  data={q.options.map((opt) => ({
                    label: opt,
                    count: responses.filter((r) => {
                      const a = r.answers[q.id];
                      return Array.isArray(a) ? a.includes(opt) : a === opt;
                    }).length,
                  }))}
                />
              )}

              {/* Rating */}
              {q.type === 'rating' && (
                <RatingChart responses={responses} questionId={q.id} />
              )}

              {/* Yes/No */}
              {q.type === 'yes_no' && (
                <YesNoChart responses={responses} questionId={q.id} />
              )}

              {/* Short answer */}
              {q.type === 'short_answer' && (
                <TextResponses responses={responses} questionId={q.id} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <BarChart3 size={32} className="text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {isBuiltin
              ? 'No responses yet. Results will appear as people complete your survey.'
              : 'Detailed analytics are available for built-in surveys. External survey responses are tracked by the external platform.'}
          </p>
        </div>
      )}
    </div>
  );
}
