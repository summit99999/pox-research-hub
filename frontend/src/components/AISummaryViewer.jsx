import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  FlaskConical, 
  CheckCircle, 
  BookOpen, 
  Layers, 
  BarChart2, 
  Sliders, 
  Activity, 
  Compass, 
  ShieldAlert,
  ArrowRight,
  Database,
  Atom,
  Binary
} from 'lucide-react';
import { api } from '../lib/api';
import ChemicalStructureViewer from './ChemicalStructureViewer';
import ReactionSchemeViewer from './ReactionSchemeViewer';

export default function AISummaryViewer({ paper, onClose }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, scheme, chemistry, results, values, outlook
  const [schemeViewMode, setSchemeViewMode] = useState('both'); // both, scheme, structures

  useEffect(() => {
    if (paper?.id) {
      loadSummary();
    }
  }, [paper?.id]);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSummary(paper.id);
      setSummaryData(res.summary);
    } catch (err) {
      // 404 or "No AI summary" means not yet generated
      if (err.status === 404 || (err.message && (err.message.includes('404') || err.message.toLowerCase().includes('no ai summary')))) {
        setSummaryData(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await api.generateSummary(paper.id);
      setSummaryData(res.summary);
    } catch (err) {
      setError(err.message || 'Failed to generate AI summary with Gemini.');
    } finally {
      setGenerating(false);
    }
  };

  const s = summaryData;

  const renderTextOrList = (val) => {
    if (!val) return <p className="text-slate-400 italic">Not reported in the accessible source.</p>;
    if (Array.isArray(val)) {
      return (
        <ul className="space-y-1.5 list-disc list-inside">
          {val.map((item, idx) => (
            <li key={idx} className="text-slate-200 leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-slate-200 leading-relaxed whitespace-pre-line">{val}</p>;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              AI Scientific Evaluation (13 Structured Sections)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            Grounded evaluation for: <span className="text-slate-200 font-medium">{paper.title}</span>
          </p>
        </div>

        {summaryData && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin text-purple-400' : ''}`} />
            <span>{generating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>
        )}
      </div>

      {/* Critical Verification Notice */}
      <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg flex items-start gap-2.5 text-xs text-indigo-200">
        <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
        <div>
          <span className="font-semibold">Scientific Accuracy Protocol:</span> The AI synthesizes reported findings and extracts experimental values. It does not fabricate missing data. Unreported values are explicitly marked.
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Checking cloud repository for existing AI summary...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Evaluation Error
          </div>
          <p className="mb-3">{error}</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors"
          >
            Try Generating Again
          </button>
        </div>
      )}

      {/* Not Yet Generated State (Prompt & 1-Click Action) */}
      {!loading && !summaryData && !error && (
        <div className="py-12 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            No Summary Generated Yet
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Extract research objectives, CROP polymerization conditions, characterization methods, experimental values (Mn, Đ, cloud points, release rates), limitations, and relevance to the POx field.
          </p>
          <div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemini (13 Sections)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 13-Section AI Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Render 13 Structured Sections */}
      {s && !loading && (
        <div className="space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'overview', label: '1. Overview & Objective' },
              { id: 'scheme', label: '2. Chemical Structure & Scheme' },
              { id: 'chemistry', label: '3. Polymer System & CROP' },
              { id: 'results', label: '4. Results & Novelty' },
              { id: 'values', label: '5. Experimental Metrics (Values)' },
              { id: 'outlook', label: '6. Limitations & Future Directions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-teal-300 font-semibold bg-teal-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.id === 'scheme' && <Atom className="w-3.5 h-3.5 text-teal-400" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & OBJECTIVE */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              {/* Quick Jump to Structure & Scheme */}
              <div 
                onClick={() => setActiveTab('scheme')}
                className="p-3 rounded-xl bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-slate-900 border border-teal-500/30 hover:border-teal-400/60 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    <Atom className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">
                      Chemical Structure & CROP Reaction Scheme Ready
                    </span>
                    <span className="text-[11px] text-slate-400">
                      View monomer 2D depictions, living cationic polymerization steps, and repeat unit structures.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-teal-400 text-xs font-semibold shrink-0">
                  <span>Explore Scheme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 1. Bibliographic Info */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  1. Bibliographic Reference
                </h4>
                <div className="text-sm font-medium text-slate-100">
                  {s.bibliographic_info?.full_title || paper.title}
                </div>
                <div className="text-slate-400 mt-1">
                  {s.bibliographic_info?.authors?.join(', ') || paper.authors?.map(a => a.name).join(', ')} — <span className="italic text-slate-300">{s.bibliographic_info?.journal || paper.journal}</span> ({s.bibliographic_info?.publication_year || paper.publication_year})
                </div>
                {(s.bibliographic_info?.doi || paper.doi) && (
                  <div className="mt-2 font-mono text-teal-400">
                    DOI: {s.bibliographic_info?.doi || paper.doi}
                  </div>
                )}
              </div>

              {/* 2. Research Background */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  2. Research Background
                </h4>
                {renderTextOrList(s.research_background)}
              </div>

              {/* 3. Research Objective */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  3. Research Objective
                </h4>
                {renderTextOrList(s.research_objective)}
              </div>

              {/* 4. Research Gap */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  4. Addressed Research Gap
                </h4>
                {renderTextOrList(s.research_gap)}
              </div>
            </div>
          )}

          {/* TAB 2: CHEMICAL STRUCTURE & SCHEME */}
          {activeTab === 'scheme' && (
            <div className="space-y-6 text-xs">
              {/* Toggle Switch between Scheme & Structures */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    <Atom className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Molecular Structures & Synthetic Scheme
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Oxazoline / oxazine monomer 2D structures, living CROP reaction mechanism & polymer architecture
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] self-end sm:self-auto">
                  <button
                    onClick={() => setSchemeViewMode('both')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      schemeViewMode === 'both' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSchemeViewMode('scheme')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      schemeViewMode === 'scheme' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Reaction Scheme
                  </button>
                  <button
                    onClick={() => setSchemeViewMode('structures')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      schemeViewMode === 'structures' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2D Structures
                  </button>
                </div>
              </div>

              {/* Reaction Scheme Section */}
              {(schemeViewMode === 'both' || schemeViewMode === 'scheme') && (
                <ReactionSchemeViewer
                  scheme={s.reaction_scheme || s.polymer_and_chemical_system?.reaction_scheme}
                  polymerSystem={s.polymer_and_chemical_system}
                  experimentalValues={s.important_experimental_values}
                />
              )}

              {/* Chemical Structure Gallery Section */}
              {(schemeViewMode === 'both' || schemeViewMode === 'structures') && (
                <div className="pt-2">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold uppercase tracking-wider text-teal-400 text-xs flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" />
                      2D Chemical Structures & Monomer Library
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      PubChem PUG REST + High-Res SVG Vectors
                    </span>
                  </div>
                  <ChemicalStructureViewer
                    structures={s.chemical_structures || s.polymer_and_chemical_system?.chemical_structures}
                    polymerSystem={s.polymer_and_chemical_system}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POLYMER SYSTEM & METHODOLOGY */}
          {activeTab === 'chemistry' && (
            <div className="space-y-4 text-xs">
              {/* 5. Polymer and Chemical System */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold uppercase tracking-wider text-teal-400">
                    5. Polymer and Chemical System
                  </h4>
                  <button
                    onClick={() => setActiveTab('scheme')}
                    className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>View Chemical Structures & Scheme</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Polymer Type:</span>
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.polymer_type || 'Not reported'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Initiator(s):</span>
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.initiators || 'Not reported'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Monomers:</span>
                    <span className="text-slate-200">
                      {Array.isArray(s.polymer_and_chemical_system?.monomers) 
                        ? s.polymer_and_chemical_system.monomers.join(', ') 
                        : s.polymer_and_chemical_system?.monomers || 'Not reported'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Architecture:</span>
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.block_architecture || 'Not reported'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Molecular Weight & Dispersity:</span>
                    <span className="text-slate-200 font-mono">{s.polymer_and_chemical_system?.molecular_weight_dispersity || 'Not reported'}</span>
                  </div>
                </div>
              </div>

              {/* 6. Experimental Methodology */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  6. Experimental Methodology (CROP / Synthesis Conditions)
                </h4>
                {renderTextOrList(s.experimental_methodology)}
              </div>

              {/* 7. Characterization Techniques */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  7. Characterization Techniques Identified
                </h4>
                <div className="flex flex-wrap gap-2">
                  {s.characterization_techniques?.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {(!s.characterization_techniques || s.characterization_techniques.length === 0) && (
                    <span className="text-slate-400">None explicitly listed in accessible source.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS & NOVELTY */}
          {activeTab === 'results' && (
            <div className="space-y-4 text-xs">
              {/* 8. Major Results */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  8. Major Experimental Findings
                </h4>
                {renderTextOrList(s.major_results)}
              </div>

              {/* 9. Scientific Novelty */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  9. Scientific Novelty
                </h4>
                {renderTextOrList(s.scientific_novelty)}
              </div>

              {/* 12. Relevance to POx Research */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  12. Relevance to Poly(2-oxazoline) / Poly(2-oxazine) Research
                </h4>
                {renderTextOrList(s.relevance_to_pox_research)}
              </div>
            </div>
          )}

          {/* TAB 4: IMPORTANT EXPERIMENTAL VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold uppercase tracking-wider text-teal-400">
                    13. Extracted Experimental Values & Metrics
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Grounded Extraction
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Molecular Weight (Mn / Mw)', val: s.important_experimental_values?.molecular_weight },
                    { label: 'Dispersity (Đ)', val: s.important_experimental_values?.dispersity },
                    { label: 'Conversion (%)', val: s.important_experimental_values?.conversion },
                    { label: 'Yield (%)', val: s.important_experimental_values?.yield_percentage },
                    { label: 'Cloud Point (LCST / UCST)', val: s.important_experimental_values?.cloud_point_lcst_ucst },
                    { label: 'Particle Size (Hydrodynamic Diam.)', val: s.important_experimental_values?.particle_size },
                    { label: 'Critical Micelle Conc. (CMC)', val: s.important_experimental_values?.cmc },
                    { label: 'Drug Loading Capacity', val: s.important_experimental_values?.drug_loading },
                    { label: 'Release Percentage (%)', val: s.important_experimental_values?.release_percentage },
                    { label: 'Reaction Temp & Time', val: s.important_experimental_values?.reaction_temperature_time },
                    { label: 'Biological Activity / IC50', val: s.important_experimental_values?.biological_activity }
                  ].map((metric, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 block font-medium truncate">
                        {metric.label}
                      </span>
                      <span className={`mt-1 block font-mono ${
                        metric.val && !metric.val.toLowerCase().includes('not reported')
                          ? 'text-teal-300 font-semibold' 
                          : 'text-slate-400 italic'
                      }`}>
                        {metric.val || 'Not reported'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIMITATIONS & FUTURE OUTLOOK */}
          {activeTab === 'outlook' && (
            <div className="space-y-4 text-xs">
              {/* 10. Limitations (Distinguishing author vs AI inferred) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  10. Critical Limitations
                </h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 font-semibold block mb-1">
                      Directly Reported by Authors:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {s.limitations?.author_reported_limitations || 'None explicitly stated in the accessible source.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-amber-400 font-semibold block mb-1">
                      AI Analytical Interpretation / Inferred Scope Limits:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {s.limitations?.ai_inferred_limitations || 'Accessible publication content was evaluated.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 11. Future Research Opportunities */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  11. Concrete Future Research Directions
                </h4>
                <ul className="space-y-2">
                  {s.future_research_opportunities?.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                  {(!s.future_research_opportunities || s.future_research_opportunities.length === 0) && (
                    <span className="text-slate-400">None generated.</span>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
