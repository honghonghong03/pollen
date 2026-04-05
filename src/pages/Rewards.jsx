import { useState } from 'react';
import { ArrowLeft, Gift, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REWARDS } from '../lib/gamification';
import { formatCredits } from '../lib/credits';

export default function Rewards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/wallet')} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-soil">
        <ArrowLeft size={16} /> Back to wallet
      </button>

      <div className="flex items-center gap-2">
        <Gift size={20} className="text-honey" />
        <h1 className="text-xl font-bold text-soil">Rewards Store</h1>
      </div>

      <div className="bg-honey/10 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-soil-light">Your balance</p>
          <p className="text-2xl font-bold text-honey">{formatCredits(user?.credit_balance ?? 0)} credits</p>
        </div>
        <Gift size={32} className="text-honey/30" />
      </div>

      {/* Reward cards */}
      <div className="grid grid-cols-2 gap-3">
        {REWARDS.map((reward) => {
          const canAfford = (user?.credit_balance ?? 0) >= reward.cost;
          return (
            <div key={reward.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <span className="text-3xl mb-2">{reward.emoji}</span>
              <h3 className="text-sm font-semibold text-soil mb-1">{reward.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{reward.category}</p>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-sm font-bold text-honey">{reward.cost}</span>
                <span className="text-xs text-gray-400">credits</span>
              </div>
              <button
                onClick={() => handleRedeem(reward)}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
                  canAfford
                    ? 'bg-honey text-white hover:bg-honey-light'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {canAfford ? 'Redeem' : 'Not enough credits'}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Earn credits by answering surveys. More rewards coming soon!
      </p>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-soil">
              <X size={20} />
            </button>
            <span className="text-5xl mb-3 block">{selectedReward?.emoji}</span>
            <h2 className="text-lg font-bold text-soil mb-1">{selectedReward?.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedReward?.cost} credits</p>
            <div className="bg-petal rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-honey mb-1">Coming soon!</p>
              <p className="text-xs text-gray-500">
                Rewards redemption is launching soon. Keep earning credits — your balance will carry over!
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-honey text-white font-semibold py-2.5 rounded-lg hover:bg-honey-light transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
