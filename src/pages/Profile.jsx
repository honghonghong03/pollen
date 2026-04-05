import { useState } from 'react';
import { Shield, BarChart3, CheckCircle, Edit3, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCredits } from '../lib/credits';

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'];
const GENDERS = ['male', 'female', 'non-binary', 'prefer not to say'];
const EDUCATION_LEVELS = ['high_school', 'undergraduate', 'masters', 'phd'];
const INTEREST_OPTIONS = ['Business', 'Education', 'Psychology', 'Health', 'Technology', 'Social Science'];

export default function Profile() {
  const { user, updateProfile, surveysTaken, surveysCreated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  if (!user) return null;

  const startEdit = () => {
    setForm({
      display_name: user.display_name,
      age_range: user.age_range || '',
      gender: user.gender || '',
      country: user.country || '',
      education_level: user.education_level || '',
      field_of_study: user.field_of_study || '',
      is_student: user.is_student,
      interests: user.interests || [],
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile(form);
    setEditing(false);
  };

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Profile completeness
  const fields = ['age_range', 'gender', 'country', 'education_level', 'field_of_study'];
  const filled = fields.filter((f) => user[f]).length;
  const completeness = Math.round((filled / fields.length) * 100);

  // Trust score breakdown (mock)
  const trustBreakdown = [
    { label: 'Response quality', value: 0.85 },
    { label: 'Completion rate', value: 0.92 },
    { label: 'Attention checks', value: 0.78 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-soil">Profile</h1>
        {editing ? (
          <button onClick={saveEdit} className="inline-flex items-center gap-1 text-sm font-medium text-stem">
            <Save size={14} /> Save
          </button>
        ) : (
          <button onClick={startEdit} className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-soil">
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Credits', value: formatCredits(user.credit_balance), color: 'text-honey' },
          { label: 'Trust', value: user.trust_score.toFixed(1), color: 'text-stem' },
          { label: 'Taken', value: surveysTaken, color: 'text-soil' },
          { label: 'Created', value: surveysCreated, color: 'text-soil' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Trust score */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-stem" />
          <h2 className="font-semibold text-soil text-sm">Trust score</h2>
          <span className="ml-auto text-lg font-bold text-stem">{user.trust_score.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          {trustBreakdown.map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-500">{label}</span>
                <span className="text-soil font-medium">{Math.round(value * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-stem rounded-full h-1.5" style={{ width: `${value * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={16} className="text-honey" />
          <h2 className="font-semibold text-soil text-sm">Profile completeness</h2>
          <span className="ml-auto text-sm font-bold text-honey">{completeness}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div className="bg-honey rounded-full h-2 transition-all" style={{ width: `${completeness}%` }} />
        </div>
        {completeness < 100 && (
          <p className="text-xs text-gray-400">Complete your profile to unlock higher-paying surveys</p>
        )}
      </div>

      {/* Demographic info */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="font-semibold text-soil text-sm">Demographics</h2>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Display name</label>
              <input type="text" value={form.display_name} onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Age range</label>
              <select value={form.age_range} onChange={(e) => setForm((p) => ({ ...p, age_range: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <option value="">Not set</option>
                {AGE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <option value="">Not set</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
              <input type="text" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} placeholder="e.g., United States" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Education level</label>
              <select value={form.education_level} onChange={(e) => setForm((p) => ({ ...p, education_level: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <option value="">Not set</option>
                {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Field of study/work</label>
              <input type="text" value={form.field_of_study} onChange={(e) => setForm((p) => ({ ...p, field_of_study: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500">Student</label>
              <button
                onClick={() => setForm((p) => ({ ...p, is_student: !p.is_student }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.is_student ? 'bg-stem' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_student ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[
              { label: user.age_range, filled: !!user.age_range },
              { label: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Gender', filled: !!user.gender },
              { label: user.country || 'Country', filled: !!user.country },
              { label: user.education_level?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Education', filled: !!user.education_level },
              { label: user.field_of_study || 'Field of study', filled: !!user.field_of_study },
              { label: user.is_student ? 'Student' : null, filled: true },
            ].filter(Boolean).filter((t) => t.label).map(({ label, filled }) => (
              <span
                key={label}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  filled ? 'bg-stem/10 text-stem border border-stem/20' : 'bg-gray-50 text-gray-400 border border-gray-200 border-dashed'
                }`}
              >
                {filled && <CheckCircle size={10} className="inline mr-1" />}
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-soil text-sm mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = editing ? form.interests.includes(interest) : user.interests?.includes(interest);
            return (
              <button
                key={interest}
                onClick={editing ? () => toggleInterest(interest) : undefined}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? 'bg-honey/15 text-honey border border-honey/30'
                    : editing
                      ? 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                      : 'bg-gray-50 text-gray-300 border border-gray-100'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
