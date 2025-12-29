
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { TransactionType, CategoryType } from '../../types';
import { CATEGORY_COLORS } from '../../constants';

const Charts: React.FC = () => {
  const { transactions } = useApp();

  // Data for Category Distribution (Current Month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const categoryData = Object.values(CategoryType).map(cat => {
    const total = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === cat)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  // Data for Last 6 Months Comparison
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthName = d.toLocaleString('pt-BR', { month: 'short' });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === month && td.getFullYear() === year;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === month && td.getFullYear() === year;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    return { name: monthName, receita: income, despesa: expense };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-2 glass p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Comparativo Mensal</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="receita" fill="#34D399" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="despesa" fill="#F87171" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl shadow-xl flex flex-col">
        <h3 className="text-xl font-bold text-white mb-6">Gastos por Categoria</h3>
        <div className="h-[250px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as CategoryType]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
          {categoryData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name as CategoryType] }} />
              <span className="text-white/60 text-xs truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
