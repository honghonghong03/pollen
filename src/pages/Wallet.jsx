import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import TransactionItem from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import { formatCredits } from '../lib/credits';

export default function Wallet() {
  const { user, transactions, totalEarned, totalSpent } = useAuth();

  const stats = [
    { label: 'Available', value: formatCredits(user?.credit_balance ?? 0), icon: Coins, color: 'text-honey' },
    { label: 'Earned', value: formatCredits(totalEarned), icon: TrendingUp, color: 'text-stem' },
    { label: 'Spent', value: formatCredits(totalSpent), icon: TrendingDown, color: 'text-terracotta' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-soil">Wallet</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Icon size={20} className={`mx-auto mb-1 ${color}`} />
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-soil mb-2">Transaction history</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No transactions yet</p>
        ) : (
          <div>
            {transactions.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
