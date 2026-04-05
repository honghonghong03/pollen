import { useState } from 'react';
import { CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { formatCredits } from '../lib/credits';

export default function SurveyRenderer({ survey, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  const toggleCheckbox = (questionId, option) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const has = current.includes(option);
      return {
        ...prev,
        [questionId]: has ? current.filter((o) => o !== option) : [...current, option],
      };
    });
    setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleSubmit = () => {
    // Validate required questions
    const newErrors = {};
    let hasError = false;
    for (const q of survey.questions) {
      if (!q.required) continue;
      const answer = answers[q.id];
      if (
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        newErrors[q.id] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      document.getElementById(`q-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitted(true);
    onSubmit(answers);
  };

  if (submitted) {
    return (
      <div className="bg-stem/5 border border-stem/20 rounded-xl p-8 text-center">
        <CheckCircle2 size={48} className="text-stem mx-auto mb-3" />
        <p className="text-lg font-semibold text-stem mb-1">Survey completed!</p>
        <p className="text-sm text-gray-500">
          You earned <span className="font-semibold text-stem">{formatCredits(survey.estimated_minutes)} credits</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{survey.questions.length} questions</span>
        <span>{Object.keys(answers).length}/{survey.questions.length} answered</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-honey rounded-full h-1.5 transition-all"
          style={{ width: `${(Object.keys(answers).length / survey.questions.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      {survey.questions.map((q, index) => (
        <div
          key={q.id}
          id={`q-${q.id}`}
          className={`bg-white rounded-xl p-5 shadow-sm border ${
            errors[q.id] ? 'border-terracotta/50 bg-terracotta/5' : 'border-gray-100'
          }`}
        >
          <div className="flex items-start gap-2 mb-3">
            <span className="text-xs font-bold text-gray-300 mt-0.5">{index + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-soil">
                {q.text}
                {q.required && <span className="text-terracotta ml-1">*</span>}
              </p>
            </div>
          </div>

          {/* Multiple Choice */}
          {q.type === 'multiple_choice' && (
            <div className="space-y-2 ml-5">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswer(q.id, opt)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                    answers[q.id] === opt
                      ? 'border-honey bg-honey/10 text-soil font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className={`inline-block w-4 h-4 rounded-full border-2 mr-2.5 align-middle ${
                    answers[q.id] === opt ? 'border-honey bg-honey' : 'border-gray-300'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Checkboxes */}
          {q.type === 'checkbox' && (
            <div className="space-y-2 ml-5">
              {q.options.map((opt) => {
                const checked = (answers[q.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleCheckbox(q.id, opt)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      checked
                        ? 'border-honey bg-honey/10 text-soil font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 rounded mr-2.5 align-middle border-2 ${
                      checked ? 'border-honey bg-honey' : 'border-gray-300'
                    }`} />
                    {opt}
                  </button>
                );
              })}
              <p className="text-xs text-gray-400">Select all that apply</p>
            </div>
          )}

          {/* Short Answer */}
          {q.type === 'short_answer' && (
            <div className="ml-5">
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Type your answer..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey resize-none"
              />
            </div>
          )}

          {/* Rating */}
          {q.type === 'rating' && (
            <div className="ml-5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setAnswer(q.id, n)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      answers[q.id] >= n
                        ? 'fill-honey text-honey'
                        : 'text-gray-200'
                    }
                  />
                </button>
              ))}
              {answers[q.id] && (
                <span className="text-xs text-gray-400 ml-2">{answers[q.id]}/5</span>
              )}
            </div>
          )}

          {/* Yes/No */}
          {q.type === 'yes_no' && (
            <div className="ml-5 flex gap-3">
              {['Yes', 'No'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswer(q.id, opt)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    answers[q.id] === opt
                      ? opt === 'Yes'
                        ? 'border-stem bg-stem/10 text-stem'
                        : 'border-terracotta bg-terracotta/10 text-terracotta'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {errors[q.id] && (
            <p className="flex items-center gap-1 text-xs text-terracotta mt-2 ml-5">
              <AlertCircle size={12} /> This question is required
            </p>
          )}
        </div>
      ))}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-stem text-white font-semibold py-3 rounded-lg hover:bg-stem-light transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle2 size={16} />
        Submit survey &middot; Earn {formatCredits(survey.estimated_minutes)} credits
      </button>
    </div>
  );
}
