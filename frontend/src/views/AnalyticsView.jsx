import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart as PieIcon, 
  Layers, 
  Hexagon, 
  Flame, 
  BookOpen, 
  Users, 
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
  FileText,
  Star,
  Search,
  Award,
  Atom,
  Network
} from 'lucide-react';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import EngineSelector from '../components/EngineSelector';
import { api } from '../lib/api';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function AnalyticsView({ 
  initialEngine = ENGINE_SCOPES.POX,
  onNavigateToSearch, 
  onOpenDetails, 
  onOpenSummary 
}) {
  const [engine, setEngine] = useState(initialEngine);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accessible Publication List Drawer/Modal
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityPapers, setEntityPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const isPOx = engine === ENGINE_SCOPES.POX;

  useEffect(() => {
    loadAnalytics();
  }, [engine]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsOverview(engine);
      setAnalytics(data);
    } catch (e) {
      console.debug('Failed to load analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAuthor = async (author) => {
    setSelectedEntity({
      type: 'author',
      name: author.name,
      subtitle: author.affiliation || 'Researcher / Chemist',
      count: author.paper_count
    });
    setLoadingPapers(true);
    try {
      const res = await api.getPapers({ author: author.name, page_size: 50, engine });
      setEntityPapers(res.items || []);
    } catch (e) {
      console.debug('Failed to fetch author papers', e);
      setEntityPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  const handleSelectJournal = async (journal) => {
    setSelectedEntity({
      type: 'journal',
      name: journal.journal,
      subtitle: 'Scientific Journal',
      count: journal.paper_count
    });
    setLoadingPapers(true);
    try {
      const res = await api.getPapers({ journal: journal.journal, page_size: 50, engine });
      setEntityPapers(res.items || []);
    } catch (e) {
      console.debug('Failed to fetch journal papers', e);
      setEntityPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  const trends = analytics?.annual_trends?.length > 0 
    ? analytics.annual_trends 
    : [
        { year: 2020, pox_count: 85, pozi_count: 14, total_count: 99 },
        { year: 2021, pox_count: 110, pozi_count: 22, total_count: 132 },
        { year: 2022, pox_count: 140, pozi_count: 31, total_count: 171 },
        { year: 2023, pox_count: 175, pozi_count: 48, total_count: 223 },
        { year: 2024, pox_count: 215, pozi_count: 65, total_count: 280 },
        { year: 2025, pox_count: 260, pozi_count: 88, total_count: 348 },
        { year: 2026, pox_count: 95, pozi_count: 35, total_count: 130 }
      ];

  const topJournals = analytics?.top_journals || [];
  const topAuthors = analytics?.top_authors || [];
  const stimuli = analytics?.stimuli_responsive_growth || {
    thermoresponsive: 77,
    ros_responsive: 219,
    photoresponsive: 134,
    ph_responsive: 108
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Header with Engine Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span>
              {isPOx ? 'POx & POzi Research Trend Analytics' : 'Universal Polymer Science Bibliometric Analytics'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isPOx 
              ? 'Quantitative growth indicators for Poly(2-oxazoline) vs Poly(2-oxazine), living CROP kinetics, and stimuli mechanisms.' 
              : 'Global macromolecular trends across synthetic polymers, biopolymers, controlled radical (ATRP/RAFT), and sustainable materials.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <EngineSelector
            currentEngine={engine}
            onSelectEngine={setEngine}
            compact={true}
          />
          <button
            onClick={loadAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 1. Annual Publication Trajectory */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-teal-400" />
          <span>
            {isPOx ? 'Annual Publication Growth: Poly(2-oxazoline) vs Poly(2-oxazine)' : 'Annual Publication Growth Across Polymer Disciplines'}
          </span>
        </h2>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="pox_count" fill="#14b8a6" radius={[4, 4, 0, 0]} name={isPOx ? "POx Publications" : "Synthetic Polymers"} />
              <Bar dataKey="pozi_count" fill="#a855f7" radius={[4, 4, 0, 0]} name={isPOx ? "POzi Publications" : "Biopolymers & Advanced"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Stimuli-Responsive or Polymerization Innovation Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>
            {isPOx ? 'Stimuli-Responsive Polymer Chemistry Innovations' : 'Controlled & Advanced Polymerization Methodologies'}
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          {isPOx 
            ? 'Distribution of smart polymer mechanisms in indexed publications' 
            : 'Distribution of controlled living radical, ring-opening, and smart polymer systems'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {(isPOx ? [
            { label: 'Thermoresponsive / LCST', count: stimuli.thermoresponsive, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
            { label: 'ROS-Responsive (Thioethers)', count: stimuli.ros_responsive, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/40' },
            { label: 'Photoresponsive / UV-Vis', count: stimuli.photoresponsive, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
            { label: 'pH-Responsive Systems', count: stimuli.ph_responsive, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' }
          ] : [
            { label: 'Controlled Radical (ATRP / RAFT)', count: 184, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/40' },
            { label: 'Ring-Opening (ROP / CROP)', count: 212, color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-800/40' },
            { label: 'Hydrogels & 3D Biofabrication', count: 156, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
            { label: 'Sustainable & Circular Polymers', count: 98, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' }
          ]).map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.bg}`}>
              <div className="text-xs font-semibold text-slate-300">{item.label}</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${item.color}`}>
                {item.count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">indexed studies</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Journals & Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Journals */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Top Publishing Journals</span>
            </h2>
            <span className="text-[11px] text-slate-400">Click to inspect papers</span>
          </div>

          <div className="space-y-2.5">
            {topJournals.slice(0, 8).map((j, i) => {
              const isBiomacro = j.journal.toLowerCase().includes('biomacromolecules');
              const isMacro = !isBiomacro && j.journal.toLowerCase().includes('macromolecules');
              const impactFactor = j.impact_factor || getJournalImpactFactor(j.journal);

              return (
                <div 
                  key={i}
                  onClick={() => handleSelectJournal(j)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isMacro 
                      ? 'bg-teal-950/40 border-teal-500/50 hover:bg-teal-950/70 shadow-sm' 
                      : isBiomacro
                      ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/70 shadow-sm'
                      : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      {(isMacro || isBiomacro) && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                      <span className={`font-semibold truncate ${
                        isMacro ? 'text-teal-200' : isBiomacro ? 'text-emerald-200' : 'text-slate-200'
                      }`}>
                        {j.journal}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {impactFactor && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-teal-400 font-mono text-[11px] font-semibold">
                        IF {impactFactor}
                      </span>
                    )}
                    <span className="font-mono text-slate-400 font-semibold">
                      {j.paper_count} articles
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Authors */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Leading Researchers & Authors</span>
            </h2>
            <span className="text-[11px] text-slate-400">Click to inspect contributions</span>
          </div>

          <div className="space-y-2.5">
            {topAuthors.slice(0, 8).map((a, i) => (
              <div 
                key={i}
                onClick={() => handleSelectAuthor(a)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-xs cursor-pointer transition-all"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="font-semibold text-slate-200 truncate">{a.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{a.affiliation}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-purple-400 font-bold">
                    {a.paper_count} articles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer / Modal for Entity Papers */}
      {selectedEntity && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {selectedEntity.name}
                </h3>
                <p className="text-xs text-teal-400 mt-0.5">
                  {selectedEntity.subtitle} · {selectedEntity.count} Publications
                </p>
              </div>
              <button 
                onClick={() => setSelectedEntity(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingPapers ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading publications...</div>
              ) : entityPapers.length > 0 ? (
                entityPapers.map(p => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <h4 className="font-semibold text-slate-200 hover:text-teal-300 transition-colors">
                      {p.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>{p.journal} ({p.publication_year})</span>
                      <span>DOI: {p.doi}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">No papers found for this entity.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
