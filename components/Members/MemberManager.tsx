
import React, { useState } from 'react';
import { UserPlus, Trash2, TrendingUp, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AVATARS } from '../../constants';

const MemberManager: React.FC = () => {
  const { members, addMember, removeMember } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    income: '',
    avatar: AVATARS[0]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addMember({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      avatar: formData.avatar,
      income: parseFloat(formData.income) || 0
    });
    
    setShowAdd(false);
    setFormData({ name: '', income: '', avatar: AVATARS[0] });
  };

  const totalFamilyIncome = members.reduce((acc, m) => acc + m.income, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Família</h2>
          <p className="text-white/50 text-sm mt-1">Gestão de perfis e rendas</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          <UserPlus className="w-5 h-5" /> Adicionar Membro
        </button>
      </div>

      <div className="glass p-8 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <span className="text-white/60 font-medium">Total de Renda Familiar</span>
          <span className="text-3xl font-bold text-white">R$ {totalFamilyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="group glass bg-white/5 p-6 rounded-3xl flex items-center gap-4 hover:bg-white/10 border border-white/5 transition-all">
              <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-lg truncate">{member.name}</h4>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  R$ {member.income.toLocaleString('pt-BR')}
                </div>
              </div>
              <button 
                onClick={() => removeMember(member.id)}
                className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-3xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Novo Membro</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="flex justify-center gap-4 py-2">
                {AVATARS.map(url => (
                  <button 
                    key={url}
                    type="button"
                    onClick={() => setFormData({...formData, avatar: url})}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${formData.avatar === url ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder:text-white/30" 
                placeholder="Nome"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">R$</span>
                <input 
                  type="number"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pl-12 text-white placeholder:text-white/30" 
                  placeholder="Renda Mensal"
                  value={formData.income}
                  onChange={e => setFormData({...formData, income: e.target.value})}
                />
              </div>
              <button className="w-full bg-white text-black font-bold p-4 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">Cadastrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;
