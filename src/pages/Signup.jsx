import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Check, X, AtSign } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ display_name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid'

  const usernameRegex = /^[a-z0-9_]{3,20}$/;

  const checkUsername = async (value) => {
    if (!value) { setUsernameStatus(null); return; }
    if (!usernameRegex.test(value)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    const { data } = await supabase.from('profiles').select('id').eq('username', value).maybeSingle();
    setUsernameStatus(data ? 'taken' : 'available');
  };

  const handleUsernameChange = (e) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setForm((p) => ({ ...p, username: raw }));
    setUsernameStatus(null);
  };

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(form.password) },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(form.password) },
  ];

  const allChecksPassed = passwordChecks.every((c) => c.pass);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;
  const usernameValid = usernameRegex.test(form.username) && usernameStatus === 'available';
  const canSubmit = form.display_name && form.username && usernameValid && form.email && allChecksPassed && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allChecksPassed) {
      setError('Please meet all password requirements');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signup({
        email: form.email,
        password: form.password,
        display_name: form.display_name,
        username: form.username,
      });
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
      } else {
        setTimeout(() => {
          window.location.href = '/feed';
        }, 300);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-petal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg width="48" height="48" viewBox="0 0 32 32" className="mx-auto mb-4">
            <circle cx="16" cy="16" r="4" fill="#F2A623"/>
            <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
            <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
            <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
            <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
            <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
            <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
          </svg>
          <h1 className="text-2xl font-bold text-soil">Join Pollen</h1>
          <p className="text-sm text-gray-400 mt-1">Start with 15 free credits</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Name</label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))}
              placeholder="Your name"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><AtSign size={14} /></span>
              <input
                type="text"
                value={form.username}
                onChange={handleUsernameChange}
                onBlur={() => { setTouched((p) => ({ ...p, username: true })); checkUsername(form.username); }}
                placeholder="your_username"
                required
                maxLength={20}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
              />
            </div>
            {touched.username && form.username && (
              <div className="mt-1">
                {usernameStatus === 'checking' && <p className="text-xs text-gray-400">Checking availability...</p>}
                {usernameStatus === 'available' && <p className="text-xs text-stem flex items-center gap-1"><Check size={12} /> Username available</p>}
                {usernameStatus === 'taken' && <p className="text-xs text-terracotta flex items-center gap-1"><X size={12} /> Username taken</p>}
                {usernameStatus === 'invalid' && <p className="text-xs text-terracotta">3-20 chars: lowercase letters, numbers, underscores only</p>}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setError(''); }}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                placeholder="Choose a password"
                required
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-soil"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password requirements */}
            {(touched.password || form.password.length > 0) && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map(({ label, pass }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    {pass ? (
                      <Check size={12} className="text-stem" />
                    ) : (
                      <X size={12} className="text-gray-300" />
                    )}
                    <span className={`text-xs ${pass ? 'text-stem' : 'text-gray-400'}`}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => { setForm((p) => ({ ...p, confirmPassword: e.target.value })); setError(''); }}
                onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                placeholder="Re-enter your password"
                required
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 ${
                  touched.confirm && !passwordsMatch && form.confirmPassword
                    ? 'border-terracotta focus:border-terracotta'
                    : 'border-gray-200 focus:border-honey'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-soil"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.confirm && form.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-terracotta mt-1">Passwords do not match</p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-stem mt-1 flex items-center gap-1">
                <Check size={12} /> Passwords match
              </p>
            )}
          </div>
          {error && <p className="text-xs text-terracotta">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-honey text-white font-semibold py-2.5 rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create account
          </button>
          <p className="text-center text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-stem font-medium hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
