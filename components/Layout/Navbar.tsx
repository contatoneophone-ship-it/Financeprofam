
import React from 'react';
import { Sun, Moon, Users, CreditCard, LayoutDashboard, History, FileText, Building2, Target, Settings } from 'lucide-react';
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
    { id: 'inv', label: 'Patrimônio', icon: <Target className="w-5 h-5" /> },
    { id: 'rep', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
    { id: 'cards', label: 'Cartões', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'members', label: 'Família', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-3xl glass rounded-3xl px-4 py-3 flex items-center justify-between shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar flex-1 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${
              currentTab === tab.id 
                ? 'bg-white/20 text-white shadow-inner scale-105' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="text-[8px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="ml-2 pl-2 border-l border-white/20">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
