
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileSpreadsheet, FileText, Printer, Calendar as CalendarIcon, 
  User as UserIcon, Activity, ShieldCheck, PieChart, 
  Globe, Clock, AlertCircle, TrendingUp, TrendingDown,
  CalendarRange, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, CategoryType } from '../../types';

const ReportManager: React.FC = () => {
  const { transactions, members } = useApp();
  
  // Estados de Filtro
  const [filterMode, setFilterMode] = useState<'monthly' | 'custom'>('monthly');
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [filterMember, setFilterMember] = useState('all');
  
  // Datas para Edição Manual
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filtragem Otimizada
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      let dateMatch = false;

      if (filterMode === 'monthly') {
        const monthMatch = filterMonth === -1 || d.getMonth() === filterMonth;
        const yearMatch = filterYear === -1 || d.getFullYear() === filterYear;
        dateMatch = monthMatch && yearMatch;
      } else {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Garantir que as horas não interfiram na comparação de dias
        const txDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const sDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const eDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        dateMatch = txDate >= sDate && txDate <= eDate;
      }

      const memberMatch = filterMember === 'all' || t.memberId === filterMember;
      return dateMatch && memberMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterMode, filterMonth, filterYear, startDate, endDate, filterMember]);

  // Cálculos Financeiros
  const stats = useMemo(() => {
    return filteredData.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) acc.income += t.amount;
      else if (t.type === TransactionType.EXPENSE) acc.expense += t.amount;
      else if (t.type === TransactionType.INVESTMENT) acc.invested += t.amount;
      return acc;
    }, { income: 0, expense: 0, invested: 0 });
  }, [filteredData]);

  const netBalance = stats.income - stats.expense - stats.invested;
  const savingsRate = stats.income > 0 ? ((stats.invested + netBalance) / stats.income) * 100 : 0;

  // Ranking de Categorias para o Report
  const categoryRanking = useMemo(() => {
    const counts = filteredData
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc: Record<string, number>, t) => {
        const key = t.category as string;
        // Fix arithmetic operation errors by explicitly ensuring number types
        const currentAmount: number = acc[key] || 0;
        acc[key] = currentAmount + (t.amount as number);
        return acc;
      }, {} as Record<string, number>);
    
    // Explicitly cast values to number for the arithmetic subtraction in sort
    return Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number));
  }, [filteredData]);

  // Função de Download de PDF (via Print do Browser otimizado)
  const handleDownloadPDF = () => {
    // 1. Definir o título dinâmico que será usado como nome do arquivo no "Salvar como PDF"
    const originalTitle = document.title;
    const period = filterMode === 'monthly' 
      ? (filterMonth === -1 ? 'HISTORICO_GERAL' : `${filterMonth + 1}_${filterYear}`) 
      : `${startDate.replace(/-/g, '')}_A_${endDate.replace(/-/g, '')}`;
    
    document.title = `RELATORIO_FINANCEIRO_PRO_${period}`;
    
    // 2. Chamar o comando de impressão
    // O CSS @media print cuidará de esconder o lixo visual e formatar o relatório
    window.print();
    
    // 3. Restaurar o título original
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Membro', 'Categoria', 'Descrição', 'Valor', 'Método'];
    const csvRows = filteredData.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.type,
      members.find(m => m.id === t.memberId)?.name || 'N/A',
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.paymentMethod
    ].join(';'));

    const csvContent = "\ufeff" + [headers.join(';'), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `extrato_financeiro_pro_${new Date().getTime()}.csv`);
    link.click();
  };

  const currentPeriodLabel = filterMode === 'monthly' 
    ? (filterMonth === -1 ? "Histórico Completo" : `${new Date(filterYear, filterMonth).toLocaleString('pt-BR', { month: 'long' })} / ${filterYear}`)
    : `De ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`;

  return (
    <div className="space-y-6 pb-20">
      {/* Controles Superiores */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden animate-in fade-in duration-500">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Relatórios Inteligentes</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Exporte e Analise seu Patrimônio</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={exportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Exportar Planilha
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-white/90 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>

      {/* Seção de Filtros */}
      <div className="glass p-6 rounded-[2.5rem] print:hidden space-y-6 border border-white/10 shadow-xl animate-in slide-in-from-top-4 duration-500">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterMode('monthly')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'monthly' ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Visão Mensal
          </button>
          <button 
            onClick={() => setFilterMode('custom')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'custom' ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}
          >
            <CalendarRange className="w-3.5 h-3.5" /> Intervalo Livre
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {filterMode === 'monthly' ? (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase ml-1">Mês de Referência</label>
                <select 
                  value={filterMonth} 
                  onChange={e => setFilterMonth(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all cursor-pointer"
                >
                  <option value={-1} className="text-black">Todos os Meses</option>
                  {Array.from({length: 12}).map((_, i) => (
                    <option key={i} value={i} className="text-black">{new Date(0, i).toLocaleString('pt-BR', {month: 'long'})}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase ml-1">Ano</label>
                <select 
                  value={filterYear} 
                  onChange={e => setFilterYear(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all cursor-pointer"
                >
                  <option value={-1} className="text-black">Todos os Anos</option>
                  {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase ml-1">Data Início (Edição Manual)</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase ml-1">Data Fim (Edição Manual)</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all cursor-pointer"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/40 uppercase ml-1">Filtro por Membro</label>
            <select 
              value={filterMember} 
              onChange={e => setFilterMember(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all cursor-pointer"
            >
              <option value="all" className="text-black">Toda a Família</option>
              {members.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
            </select>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <p className="text-[10px] text-white font-black uppercase tracking-widest">{filteredData.length} Itens</p>
            <p className="text-[8px] text-white/30 uppercase font-bold">No Período</p>
          </div>
        </div>
      </div>

      {/* ÁREA DO RELATÓRIO (O QUE SERÁ IMPRESSO) */}
      <div id="print-area" className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden bg-white/5 border border-white/10 print:bg-white print:text-black print:p-0 print:shadow-none print:m-0 print:rounded-none print:border-none">
        
        {/* Marca d'água / Cabeçalho para o PDF */}
        <div className="hidden print:flex justify-between items-center border-b-4 border-black pb-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="bg-black text-white p-5 rounded-[1.5rem]">
              <Activity className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Finança Pro</h1>
              <p className="text-[12px] font-black uppercase tracking-[0.4em] mt-2 opacity-50">Relatório Consolidado de Gestão</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">Extraído em {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-2xl font-black uppercase italic tracking-tighter">{currentPeriodLabel.toUpperCase()}</p>
          </div>
        </div>

        {/* Resumo de Saúde Financeira */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2 print:hidden">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Visão Geral</h3>
            </div>
            <div className="bg-white/5 print:bg-gray-100 border border-white/10 print:border-black/5 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="relative z-10">
                <p className="text-white/40 print:text-black/50 text-[10px] font-black uppercase tracking-widest mb-2">Taxa de Poupança / Aporte</p>
                <div className="flex items-baseline gap-4">
                  <h2 className={`text-7xl font-black italic tracking-tighter ${savingsRate >= 20 ? 'text-emerald-400 print:text-black' : 'text-amber-400 print:text-black'}`}>
                    {savingsRate.toFixed(1)}%
                  </h2>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${savingsRate >= 20 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <p className={`text-[11px] font-black uppercase tracking-tighter ${savingsRate >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {savingsRate >= 20 ? 'SAÚDE FINANCEIRA EXCELENTE' : 'APORTE ABAIXO DA META (20%)'}
                  </p>
                </div>
               </div>
               {/* Gráfico de fundo simples para print */}
               <div className="absolute right-[-10%] bottom-[-10%] opacity-10 print:hidden">
                 <Activity className="w-40 h-40 text-white" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-full">
             <div className="bg-emerald-500/10 print:border-2 print:border-black p-6 rounded-[2rem] flex flex-col justify-center border border-emerald-500/20">
                <p className="text-emerald-400 print:text-black text-[10px] font-black uppercase tracking-widest mb-1">Entradas</p>
                <p className="text-2xl font-black text-white print:text-black tracking-tighter">R$ {stats.income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
             </div>
             <div className="bg-rose-500/10 print:border-2 print:border-black p-6 rounded-[2rem] flex flex-col justify-center border border-rose-500/20">
                <p className="text-rose-400 print:text-black text-[10px] font-black uppercase tracking-widest mb-1">Saídas</p>
                <p className="text-2xl font-black text-white print:text-black tracking-tighter">R$ {stats.expense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
             </div>
             <div className="bg-blue-500/10 print:border-2 print:border-black p-6 rounded-[2rem] flex flex-col justify-center border border-blue-500/20 col-span-2">
                <p className="text-blue-400 print:text-black text-[10px] font-black uppercase tracking-widest mb-1">Aportes / Patrimônio</p>
                <p className="text-3xl font-black text-white print:text-black tracking-tighter italic">R$ {stats.invested.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
             </div>
          </div>
        </div>

        {/* Breakdown de Categorias */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <PieChart className="w-5 h-5 text-white/40 print:text-black" />
            <h3 className="text-[12px] font-black text-white/60 print:text-black uppercase tracking-widest italic">Breakdown por Categoria</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              {categoryRanking.slice(0, 6).map(([cat, val]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                    <span className="text-white/60 print:text-gray-600">{cat}</span>
                    <span className="text-white print:text-black">R$ {val.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-2 bg-white/5 print:bg-gray-100 rounded-full overflow-hidden border border-white/10 print:border-black/10">
                    <div 
                      className="h-full bg-white print:bg-black opacity-40 transition-all duration-1000" 
                      style={{ width: `${(val / (stats.expense || 1)) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
              {categoryRanking.length === 0 && <p className="text-xs text-white/20 italic font-medium uppercase tracking-widest">Sem despesas registradas.</p>}
            </div>
            <div className="hidden md:flex flex-col justify-center items-center bg-white/5 print:bg-gray-50 border border-white/5 print:border-black/5 rounded-[3rem] p-10 text-center">
               <AlertCircle className="w-12 h-12 text-white/10 print:text-black/20 mb-4" />
               <p className="text-[11px] text-white/40 print:text-gray-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                 O equilíbrio sugerido é de 50% para necessidades, 30% desejos e 20% aportes. Revise suas categorias.
               </p>
            </div>
          </div>
        </div>

        {/* Tabela Detalhada (Versão PDF) */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <Clock className="w-6 h-6 text-white/40 print:text-black" />
            <h3 className="text-[12px] font-black text-white/60 print:text-black uppercase tracking-widest italic">Detalhamento de Transações</h3>
          </div>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-white/40 print:text-black text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-white/20 print:border-black">
                  <th className="py-7 px-4">Data</th>
                  <th className="py-7 px-4">Titular</th>
                  <th className="py-7 px-4">Descrição do Lançamento</th>
                  <th className="py-7 px-4">Categoria</th>
                  <th className="py-7 px-4 text-right">Valor Final</th>
                </tr>
              </thead>
              <tbody className="text-white print:text-black">
                {filteredData.map((t, idx) => (
                  <tr key={t.id} className={`border-b border-white/5 print:border-gray-200 text-[11px] transition-all ${idx % 2 === 0 ? 'print:bg-gray-50/50' : ''} hover:bg-white/5`}>
                    <td className="py-6 px-4 whitespace-nowrap opacity-40 font-mono italic">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-6 px-4 font-bold uppercase tracking-tighter text-[10px]">{members.find(m => m.id === t.memberId)?.name || 'N/A'}</td>
                    <td className="py-6 px-4 uppercase font-black tracking-tighter leading-tight max-w-[200px]">
                      {t.description}
                      {t.currentInstallment && <span className="ml-2 text-[9px] text-white/30 print:text-black/40 font-normal">[{t.currentInstallment}/{t.installments}]</span>}
                    </td>
                    <td className="py-6 px-4 opacity-50 font-bold text-[9px] uppercase">{t.category}</td>
                    <td className={`py-6 px-4 text-right font-black tracking-tighter text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-400 print:text-black' : 'text-rose-400 print:text-black'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="py-32 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-white/10" />
              <p className="font-black uppercase tracking-[0.6em] text-white/20">Sem movimentações para o filtro aplicado</p>
            </div>
          )}
        </div>

        {/* Rodapé do PDF */}
        <div className="hidden print:flex justify-between items-center mt-24 pt-10 border-t-4 border-black text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
           <div className="flex flex-col gap-1">
             <p>FINANÇA PRO • GESTÃO FAMILIAR INTELIGENTE 2025</p>
             <p className="text-[8px] opacity-40">Security Hash: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
           </div>
           <div className="text-right">
             <p>Página 01 / 01</p>
           </div>
        </div>
      </div>

      <style>{`
        /* Motor de Estilos para Impressão de PDF */
        @media print {
          @page {
            margin: 1.5cm;
            size: A4 portrait;
          }
          
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Reset de Layout: Esconde TUDO que não é o relatório */
          #root > div > main > header,
          #root > div > nav,
          #root > div > .print\\:hidden,
          button, 
          select, 
          input, 
          .mesh-gradient,
          header,
          footer,
          nav,
          aside {
            display: none !important;
            visibility: hidden !important;
          }

          /* Reseta o efeito Glass para Papel */
          .glass {
            background: white !important;
            backdrop-filter: none !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }

          #print-area {
            background: white !important;
            color: black !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            display: block !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            position: relative !important;
          }

          /* Cores e Contraste Forçado */
          .text-white { color: black !important; }
          .text-white\\/40, .text-white\\/60, .text-white\\/30, .text-white\\/50 { color: #555 !important; }
          .text-emerald-400, .text-rose-400, .text-blue-400, .text-amber-400 { 
            color: black !important; 
            font-weight: 900 !important; 
          }
          
          /* Tabelas em PDF */
          table { 
            width: 100% !important; 
            border-collapse: collapse !important;
            page-break-inside: auto;
          }
          tr { 
            page-break-inside: avoid; 
            page-break-after: auto; 
          }
          thead { 
            display: table-header-group; 
          }
          
          /* Forçar renderização de fundos cinzas em tabelas */
          .print\\:bg-gray-50\\/50 { background-color: #f9fafb !important; }
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          .print\\:border-black { border-color: black !important; }
          
          h1, h2, h3, h4, p, span, td, th {
            color: black !important;
            text-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportManager;
