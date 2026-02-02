
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Globe, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../../context/AppContext';
import { TransactionType, CategoryType } from '../../types';

const AIInsights: React.FC = () => {
  const { transactions, members, goals } = useApp();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const currentMonth = new Date().getMonth();
      const summary = {
        totalIncome: members.reduce((acc, m) => acc + m.income, 0) + 
                     transactions.filter(t => t.type === TransactionType.INCOME && new Date(t.date).getMonth() === currentMonth).reduce((acc, t) => acc + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).getMonth() === currentMonth).reduce((acc, t) => acc + t.amount, 0),
        invested: transactions.filter(t => t.type === TransactionType.INVESTMENT && new Date(t.date).getMonth() === currentMonth).reduce((acc, t) => acc + t.amount, 0),
        goals: goals.map(g => ({ name: g.name, progress: (g.currentTotal / g.targetTotal) * 100 })),
        recentExpenses: transactions.filter(t => t.type === TransactionType.EXPENSE).slice(0, 5).map(t => ({ desc: t.description, category: t.category, amount: t.amount }))
      };

      const prompt = `Analise os seguintes dados financeiros da família para o mês atual:
      - Renda Total: R$ ${summary.totalIncome.toFixed(2)}
      - Gastos Totais: R$ ${summary.totalExpenses.toFixed(2)}
      - Valor Investido: R$ ${summary.invested.toFixed(2)}
      - Status das Metas: ${JSON.stringify(summary.goals)}
      - Últimos gastos: ${JSON.stringify(summary.recentExpenses)}

      Retorne um JSON com a seguinte estrutura:
      {
        "status": "string (Saudável, Alerta ou Crítico)",
        "headline": "string curta impactante",
        "analysis": "parágrafo curto de análise",
        "tips": ["tip 1", "tip 2", "tip 3"],
        "recommendation": "string (sugestão de investimento ou corte)",
        "marketInfo": "string sobre o cenário econômico brasileiro atual"
      }
      Seja encorajador e profissional. Use gírias de investidores brasileiros se apropriado.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        },
      });

      const data = JSON.parse(response.text || '{}');
      setInsight(data);
    } catch (err) {
      console.error(err);
      setError("Não consegui acessar os astros financeiros agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!insight) generateInsight();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
            Genius AI <Sparkles className="text-cyan-400 animate-pulse" />
          </h2>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Consultoria Estratégica Familiar</p>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="glass p-12 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
            <BrainCircuit className="w-20 h-20 text-cyan-400 animate-bounce relative z-10" />
          </div>
          <h3 className="text-2xl font-black text-white italic animate-pulse">PROCESSANDO PATRIMÔNIO...</h3>
          <p className="text-white/40 max-w-xs uppercase text-[10px] font-bold tracking-widest">
            Cruzando dados de gastos, investimentos e mercado em tempo real.
          </p>
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Insight Card */}
          <div className="lg:col-span-2 glass p-8 rounded-[3rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/5 to-cyan-500/5">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                  insight.status === 'Saudável' ? 'bg-emerald-500/20 text-emerald-400' : 
                  insight.status === 'Alerta' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  Status: {insight.status}
                </span>
                <h3 className="text-4xl font-black text-white italic tracking-tighter mt-4 leading-none">{insight.headline}</h3>
              </div>
              <TrendingUp className="text-white/10 w-24 h-24 absolute -right-4 -top-4 rotate-12" />
            </div>

            <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium">
              {insight.analysis}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insight.tips.map((tip: string, i: number) => (
                <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <Lightbulb className="text-cyan-400 w-5 h-5 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white/60 text-xs font-bold leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-cyan-400 w-5 h-5" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Contexto de Mercado</h4>
              </div>
              <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                "{insight.marketInfo}"
              </p>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-amber-400 w-5 h-5" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Recomendação Pro</h4>
              </div>
              <p className="text-white font-black text-lg italic tracking-tight mb-2">
                {insight.recommendation}
              </p>
              <button className="w-full bg-white text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Aplicar Estratégia
              </button>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="glass p-20 rounded-[3rem] text-center">
          <AlertTriangle className="text-rose-500 w-16 h-16 mx-auto mb-6" />
          <p className="text-white font-black uppercase tracking-widest">{error}</p>
          <button onClick={generateInsight} className="mt-8 bg-white text-black px-8 py-3 rounded-2xl font-black">Tentar Novamente</button>
        </div>
      ) : null}

      {/* Grounding Sources Mockup / Footer */}
      {insight && (
        <div className="flex items-center justify-center gap-6 py-8 opacity-30">
          <div className="h-[1px] bg-white/20 flex-1" />
          <span className="text-[9px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">Powered by Gemini Engine & Real-time Grounding</span>
          <div className="h-[1px] bg-white/20 flex-1" />
        </div>
      )}
    </div>
  );
};

export default AIInsights;
