import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email);
    if (success) {
      navigate('/');
    } else {
      setError('Account not found. Try alex@example.com, priya@example.com, or jordan@example.com');
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
          <h1 className="text-2xl font-bold text-soil">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Give answers. Get answers.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-soil mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter any password"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey"
            />
          </div>
          {error && <p className="text-xs text-terracotta">{error}</p>}
          <button type="submit" className="w-full bg-honey text-white font-semibold py-2.5 rounded-lg hover:bg-honey-light transition-colors">
            Log in
          </button>
          <p className="text-center text-sm text-gray-400">
            Don't have an account? <Link to="/signup" className="text-stem font-medium hover:underline">Sign up</Link>
          </p>
        </form>

        <div className="mt-4 bg-white/60 rounded-lg p-3 text-xs text-gray-400 text-center">
          <p className="font-medium text-soil-light mb-1">Demo accounts</p>
          <p>alex@example.com &middot; priya@example.com &middot; jordan@example.com</p>
        </div>
      </div>
    </div>
  );
}
