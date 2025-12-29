
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, HeartPulse, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

const Overview: React.FC = () => {
  const { transactions, members, goals } = useApp();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncomeFromMembers = members.reduce((acc, m) => acc + m.income, 0);
  const extraIncome = monthTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalMonthlyIncome = totalIncomeFromMembers + extraIncome;
  
  const totalMonthlyExpenses = monthTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalMonthlyInvestments = monthTransactions
    .filter(t => t.type === TransactionType.INVESTMENT)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalMonthlyIncome - totalMonthlyExpenses - totalMonthlyInvestments;

  // % Gasto x Renda
  const spendingRatio = totalMonthlyIncome > 0 ? (totalMonthlyExpenses / totalMonthlyIncome) * 100 : 0;
  const healthPercent = Math.max(0, 100 - spendingRatio);

  const getHealthStatus = (percent: number) => {
    if (percent > 40) return { label: 'Excelente', color: 'text-emerald-400', bg: 'bg-emerald-400' };
    if (percent > 20) return { label: 'Saudável', color: 'text-blue-400', bg: 'bg-blue-400' };
    if (percent > 0) return { label: 'Alerta', color: 'text-amber-400', bg: 'bg-amber-400' };
    return { label: 'Crítico', color: 'text-rose-400', bg: 'bg-rose-400' };
  };

  const health = getHealthStatus(healthPercent);

  // Progresso Geral Metas
  const totalGoalTarget = goals.reduce((acc, g) => acc + g.targetTotal, 0);
  const totalGoalCurrent = goals.reduce((acc, g) => acc + g.currentTotal, 0);
  const goalProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass p-6 rounded-3xl flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Saldo Livre</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          <p className="text-white/40 text-[10px] mt-1 font-bold uppercase tracking-tighter">Após gastos e aportes</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            <Target className="text-blue-400 w-6 h-6" />
          </div>
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Patrimônio</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">{goalProgress.toFixed(1)}%</h2>
          <p className="text-blue-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">Das metas atingidas</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl">
            <TrendingUp className="text-emerald-400 w-6 h-6" />
          </div>
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Aportes Mês</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">R$ {totalMonthlyInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          <p className="text-emerald-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">Investimento total</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col justify-between shadow-lg border-2 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/5 rounded-2xl">
            <HeartPulse className={health.color + " w-6 h-6"} />
          </div>
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Status</span>
        </div>
        <div>
          <h2 className={`text-3xl font-black ${health.color} tracking-tighter italic`}>{health.label}</h2>
          <div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${health.bg}`}
              style={{ width: `${Math.min(100, Math.max(0, healthPercent))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
