
import React from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, CategoryType } from '../../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../constants';

const TransactionList: React.FC = () => {
  const { transactions, removeTransaction, members } = useApp();

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="glass p-8 rounded-[2.5rem] shadow-xl mt-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">Lançamentos Recentes</h3>
        <span className="text-white/40 text-sm font-medium uppercase tracking-widest">{transactions.length} registros</span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
        {sortedTransactions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/30 text-lg">Nenhum lançamento encontrado.</p>
          </div>
        ) : (
          sortedTransactions.map((t) => {
            const member = members.find(m => m.id === t.memberId);
            const isExpense = t.type === TransactionType.EXPENSE;
            
            return (
              <div 
                key={t.id} 
                className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] + '33', color: CATEGORY_COLORS[t.category] }}
                  >
                    {CATEGORY_ICONS[t.category]}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                      {t.description}
                      {t.currentInstallment && (
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                          {t.currentInstallment}/{t.installments}
                        </span>
                      )}
                    </h4>
                    <p className="text-white/40 text-xs flex items-center gap-2">
                      {new Date(t.date).toLocaleDateString('pt-BR')} • {member?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isExpense ? '-' : '+'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-white/30 text-[10px] uppercase tracking-tighter">
                      {isExpense ? <TrendingDown className="inline w-3 h-3 mr-1" /> : <TrendingUp className="inline w-3 h-3 mr-1" />}
                      {isExpense ? 'Gasto' : 'Ganhos'}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => removeTransaction(t.id)}
                    className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
