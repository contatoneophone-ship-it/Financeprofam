
import React, { useState } from 'react';
import { Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LoginForm: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="glass w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-white/10 rounded-3xl mb-6 shadow-xl">
            <Sparkles className="text-white w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Finança<span className="text-white/50 not-italic font-light">Pro</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Acesso Restrito ao Painel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input 
                required
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu login"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/20 rounded-2xl animate-in shake duration-300">
              <AlertCircle className="text-rose-400 w-5 h-5" />
              <p className="text-rose-400 text-xs font-bold uppercase tracking-tight">Login ou senha inválidos</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-5 rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
          >
            Entrar no Ecossistema
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">
            Finança Pro © 2025 • Todos os direitos reservados
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginForm;
