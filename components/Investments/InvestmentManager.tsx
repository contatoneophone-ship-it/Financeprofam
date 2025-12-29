
import React, { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, Plus, Trash2, X, ChevronRight, PieChart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoalType, InvestmentGoal } from '../../types';

const InvestmentManager: React.FC = () => {
  const { goals, addGoal, removeGoal, members, transactions } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: GoalType.OBJECTIVE,
    targetTotal: '',
    currentTotal: '0',
    monthlyTargetPercent: '15',
    color: '#10B981'
  });

  const totalIncome = members.reduce((acc, m) => acc + m.income, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetTotal) return;

    addGoal({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      targetTotal: parseFloat(formData.targetTotal),
      currentTotal: parseFloat(formData.currentTotal),
      monthlyTargetPercent: parseFloat(formData.monthlyTargetPercent),
      color: formData.color
    });

    setShowAdd(false);
    setFormData({ ...formData, name: '', targetTotal: '' });
  };

  const getMonthlyContribution = (goal: InvestmentGoal) => {
    // Calcula quanto foi investido nessa meta este mês
    const now = new Date();
    return transactions
      .filter(t => t.goalId === goal.id)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const GOAL_COLORS = ['#10B981', '#3B82F6', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Patrimônio</h2>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Metas e Reserva de Emergência</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-white text-black px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> DEFINIR META
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.currentTotal / goal.targetTotal) * 100;
          const monthlyTarget = goal.monthlyTargetPercent ? (totalIncome * goal.monthlyTargetPercent) / 100 : 0;
          const monthlyContributed = getMonthlyContribution(goal);
          const monthlyProgress = monthlyTarget > 0 ? (monthlyContributed / monthlyTarget) * 100 : 100;

          return (
            <div key={goal.id} className="glass p-6 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden border border-white/5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-white/5" style={{ color: goal.color }}>
                  {goal.type === GoalType.EMERGENCY ? <ShieldCheck className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{goal.type}</p>
                  <h4 className="text-white font-bold text-lg">{goal.name}</h4>
                </div>
              </div>

              <div className="space-y-6">
                {/* Total Progress */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/60">ALCANCE TOTAL</span>
                    <span className="text-white">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${Math.min(100, progress)}%`, backgroundColor: goal.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-black tracking-tighter">
                    <span className="text-white/40">R$ {goal.currentTotal.toLocaleString('pt-BR')}</span>
                    <span className="text-white/40">R$ {goal.targetTotal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                {/* Monthly Progress */}
                {goal.monthlyTargetPercent && (
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-black mb-2 tracking-widest">
                      <span className="text-white/40">DESEMPENHO MÊS ({goal.monthlyTargetPercent}%)</span>
                      <span className={monthlyProgress >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                        {monthlyProgress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${monthlyProgress >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, monthlyProgress)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-white/30 mt-1 uppercase">Aporte: R$ {monthlyContributed.toLocaleString('pt-BR')} / R$ {monthlyTarget.toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => removeGoal(goal.id)}
                className="absolute top-4 right-4 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-rose-500/10 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {goals.length === 0 && !showAdd && (
          <div className="col-span-full py-20 glass rounded-[2.5rem] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10">
            <PieChart className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-bold tracking-widest uppercase text-sm">Nenhuma meta ativa</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Definir Nova Meta</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white transition-all"><X /></button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-2">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Tipo de Meta</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(GoalType).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, type: t})}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${formData.type === t ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Nome da Meta</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30" 
                  placeholder="Ex: Reserva 12 Meses"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Objetivo Total</label>
                  <input 
                    type="number"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" 
                    placeholder="R$ 10.000"
                    value={formData.targetTotal}
                    onChange={e => setFormData({...formData, targetTotal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Início Atual</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" 
                    placeholder="R$ 0"
                    value={formData.currentTotal}
                    onChange={e => setFormData({...formData, currentTotal: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Meta Mensal (% da Renda)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="50" step="1"
                    className="flex-1 accent-white"
                    value={formData.monthlyTargetPercent}
                    onChange={e => setFormData({...formData, monthlyTargetPercent: e.target.value})}
                  />
                  <span className="text-white font-bold w-12">{formData.monthlyTargetPercent}%</span>
                </div>
                <p className="text-[10px] text-white/20 italic uppercase tracking-tighter">
                  Baseado na renda familiar (R$ {totalIncome.toLocaleString('pt-BR')}), o aporte ideal é R$ {((totalIncome * parseFloat(formData.monthlyTargetPercent)) / 100).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex gap-2 justify-center py-2">
                {GOAL_COLORS.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setFormData({...formData, color: c})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-50'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <button className="w-full bg-white text-black font-black p-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest">
                Confirmar Objetivo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentManager;
