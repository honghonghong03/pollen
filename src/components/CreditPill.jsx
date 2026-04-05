import { Coins } from 'lucide-react';
import { formatCredits } from '../lib/credits';

export default function CreditPill({ amount, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-honey/15 text-honey-light border border-honey/30 rounded-full px-3 py-1 font-semibold text-sm ${className}`}>
      <Coins size={14} />
      <span>{formatCredits(amount)}</span>
    </div>
  );
}
