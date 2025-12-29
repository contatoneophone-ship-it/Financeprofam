
import React, { useState } from 'react';
import { Plus, X, Calendar, DollarSign, Tag, CreditCard, User, Building2, Target, Hash, MessageCircle, CheckCircle2, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryType, TransactionType, PaymentMethod } from '../../types';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { members, cards, entities, goals, addTransaction } = useApp();
  
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.OTHER);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [entityId, setEntityId] = useState('');
  const [cardId, setCardId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [installments, setInstallments] = useState('1');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSavedTransaction, setLastSavedTransaction] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !memberId) return;

    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description,
      amount: parseFloat(amount),
      category: type === TransactionType.INVESTMENT ? CategoryType.INVESTMENT : category,
      paymentMethod,
      date,
      memberId,
      entityId: entityId || undefined,
      cardId: (paymentMethod === PaymentMethod.CREDIT || paymentMethod === PaymentMethod.DEBIT) ? cardId : undefined,
      goalId: type === TransactionType.INVESTMENT ? goalId : undefined,
      installments: paymentMethod === PaymentMethod.CREDIT ? parseInt(installments) || 1 : 1
    };

    addTransaction(newTransaction);
    setLastSavedTransaction(newTransaction);
    setIsSuccess(true);
  };

  const getWhatsAppMessage = () => {
    if (!lastSavedTransaction) return "";
    const memberName = members.find(m => m.id === lastSavedTransaction.memberId)?.name || 'Membro';
    
    return `💰 *Lançamento Confirmado - Finança Pro*\n\n` +
      `👤 *Membro:* ${memberName}\n` +
      `📝 *Descrição:* ${lastSavedTransaction.description}\n` +
      `💵 *Valor:* R$ ${lastSavedTransaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `🔄 *Tipo:* ${lastSavedTransaction.type}\n` +
      `📂 *Categoria:* ${lastSavedTransaction.category}\n` +
      `💳 *Método:* ${lastSavedTransaction.paymentMethod}\n` +
      `📅 *Data:* ${new Date(lastSavedTransaction.date).toLocaleDateString('pt-BR')}\n\n` +
      `_Notificação Automática Familiar_`;
  };

  const sendToFamily = () => {
    const message = encodeURIComponent(getWhatsAppMessage());
    const numbers = ['+5541987518610', '+5541988403049'];
    
    // Abre para o primeiro número
    window.open(`https://wa.me/${numbers[0].replace(/\D/g, '')}?text=${message}`, '_blank');
    
    // Pequeno atraso para o navegador permitir a abertura da segunda aba/popup
    setTimeout(() => {
      window.open(`https://wa.me/${numbers[1].replace(/\D/g, '')}?text=${message}`, '_blank');
    }, 800);
  };

  const showInstallments = type === TransactionType.EXPENSE && paymentMethod === PaymentMethod.CREDIT;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <div className="glass w-full max-w-lg rounded-[2.5rem] p-10 flex flex-col items-center text-center animate-in zoom-in duration-300">
          <div className="p-4 bg-emerald-500/20 rounded-full mb-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Lançamento Salvo!</h2>
          <p className="text-white/50 text-sm mb-10 leading-relaxed">O registro foi adicionado com sucesso ao histórico familiar e o saldo consolidado já foi atualizado.</p>
          
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={onClose}
              className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs"
            >
              Fechar Janela
            </button>
            
            <button 
              onClick={sendToFamily}
              className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 border border-emerald-400/30"
            >
              <Share2 className="w-5 h-5" /> Notificar Família (WA)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-10 glass px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Novo Lançamento</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex p-1 bg-white/5 rounded-2xl">
            {Object.values(TransactionType).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                  type === t 
                    ? (t === TransactionType.EXPENSE ? 'bg-rose-500' : t === TransactionType.INCOME ? 'bg-emerald-500' : 'bg-blue-500') + ' text-white shadow-lg' 
                    : 'text-white/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Descrição</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input required type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Mercado, Aluguel, Pix Celular..." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/40 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Valor Total</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/40" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-white/40" />
            </div>
          </div>

          {type === TransactionType.INVESTMENT && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Vincular à Meta Patrimonial</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                <select value={goalId} onChange={e => setGoalId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white appearance-none focus:border-white/40">
                  <option value="" className="text-black">Investimento Avulso</option>
                  {goals.map(g => <option key={g.id} value={g.id} className="text-black">{g.name} ({Math.round((g.currentTotal/g.targetTotal)*100)}%)</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Membro Titular</label>
              <select value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white appearance-none focus:border-white/40">
                {members.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Beneficiário/Origem</label>
              <select value={entityId} onChange={e => setEntityId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white appearance-none focus:border-white/40">
                <option value="" className="text-black">Nenhum</option>
                {entities.map(e => <option key={e.id} value={e.id} className="text-black">{e.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Método de Pagamento</label>
            <div className="grid grid-cols-5 gap-1">
              {Object.values(PaymentMethod).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-3 px-1 rounded-xl border text-[8px] font-black uppercase transition-all flex items-center justify-center text-center leading-tight ${paymentMethod === m ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/40 border-white/10'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(paymentMethod === PaymentMethod.CREDIT || paymentMethod === PaymentMethod.DEBIT) && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Cartão</label>
                <select value={cardId} onChange={e => setCardId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white appearance-none focus:border-white/40">
                  <option value="" className="text-black">Selecionar...</option>
                  {cards.filter(c => c.memberId === memberId).map(c => <option key={c.id} value={c.id} className="text-black">{c.name} (*{c.lastDigits})</option>)}
                </select>
              </div>
            )}
            
            {showInstallments && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Parcelas</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                  <select value={installments} onChange={e => setInstallments(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white appearance-none focus:border-white/40">
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i+1} value={i+1} className="text-black">{i+1}x {i > 0 ? `(R$ ${(parseFloat(amount || '0')/(i+1)).toFixed(2)})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {type !== TransactionType.INVESTMENT && (
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value as CategoryType)} className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white appearance-none focus:border-white/40">
                {Object.values(CategoryType).map(c => <option key={c} value={c} className="text-black">{c}</option>)}
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest mt-4">
            Finalizar Lançamento
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
