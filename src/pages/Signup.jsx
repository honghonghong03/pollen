import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ display_name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
    navigate('/');
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
            <input
              type="password"
              placeholder="Choose a password"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
            />
          </div>
          <button type="submit" className="w-full bg-honey text-white font-semibold py-2.5 rounded-lg hover:bg-honey-light transition-colors">
            Create account
          </button>
          <p className="text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-stem font-medium hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
