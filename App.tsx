
import React, { useState } from 'react';
import { Plus, Sparkles, LogOut, User as UserIcon, Hand } from 'lucide-react';
import { useApp, AppProvider } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import Overview from './components/Dashboard/Overview';
import Charts from './components/Dashboard/Charts';
import TransactionList from './components/Transactions/TransactionList';
import TransactionForm from './components/Transactions/TransactionForm';
import CardManager from './components/Cards/CardManager';
import MemberManager from './components/Members/MemberManager';
import EntityManager from './components/Entities/EntityManager';
import ReportManager from './components/Reports/ReportManager';
import InvestmentManager from './components/Investments/InvestmentManager';
import SettingsManager from './components/Settings/SettingsManager';
import LoginForm from './components/Auth/LoginForm';

const AppContent: React.FC = () => {
  const { theme, isAuthenticated, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dash');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen mesh-gradient transition-colors duration-1000 ${theme}`}>
        <LoginForm />
      </div>
    );
  }

  const renderTab = () => {
    switch(activeTab) {
      case 'dash':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Overview />
            <Charts />
            <TransactionList />
          </div>
        );
      case 'trans':
        return <TransactionList />;
      case 'inv':
        return <InvestmentManager />;
      case 'ent':
        return <EntityManager />;
      case 'rep':
        return <ReportManager />;
      case 'cards':
        return <CardManager />;
      case 'members':
        return <MemberManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen mesh-gradient transition-colors duration-1000 ${theme}`}>
      <div className="fixed inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-32 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-white w-6 h-6 animate-pulse" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  Finança<span className="text-white/50 not-italic font-light">Pro</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Hand className="w-3 h-3 text-white/40" />
                <p className="text-white font-black tracking-widest text-[12px] uppercase italic">
                  Olá, <span className="text-white/80">{currentUser?.name?.split(' ')[0] || 'Visitante'}</span>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
              <div className="bg-white/20 p-2 rounded-xl">
                <UserIcon className="text-white w-4 h-4" />
              </div>
              <div>
                <p className="text-white/30 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Acesso Logado</p>
                <p className="text-white font-black text-xs uppercase italic tracking-tighter">{currentUser?.username}</p>
              </div>
              <button 
                onClick={logout}
                className="ml-4 p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
             {/* Mobile User Name Display */}
             <div className="lg:hidden flex items-center justify-between w-full bg-white/10 p-4 rounded-2xl border border-white/10 mb-2">
                <div className="flex items-center gap-3">
                  <UserIcon className="text-white w-4 h-4" />
                  <span className="text-white font-black text-xs uppercase italic">{currentUser?.username}</span>
                </div>
                <button onClick={logout} className="text-white/40"><LogOut className="w-4 h-4" /></button>
             </div>

            <button 
              onClick={() => setShowTransactionForm(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-3xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3px]" /> NOVO LANÇAMENTO
            </button>
          </div>
        </header>

        <div className="pb-8">
          {renderTab()}
        </div>
      </main>

      <Navbar currentTab={activeTab} setTab={setActiveTab} />
      {showTransactionForm && <TransactionForm onClose={() => setShowTransactionForm(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
