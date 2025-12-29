
import React, { useState } from 'react';
import { Plus, CreditCard as CardIcon, Trash2, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CardType, Card, TransactionType } from '../../types';

const CardManager: React.FC = () => {
  const { cards, members, transactions, addCard, removeCard } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    memberId: members[0]?.id || '',
    type: CardType.CREDIT,
    lastDigits: '',
    limit: '',
    closingDay: '1',
    dueDay: '10',
    color: '#4F46E5'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.memberId) return;

    addCard({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      limit: parseFloat(formData.limit) || 0,
      closingDay: parseInt(formData.closingDay),
      dueDay: parseInt(formData.dueDay),
    } as Card);
    
    setShowAdd(false);
    setFormData({ ...formData, name: '', lastDigits: '', limit: '' });
  };

  const getCardUsage = (cardId: string) => {
    // Projeta o total de parcelas ainda não pagas vinculadas ao cartão
    return transactions
      .filter(t => t.cardId === cardId && t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const CARD_COLORS = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#000000'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Meus Cartões</h2>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Gestão de Limite e Vencimentos</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => {
          const owner = members.find(m => m.id === card.memberId);
          const usedLimit = getCardUsage(card.id);
          const availableLimit = Math.max(0, card.limit - usedLimit);
          const usagePercent = card.limit > 0 ? (usedLimit / card.limit) * 100 : 0;

          return (
            <div 
              key={card.id}
              className="relative rounded-[2.5rem] shadow-2xl overflow-hidden group border border-white/10 flex flex-col"
            >
              <div 
                className="relative aspect-[1.6/1] p-8"
                style={{ backgroundColor: card.color }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10" />
                
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em]">{card.type}</p>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter">{card.name}</h3>
                    </div>
                    <CardIcon className="text-white/40 w-8 h-8" />
                  </div>

                  <div>
                    <div className="mb-4">
                      <p className="text-white/50 text-[9px] uppercase tracking-widest font-black">Titular</p>
                      <p className="text-white font-bold">{owner?.name || 'Desconhecido'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-2">
                         <span className="text-white/40 tracking-[0.3em] font-light">****</span>
                         <span className="text-white font-bold tracking-widest">{card.lastDigits}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-[9px] uppercase tracking-widest font-black">Expira em</p>
                        <p className="text-white font-bold text-xs">Venc: Dia {card.dueDay}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeCard(card.id)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {card.type === CardType.CREDIT && (
                <div className="glass p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Limite Utilizado</span>
                    <span className={usagePercent > 80 ? 'text-rose-400' : 'text-white'}>
                      {usagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-white/40'}`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <div className="flex flex-col">
                      <span className="text-white/30 text-[8px] uppercase font-black">Livre</span>
                      <span className="text-emerald-400">R$ {availableLimit.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-white/30 text-[8px] uppercase font-black">Total</span>
                      <span className="text-white">R$ {card.limit.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  {usagePercent > 90 && (
                    <div className="flex items-center gap-2 text-rose-400 text-[9px] font-bold bg-rose-500/10 p-2 rounded-lg animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      LIMITE QUASE ESGOTADO
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {cards.length === 0 && !showAdd && (
          <div className="col-span-full py-20 glass rounded-[2.5rem] flex flex-col items-center justify-center text-white/20 border-dashed border-2 border-white/10">
            <CardIcon className="w-12 h-12 mb-4 opacity-10" />
            <p className="uppercase tracking-widest font-black text-xs">Nenhum cartão cadastrado</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Novo Cartão</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white transition-all"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Apelido do Cartão</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30" 
                  placeholder="Ex: Nubank Black"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Titular</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none"
                    value={formData.memberId}
                    onChange={e => setFormData({...formData, memberId: e.target.value})}
                  >
                    {members.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Final</label>
                  <input 
                    required
                    maxLength={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center tracking-widest" 
                    placeholder="0000"
                    value={formData.lastDigits}
                    onChange={e => setFormData({...formData, lastDigits: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Tipo</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as CardType})}
                  >
                    <option value={CardType.CREDIT} className="text-black">Crédito</option>
                    <option value={CardType.DEBIT} className="text-black">Débito</option>
                  </select>
                </div>
                {formData.type === CardType.CREDIT && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Limite Total</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" 
                      placeholder="0,00"
                      value={formData.limit}
                      onChange={e => setFormData({...formData, limit: e.target.value})}
                    />
                  </div>
                )}
              </div>
              
              {formData.type === CardType.CREDIT && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Fechamento (Dia)</label>
                    <input 
                      type="number" min="1" max="31"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white"
                      value={formData.closingDay}
                      onChange={e => setFormData({...formData, closingDay: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Vencimento (Dia)</label>
                    <input 
                      type="number" min="1" max="31"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white"
                      value={formData.dueDay}
                      onChange={e => setFormData({...formData, dueDay: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 justify-center py-4">
                {CARD_COLORS.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setFormData({...formData, color: c})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-30'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button className="w-full bg-white text-black font-black p-5 rounded-[2rem] shadow-xl hover:scale-105 transition-all uppercase tracking-widest">
                Salvar Cartão
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManager;
