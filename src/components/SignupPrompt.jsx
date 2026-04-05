import { useNavigate } from 'react-router-dom';
import { X, Gift, Trophy, TrendingUp } from 'lucide-react';

export default function SignupPrompt({ onClose }) {
  const navigate = useNavigate();

  const handleSignup = () => {
    onClose();
    setTimeout(() => navigate('/signup'), 0);
  };

  const handleLogin = () => {
    onClose();
    setTimeout(() => navigate('/login'), 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-0 sm:pb-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 max-w-sm w-full shadow-xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-soil z-10">
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <svg width="40" height="40" viewBox="0 0 32 32" className="mx-auto mb-3">
            <circle cx="16" cy="16" r="4" fill="#F2A623"/>
            <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
            <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
            <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
            <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
            <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
            <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
          </svg>
          <h2 className="text-lg font-bold text-soil">Join Pollen for free</h2>
          <p className="text-sm text-gray-400 mt-1">Create an account to start earning</p>
        </div>

        <div className="space-y-2.5 mb-5">
          {[
            { icon: Gift, text: 'Get 15 free credits instantly', color: 'text-honey' },
            { icon: TrendingUp, text: 'Earn credits by answering surveys', color: 'text-stem' },
            { icon: Trophy, text: 'Redeem for gift cards & rewards', color: 'text-purple-600' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-3 bg-petal rounded-lg px-3 py-2.5">
              <Icon size={18} className={color} />
              <span className="text-sm text-soil">{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-honey text-white font-semibold py-3 rounded-lg hover:bg-honey-light transition-colors mb-2"
        >
          Sign up free
        </button>
        <button
          onClick={handleLogin}
          className="w-full text-sm text-gray-400 hover:text-soil py-2"
        >
          Already have an account? <span className="text-stem font-medium">Log in</span>
        </button>
      </div>
    </div>
  );
}
