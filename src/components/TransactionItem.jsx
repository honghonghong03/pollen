import { ArrowUpRight, ArrowDownRight, Flame, Star, Gift } from 'lucide-react';
import { formatCredits } from '../lib/credits';

const typeConfig = {
  survey_completed: { icon: ArrowUpRight, label: 'Survey completed' },
  survey_published: { icon: ArrowDownRight, label: 'Survey published' },
  streak_bonus: { icon: Flame, label: 'Streak bonus' },
  quality_bonus: { icon: Star, label: 'Quality bonus' },
  starter_credits: { icon: Gift, label: 'Starter credits' },
};

export default function TransactionItem({ transaction }) {
  const config = typeConfig[transaction.type] || typeConfig.survey_completed;
  const Icon = config.icon;
  const isPositive = transaction.amount > 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        isPositive ? 'bg-stem/10 text-stem' : 'bg-terracotta/10 text-terracotta'
      }`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-soil truncate">{transaction.description}</p>
        <p className="text-xs text-gray-400">{config.label} &middot; {new Date(transaction.created_at).toLocaleDateString()}</p>
      </div>
      <span className={`text-sm font-semibold whitespace-nowrap ${isPositive ? 'text-stem' : 'text-terracotta'}`}>
        {isPositive ? '+' : ''}{formatCredits(transaction.amount)} cr
      </span>
    </div>
  );
}
