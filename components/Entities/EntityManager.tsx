
import React, { useState } from 'react';
import { UserPlus, Building2, Trash2, X, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EntityType, Entity } from '../../types';

const EntityManager: React.FC = () => {
  const { entities, addEntity, removeEntity } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: EntityType.COMPANY, document: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addEntity({ id: Math.random().toString(36).substr(2, 9), ...formData });
    setShowAdd(false);
    setFormData({ name: '', type: EntityType.COMPANY, document: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">Contatos</h2>
        <button onClick={() => setShowAdd(true)} className="bg-white text-black px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">
          <UserPlus className="w-5 h-5 inline mr-2" /> Novo Contato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map(e => (
          <div key={e.id} className="glass p-5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {e.type === EntityType.COMPANY ? <Building2 className="text-blue-400 w-6 h-6" /> : <Users className="text-emerald-400 w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-white font-bold">{e.name}</h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">{e.type} {e.document && `• ${e.document}`}</p>
              </div>
            </div>
            <button onClick={() => removeEntity(e.id)} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {entities.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/30 border-2 border-dashed border-white/10 rounded-3xl">
            Nenhum contato cadastrado.
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-3xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Novo Contato</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                {Object.values(EntityType).map(t => (
                  <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === t ? 'bg-white text-black' : 'text-white/40'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <input required className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white" placeholder="Nome / Razão Social" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white" placeholder="CPF / CNPJ (Opcional)" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} />
              <button className="w-full bg-white text-black font-bold p-4 rounded-xl shadow-xl">Cadastrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityManager;
