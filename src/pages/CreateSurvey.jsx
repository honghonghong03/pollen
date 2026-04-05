import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TOPICS, TIME_OPTIONS } from '../data/mock';
import { calculateCost, getTargetingLevel, formatCredits } from '../lib/credits';
import SurveyCard from '../components/SurveyCard';

const STEPS = ['Basics', 'Audience', 'Review'];

export default function CreateSurvey() {
  const navigate = useNavigate();
  const { user, spendCredits, addSurvey } = useAuth();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    title: '',
    description: '',
    survey_url: '',
    estimated_minutes: 5,
    topics: [],
    responses_needed: 20,
    targeting_enabled: false,
    target_age_range: '',
    target_country: '',
    target_education: '',
    target_language: '',
    target_custom: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleTopic = (topic) => {
    setForm((prev) => {
      const has = prev.topics.includes(topic);
      const topics = has ? prev.topics.filter((t) => t !== topic) : prev.topics.length < 3 ? [...prev.topics, topic] : prev.topics;
      return { ...prev, topics };
    });
  };

  const targetingLevel = getTargetingLevel(form);
  const totalCost = calculateCost(form.responses_needed, targetingLevel);
  const canAfford = (user?.credit_balance ?? 0) >= totalCost;

  const previewSurvey = {
    ...form,
    id: 'preview',
    creator_id: 'preview',
    responses_collected: 0,
    credit_cost_per_response: totalCost / form.responses_needed,
    total_credits_spent: totalCost,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  const canProceedStep0 = form.title && form.description && form.survey_url && form.topics.length > 0;
  const canProceedStep1 = form.responses_needed > 0;

  const handlePublish = () => {
    const survey = {
      ...form,
      id: 's' + Date.now(),
      creator_id: user.id,
      responses_collected: 0,
      credit_cost_per_response: totalCost / form.responses_needed,
      total_credits_spent: totalCost,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    addSurvey(survey);
    spendCredits(totalCost, `Published: ${form.title}`, 'survey_published', survey.id);
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <button onClick={() => step > 0 ? setStep(step - 1) : navigate('/')} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-soil">
        <ArrowLeft size={16} /> {step > 0 ? 'Back' : 'Cancel'}
      </button>

      <h1 className="text-xl font-bold text-soil">Create survey</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              i < step ? 'bg-stem text-white' : i === step ? 'bg-honey text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? 'text-soil' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        {step === 0 && (
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-soil mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="What is your survey about and why should people take it?"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-soil mb-1">Survey link</label>
              <input
                type="url"
                value={form.survey_url}
                onChange={(e) => update('survey_url', e.target.value)}
                placeholder="https://forms.google.com/..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-soil mb-1">Estimated completion time</label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('estimated_minutes', opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      form.estimated_minutes === opt.value ? 'bg-honey text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-soil mb-1">Number of responses needed</label>
              <input
                type="number"
                min={1}
                max={500}
                value={form.responses_needed}
                onChange={(e) => update('responses_needed', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-soil">Enable audience targeting</label>
              <button
                onClick={() => update('targeting_enabled', !form.targeting_enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.targeting_enabled ? 'bg-stem' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.targeting_enabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {form.targeting_enabled && (
              <div className="space-y-3 pl-2 border-l-2 border-stem/20">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Age range</label>
                  <select value={form.target_age_range} onChange={(e) => update('target_age_range', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <option value="">Any</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                  <select value={form.target_country} onChange={(e) => update('target_country', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <option value="">Any</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Education level</label>
                  <select value={form.target_education} onChange={(e) => update('target_education', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <option value="">Any</option>
                    <option value="high_school">High school</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="masters">Master's</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                  <select value={form.target_language} onChange={(e) => update('target_language', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                    <option value="">Any</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Hindi">Hindi</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Custom filter</label>
                  <input
                    type="text"
                    value={form.target_custom}
                    onChange={(e) => update('target_custom', e.target.value)}
                    placeholder="e.g., first-generation college student"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Live cost preview */}
            <div className="bg-petal rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-soil">Cost breakdown</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{form.responses_needed} responses x 2 cr</span>
                <span className="text-soil">{formatCredits(form.responses_needed * 2)} cr</span>
              </div>
              {targetingLevel !== 'open' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Targeting ({targetingLevel}) multiplier</span>
                  <span className="text-soil">x{targetingLevel === 'basic' ? '1.5' : '2.5'}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                <span className="text-soil">Total cost</span>
                <span className="text-honey">{formatCredits(totalCost)} credits</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Your balance</span>
                <span className={canAfford ? 'text-stem' : 'text-terracotta'}>{formatCredits(user?.credit_balance ?? 0)} credits</span>
              </div>
              {!canAfford && (
                <div className="flex items-center gap-1.5 text-xs text-terracotta mt-1">
                  <AlertCircle size={12} />
                  <span>Not enough credits. <button onClick={() => navigate('/')} className="underline">Earn more by answering surveys</button></span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Here's how your survey will appear in the feed:</p>
            <SurveyCard survey={previewSurvey} />
            <div className="bg-petal rounded-xl p-4 text-center">
              <p className="text-sm text-soil-light mb-1">Total cost: <span className="font-bold text-honey">{formatCredits(totalCost)} credits</span></p>
              <p className="text-xs text-gray-400">Credits will be deducted from your balance</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
            className="flex-1 bg-honey text-white font-semibold py-3 rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={!canAfford}
            className="flex-1 bg-stem text-white font-semibold py-3 rounded-lg hover:bg-stem-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={16} /> Publish survey
          </button>
        )}
      </div>
    </div>
  );
}
