
import React from 'react';
import { Sun, Moon, Users, CreditCard, LayoutDashboard, History, FileText, Settings, Target, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const { theme, setTheme } = useApp();

  const tabs = [
    { id: 'dash', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'trans', label: 'Histórico', icon: <History className="w-5 h-5" /> },
    { id: 'ai', label: 'Genius', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'inv', label: 'Patrimônio', icon: <Target className="w-5 h-5" /> },
    { id: 'rep', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
    { id: 'cards', label: 'Cartões', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'members', label: 'Família', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl glass rounded-[2rem] p-2 flex items-center shadow-2xl transition-all duration-300 border border-white/20">
      
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/10 to-transparent z-10 pointer-events-none sm:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/10 to-transparent z-10 pointer-events-none sm:hidden" />

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-2 py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTab(tab.id);
                if (window.navigator.vibrate) window.navigator.vibrate(10);
              }}
              className={`
                flex flex-col items-center justify-center gap-1.5 
                min-w-[70px] sm:min-w-[85px] py-2.5 rounded-2xl 
                transition-all duration-300 snap-center shrink-0
                ${currentTab === tab.id 
                  ? 'bg-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] scale-105 active:scale-95' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5 active:scale-90'
                }
                ${tab.id === 'ai' && currentTab !== 'ai' ? 'animate-pulse' : ''}
              `}
            >
              <div className={`transition-transform duration-300 ${currentTab === tab.id ? 'scale-110' : 'scale-100'} ${tab.id === 'ai' ? 'text-cyan-300' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] leading-none transition-all ${currentTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              
              {currentTab === tab.id && (
                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center px-3 ml-1 border-l border-white/10">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="group relative p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all active:rotate-45"
          aria-label="Trocar Tema"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-indigo-300 group-hover:drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]" />
          ) : (
            <Sun className="w-5 h-5 text-amber-300 group-hover:drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
