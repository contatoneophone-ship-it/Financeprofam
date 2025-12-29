
import React, { useState } from 'react';
import { Download, Filter, FileSpreadsheet, FileText, Printer, Calendar as CalendarIcon, User as UserIcon, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

const ReportManager: React.FC = () => {
  const { transactions, members, entities } = useApp();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMember, setFilterMember] = useState('all');

  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    const dateMatch = d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    const memberMatch = filterMember === 'all' || t.memberId === filterMember;
    return dateMatch && memberMatch;
  });

  const totals = filtered.reduce((acc, t) => {
    if (t.type === TransactionType.INCOME) acc.in += t.amount;
    else acc.out += t.amount;
    return acc;
  }, { in: 0, out: 0 });

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Membro', 'Pessoa/Empresa', 'Valor'];
    const rows = filtered.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.type,
      t.description,
      t.category,
      members.find(m => m.id === t.memberId)?.name || 'N/A',
      entities.find(e => e.id === t.entityId)?.name || 'N/A',
      t.amount.toFixed(2).replace('.', ',')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-financa-pro-${filterYear}-${filterMonth + 1}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedMemberName = filterMember === 'all' ? 'Todos os Membros' : members.find(m => m.id === filterMember)?.name;
  const currentMonthName = new Date(filterYear, filterMonth).toLocaleString('pt-BR', { month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Relatórios</h2>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Exportação e Análise Profissional</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={exportCSV} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Planilha CSV
          </button>
          <button 
            onClick={handlePrint} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            <Printer className="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-[2rem] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center print:hidden">
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
          <CalendarIcon className="text-white/40 w-4 h-4 ml-2" />
          <select value={filterMonth} onChange={e => setFilterMonth(parseInt(e.target.value))} className="w-full bg-transparent text-white border-none rounded-xl p-2 focus:ring-0 appearance-none text-sm font-bold cursor-pointer">
            {Array.from({length: 12}).map((_, i) => (
              <option key={i} value={i} className="text-black">{new Date(0, i).toLocaleString('pt-BR', {month: 'long'})}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
          <CalendarIcon className="text-white/40 w-4 h-4 ml-2" />
          <select value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))} className="w-full bg-transparent text-white border-none rounded-xl p-2 focus:ring-0 appearance-none text-sm font-bold cursor-pointer">
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y} className="text-black">{y}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
          <UserIcon className="text-white/40 w-4 h-4 ml-2" />
          <select value={filterMember} onChange={e => setFilterMember(e.target.value)} className="w-full bg-transparent text-white border-none rounded-xl p-2 focus:ring-0 appearance-none text-sm font-bold cursor-pointer">
            <option value="all" className="text-black">Todos os Membros</option>
            {members.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* Container Principal que será Impresso */}
      <div id="report-print-container" className="glass p-8 sm:p-12 rounded-[2.5rem] shadow-2xl bg-white/5 print:bg-white print:text-black print:p-0 print:shadow-none print:border-none print:m-0 print:block overflow-hidden">
        
        {/* Header Exclusivo para Impressão */}
        <div className="hidden print:flex justify-between items-center mb-10 border-b-2 border-black pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white p-3 rounded-2xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Finança Pro</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Relatório Financeiro Familiar</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase opacity-40">Período de Referência</p>
            <p className="text-lg font-black uppercase italic">{currentMonthName} / {filterYear}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 print:border-b-0">
          <div className="print:flex-1">
            <div className="flex items-center gap-3 mb-2 print:hidden">
              <FileText className="text-white w-10 h-10" />
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Demonstrativo</h1>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Status de Fluxo de Caixa</p>
              </div>
            </div>
            <div className="bg-white/5 print:bg-gray-50 p-4 rounded-2xl inline-block mt-4 print:mt-0 print:border print:border-gray-200">
              <p className="text-white/40 print:text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Membro Selecionado</p>
              <p className="text-white print:text-black font-bold text-sm uppercase tracking-tighter">{selectedMemberName}</p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-white/40 print:text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Saldo Líquido do Período</p>
            <h2 className={`text-5xl font-black tracking-tighter ${totals.in - totals.out >= 0 ? 'text-emerald-400 print:text-emerald-600' : 'text-rose-400 print:text-rose-600'}`}>
              R$ {(totals.in - totals.out).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </h2>
            <div className="flex items-center gap-2 mt-2 md:justify-end">
              <CheckCircle2 className={`w-4 h-4 ${totals.in - totals.out >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span className="text-[10px] text-white/40 print:text-gray-400 font-bold uppercase tracking-widest">Compilado e Validado</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 print:bg-emerald-50 print:border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-emerald-400 print:text-emerald-700 text-[10px] font-black uppercase tracking-widest">Total de Receitas</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-4xl font-black text-white print:text-emerald-900 tracking-tighter">R$ {totals.in.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
          <div className="bg-rose-500/10 p-8 rounded-[2rem] border border-rose-500/20 print:bg-rose-50 print:border-rose-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-rose-400 print:text-rose-700 text-[10px] font-black uppercase tracking-widest">Total de Despesas</p>
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-4xl font-black text-white print:text-rose-900 tracking-tighter">R$ {totals.out.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white/40 print:text-gray-400 text-[9px] font-black uppercase tracking-widest border-b border-white/10 print:border-black/20">
                <th className="py-5 px-4">Data</th>
                <th className="py-5 px-4">Descrição Detalhada</th>
                <th className="py-5 px-4">Categoria</th>
                <th className="py-5 px-4">Responsável</th>
                <th className="py-5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-white print:text-black">
              {filtered.map((t, idx) => (
                <tr key={t.id} className={`border-b border-white/5 print:border-gray-100 hover:bg-white/5 transition-all text-sm ${idx % 2 === 0 ? 'print:bg-gray-50/50' : ''}`}>
                  <td className="py-5 px-4 whitespace-nowrap font-mono">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-5 px-4 font-bold max-w-[250px] print:max-w-none">
                    {t.description}
                    {t.currentInstallment && <span className="ml-2 text-[10px] text-white/30 print:text-gray-400 font-medium">({t.currentInstallment}/{t.installments})</span>}
                  </td>
                  <td className="py-5 px-4">
                    <span className="bg-white/5 print:bg-white print:border print:border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-5 px-4 opacity-60 font-medium">{members.find(m => m.id === t.memberId)?.name || '-'}</td>
                  <td className={`py-5 px-4 text-right font-black ${t.type === TransactionType.INCOME ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-rose-700'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
              <FileText className="w-12 h-12 text-white/10" />
            </div>
            <p className="text-white/20 print:text-gray-300 font-black uppercase tracking-[0.3em] italic">Nenhum registro encontrado</p>
          </div>
        )}

        <div className="hidden print:flex justify-between items-center mt-20 pt-10 border-t border-black/10 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          <div>
            Gerado eletronicamente em {new Date().toLocaleString('pt-BR')}
          </div>
          <div>
            Finança Pro • Gestão Patrimonial Familiar
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: A4 portrait;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            color: black !important;
          }

          #root {
            background: white !important;
          }

          /* Reset de todos os elementos interativos e de navegação */
          nav, header, footer, .print\\:hidden, button, select, input, aside, .mesh-gradient {
            display: none !important;
            visibility: hidden !important;
          }

          /* Posicionamento do container de relatório no topo */
          #report-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            display: block !important;
            z-index: 999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Garantia de que a tabela não quebre de forma feia entre páginas */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }

          /* Melhoria de legibilidade para fontes escuras no PDF */
          .text-white { color: black !important; }
          .text-white\\/40 { color: #666 !important; }
          .text-white\\/50 { color: #444 !important; }
          .glass { 
            background: white !important; 
            backdrop-filter: none !important; 
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Cores de status forçadas para o PDF */
          .text-emerald-400, .text-emerald-600 { color: #065f46 !important; }
          .text-rose-400, .text-rose-600 { color: #9f1239 !important; }
        }
      `}</style>
    </div>
  );
};

export default ReportManager;
