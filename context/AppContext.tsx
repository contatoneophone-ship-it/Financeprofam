
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Member, Card, Transaction, TransactionType, Entity, InvestmentGoal, UserAccount } from '../types';
import { INITIAL_MEMBERS } from '../constants';

interface AppContextType extends AppState {
  setTheme: (theme: 'light' | 'dark') => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addUserAccount: (user: UserAccount) => void;
  removeUserAccount: (id: string) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  addEntity: (entity: Entity) => void;
  removeEntity: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  addGoal: (goal: InvestmentGoal) => void;
  removeGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('financa_pro_v3_data');
    const defaultUsers: UserAccount[] = [
      { id: 'admin', username: 'ADMIN', name: 'Administrador', password: '123' }
    ];

    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...parsed, 
        isAuthenticated: false, 
        currentUser: null,
        users: parsed.users || defaultUsers
      };
    }
    return {
      members: INITIAL_MEMBERS,
      cards: [],
      entities: [],
      transactions: [],
      goals: [],
      users: defaultUsers,
      theme: 'dark',
      isAuthenticated: false,
      currentUser: null
    };
  });

  useEffect(() => {
    const { isAuthenticated, currentUser, ...dataToSave } = state;
    localStorage.setItem('financa_pro_v3_data', JSON.stringify(dataToSave));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const login = (username: string, pass: string) => {
    const foundUser = state.users.find(
      u => u.username.toUpperCase() === username.toUpperCase() && u.password === pass
    );

    if (foundUser) {
      setState(prev => ({ ...prev, isAuthenticated: true, currentUser: foundUser }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false, currentUser: null }));
  };

  const addUserAccount = (user: UserAccount) => {
    setState(prev => ({ ...prev, users: [...prev.users, user] }));
  };

  const removeUserAccount = (id: string) => {
    if (id === 'admin') return; // Proteção para o admin principal
    setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  };

  const setTheme = (theme: 'light' | 'dark') => setState(prev => ({ ...prev, theme }));

  const addMember = (member: Member) => setState(prev => ({ ...prev, members: [...prev.members, member] }));
  const removeMember = (id: string) => setState(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
  const addCard = (card: Card) => setState(prev => ({ ...prev, cards: [...prev.cards, card] }));
  const removeCard = (id: string) => setState(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
  const addEntity = (entity: Entity) => setState(prev => ({ ...prev, entities: [...prev.entities, entity] }));
  const removeEntity = (id: string) => setState(prev => ({ ...prev, entities: prev.entities.filter(e => e.id !== id) }));
  
  const addGoal = (goal: InvestmentGoal) => setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  const removeGoal = (id: string) => setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));

  const updateGoalProgress = (id: string, amount: number) => setState(prev => ({
    ...prev,
    goals: prev.goals.map(g => g.id === id ? { ...g, currentTotal: g.currentTotal + amount } : g)
  }));

  const addTransaction = (transaction: Transaction) => {
    let newTransactions = [transaction];
    if (transaction.installments && transaction.installments > 1 && transaction.type === TransactionType.EXPENSE) {
      const parentId = transaction.id;
      const baseDate = new Date(transaction.date);
      const monthlyAmount = transaction.amount / transaction.installments;
      newTransactions[0].amount = monthlyAmount;
      newTransactions[0].currentInstallment = 1;
      newTransactions[0].parentId = parentId;

      for (let i = 2; i <= transaction.installments; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setMonth(baseDate.getMonth() + (i - 1));
        newTransactions.push({
          ...transaction,
          id: `${parentId}-${i}`,
          amount: monthlyAmount,
          date: nextDate.toISOString().split('T')[0],
          currentInstallment: i,
          parentId: parentId
        });
      }
    }

    if (transaction.type === TransactionType.INVESTMENT && transaction.goalId) {
      updateGoalProgress(transaction.goalId, transaction.amount);
    }

    setState(prev => ({ ...prev, transactions: [...prev.transactions, ...newTransactions] }));
  };

  const removeTransaction = (id: string) => setState(prev => {
    const t = prev.transactions.find(trans => trans.id === id);
    if (t?.type === TransactionType.INVESTMENT && t.goalId) {
      return {
        ...prev,
        transactions: prev.transactions.filter(trans => trans.id !== id),
        goals: prev.goals.map(g => g.id === t.goalId ? { ...g, currentTotal: g.currentTotal - t.amount } : g)
      };
    }
    return {
      ...prev,
      transactions: prev.transactions.filter(trans => trans.id !== id)
    };
  });

  return (
    <AppContext.Provider value={{ 
      ...state, setTheme, login, logout, addUserAccount, removeUserAccount, addMember, removeMember, addCard, removeCard, 
      addEntity, removeEntity, addTransaction, removeTransaction,
      addGoal, removeGoal, updateGoalProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
