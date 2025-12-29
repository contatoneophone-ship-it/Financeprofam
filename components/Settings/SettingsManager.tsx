
import React, { useRef, useState } from 'react';
import { Download, Upload, ShieldAlert, Database, Trash2, CheckCircle2, UserPlus, ShieldCheck, Key, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SettingsManager: React.FC = () => {
  const { users, addUserAccount, removeUserAccount, ...state } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Creation State
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '' });

  const handleExportBackup = () => {
    const backupData = JSON.stringify(state, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financa-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!json.members || !json.transactions) {
          throw new Error('Arquivo de backup inválido.');
        }
        localStorage.setItem('financa_pro_v3_data', JSON.stringify(json));
        alert('Backup restaurado com sucesso! A página será reiniciada.');
        window.location.reload();
      } catch (err) {
        alert('Erro ao restaurar backup: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('TEM CERTEZA? Isso apagará todos os seus dados permanentemente.')) {
      localStorage.removeItem('financa_pro_v3_data');
      window.location.reload();
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.username || !newUserData.password) return;
    
    addUserAccount({
      id: Math.random().toString(36).substr(2, 9),
      ...newUserData
    });
    
    setNewUserData({ name: '', username: '', password: '' });
    setShowAddUser(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Configurações</h2>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Segurança e Gestão de Acessos</p>
        </div>
        <button 
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {/* User Management Section */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5">
        <div className="flex items-center gap-4 mb-8">
          <ShieldCheck className="text-blue-400 w-6 h-6" />
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Usuários do Sistema</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <User className="text-white/40 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">{user.name}</h4>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{user.username}</p>
                </div>
              </div>
              {user.id !== 'admin' && (
                <button 
                  onClick={() => removeUserAccount(user.id)}
                  className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-all">
          <div>
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 w-fit mb-6">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exportar Backup</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Gere um arquivo JSON com seus dados. Mantenha este arquivo seguro.
            </p>
          </div>
          <button 
            onClick={handleExportBackup}
            className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            BAIXAR ARQUIVO .JSON
          </button>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-all">
          <div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-6">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Restaurar Backup</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Atenção: Isso substituirá todos os seus dados atuais.
            </p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImportBackup} className="hidden" accept=".json" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            CARREGAR ARQUIVO
          </button>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5">
        <div className="flex items-center gap-4 mb-4">
          <ShieldAlert className="text-rose-500 w-6 h-6" />
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Zona de Perigo</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/60 text-sm max-w-md">
            Apagar todos os dados limpa o armazenamento local do seu navegador permanentemente.
          </p>
          <button 
            onClick={clearAllData}
            className="bg-rose-500/20 text-rose-500 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
          >
            LIMPAR TUDO
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6">Novo Usuário</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" 
                  value={newUserData.name}
                  onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Login (Username)</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" 
                  value={newUserData.username}
                  onChange={e => setNewUserData({...newUserData, username: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Senha</label>
                <input 
                  required
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none" 
                  value={newUserData.password}
                  onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 bg-white/5 text-white/60 font-black p-4 rounded-2xl uppercase tracking-widest text-[10px]">Cancelar</button>
                <button type="submit" className="flex-1 bg-white text-black font-black p-4 rounded-2xl uppercase tracking-widest text-[10px]">Criar Conta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManager;
