import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { QUESTION_TYPES } from '../data/mock';

export default function QuestionBuilder({ questions, onChange }) {
  const addQuestion = () => {
    const newQ = {
      id: 'q' + Date.now(),
      type: 'multiple_choice',
      text: '',
      required: true,
      options: ['Option 1', 'Option 2'],
    };
    onChange([...questions, newQ]);
  };

  const updateQuestion = (index, updates) => {
    const updated = questions.map((q, i) => (i === index ? { ...q, ...updates } : q));
    onChange(updated);
  };

  const removeQuestion = (index) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const changeType = (index, newType) => {
    const needsOptions = newType === 'multiple_choice' || newType === 'checkbox';
    const q = questions[index];
    const hasOptions = q.options && q.options.length > 0;
    updateQuestion(index, {
      type: newType,
      options: needsOptions && !hasOptions ? ['Option 1', 'Option 2'] : needsOptions ? q.options : null,
    });
  };

  const addOption = (qIndex) => {
    const q = questions[qIndex];
    const options = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
    updateQuestion(qIndex, { options });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const q = questions[qIndex];
    const options = q.options.map((o, i) => (i === optIndex ? value : o));
    updateQuestion(qIndex, { options });
  };

  const removeOption = (qIndex, optIndex) => {
    const q = questions[qIndex];
    if (q.options.length <= 2) return;
    updateQuestion(qIndex, { options: q.options.filter((_, i) => i !== optIndex) });
  };

  const needsOptions = (type) => type === 'multiple_choice' || type === 'checkbox';

  return (
    <div className="space-y-3">
      {questions.map((q, index) => (
        <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <div className="flex items-start gap-2 mb-3">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5 pt-1">
              <button
                onClick={() => moveQuestion(index, -1)}
                disabled={index === 0}
                className="text-gray-300 hover:text-soil disabled:opacity-30"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveQuestion(index, 1)}
                disabled={index === questions.length - 1}
                className="text-gray-300 hover:text-soil disabled:opacity-30"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              {/* Question number + type */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 shrink-0">Q{index + 1}</span>
                <select
                  value={q.type}
                  onChange={(e) => changeType(index, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-soil"
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <label className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Required
                </label>
              </div>

              {/* Question text */}
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(index, { text: e.target.value })}
                placeholder="Type your question..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
              />

              {/* Options for MC / Checkbox */}
              {needsOptions(q.type) && (
                <div className="space-y-1.5 pl-2">
                  {(q.options || []).map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(index, optIdx, e.target.value)}
                        className="flex-1 px-2 py-1 rounded border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-honey/50"
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(index, optIdx)} className="text-gray-300 hover:text-terracotta">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(index)}
                    className="text-xs text-stem hover:underline flex items-center gap-1 mt-1"
                  >
                    <Plus size={12} /> Add option
                  </button>
                </div>
              )}

              {/* Preview hint for other types */}
              {q.type === 'short_answer' && (
                <div className="px-3 py-2 rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
                  Respondents will type a short text answer
                </div>
              )}
              {q.type === 'rating' && (
                <div className="flex gap-1 px-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="text-gray-300 text-lg">&#9733;</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-1 self-center">1-5 star rating</span>
                </div>
              )}
              {q.type === 'yes_no' && (
                <div className="flex gap-2 px-1">
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-400">Yes</span>
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-400">No</span>
                </div>
              )}
            </div>

            {/* Delete */}
            <button onClick={() => removeQuestion(index)} className="text-gray-300 hover:text-terracotta pt-1">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm font-medium text-gray-400 hover:border-honey hover:text-honey transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add question
      </button>

      {questions.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          {questions.length} question{questions.length !== 1 ? 's' : ''} &middot; ~{Math.max(1, Math.ceil(questions.length * 0.5))} min estimated
        </p>
      )}
    </div>
  );
}
