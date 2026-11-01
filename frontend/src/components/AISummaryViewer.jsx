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
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';

export default function AISummaryViewer({ paper, onClose }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, chemistry, results, values

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
      // 404 means not yet generated
      if (err.message && err.message.includes('404')) {
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
      setError(err.message || 'Failed to generate AI summary.');
    } finally {
      setGenerating(false);
    }
  };

  const s = summaryData;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              AI Scientific Evaluation (13 Structured Sections)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded evaluation for: <span className="text-slate-200 font-medium">{paper.title}</span>
          </p>
        </div>

        {summaryData && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {/* Critical Verification Notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-xs text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold">Scientific Accuracy Protocol:</span> The AI synthesizes reported findings and extracts experimental values. It does not fabricate missing data. Unreported values are explicitly marked. Verify against the primary text before citation.
        </div>
      </div>

      {/* Loading or Uncreated State */}
      {loading && (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading scientific evaluation...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Evaluation Error
          </div>
          <p>{error}</p>
        </div>
      )}

      {!loading && !summaryData && !error && (
        <div className="py-12 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            Generate 13-Section Scientific Summary
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Extract research objectives, CROP polymerization conditions, characterization methods, experimental values (Mw, Đ, cloud points, release rates), limitations, and relevance to the POx field.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2 transition-all"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Publication with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Scientific Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Render 13 Structured Sections */}
      {s && (
        <div className="space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: 'overview', label: '1. Overview & Objective' },
              { id: 'chemistry', label: '2. Polymer System & Methods' },
              { id: 'results', label: '3. Results & Novelty' },
              { id: 'values', label: '4. Experimental Metrics (Values)' },
              { id: 'outlook', label: '5. Limitations & Future Directions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-teal-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & OBJECTIVE */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* 1. Bibliographic Info */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  1. Bibliographic Reference
                </h4>
                <div className="text-sm font-medium text-slate-100">
                  {s.bibliographic_info?.full_title}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {s.bibliographic_info?.authors?.join(', ')} — <span className="italic text-slate-300">{s.bibliographic_info?.journal}</span> ({s.bibliographic_info?.publication_year})
                </div>
                {s.bibliographic_info?.doi && (
                  <div className="mt-2 text-xs font-mono text-teal-400">
                    DOI: {s.bibliographic_info.doi}
                  </div>
                )}
              </div>

              {/* 2. Research Background */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  2. Research Background
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.research_background}
                </p>
              </div>

              {/* 3. Research Objective */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  3. Research Objective
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {s.research_objective}
                </p>
              </div>

              {/* 4. Research Gap */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  4. Addressed Research Gap
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.research_gap}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: POLYMER SYSTEM & METHODOLOGY */}
          {activeTab === 'chemistry' && (
            <div className="space-y-4">
              {/* 5. Polymer and Chemical System */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  5. Polymer and Chemical System
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Polymer Type:</span>
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.polymer_type}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Initiator(s):</span>
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.initiators}</span>
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
                    <span className="text-slate-200">{s.polymer_and_chemical_system?.block_architecture}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Molecular Weight & Dispersity:</span>
                    <span className="text-slate-200 font-mono">{s.polymer_and_chemical_system?.molecular_weight_dispersity}</span>
                  </div>
                </div>
              </div>

              {/* 6. Experimental Methodology */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  6. Experimental Methodology
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {s.experimental_methodology}
                </p>
              </div>

              {/* 7. Characterization Techniques */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  7. Characterization Techniques Identified
                </h4>
                <div className="flex flex-wrap gap-2">
                  {s.characterization_techniques?.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {(!s.characterization_techniques || s.characterization_techniques.length === 0) && (
                    <span className="text-xs text-slate-400">None explicitly listed in accessible text.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS & NOVELTY */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              {/* 8. Major Results */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  8. Major Experimental Findings
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {s.major_results}
                </p>
              </div>

              {/* 9. Scientific Novelty */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  9. Scientific Novelty
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.scientific_novelty}
                </p>
              </div>

              {/* 12. Relevance to POx Research */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                  12. Relevance to POx / POzi Research
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.relevance_to_pox_research}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: IMPORTANT EXPERIMENTAL VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
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
                      <span className={`text-xs mt-1 block font-mono ${
                        metric.val && !metric.val.includes('Not reported')
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
            <div className="space-y-4">
              {/* 10. Limitations (Distinguishing author vs AI inferred) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  10. Critical Limitations
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 font-semibold block mb-1">
                      Directly Reported by Authors:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {s.limitations?.author_reported_limitations || 'None explicitly stated in the accessible text.'}
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3">
                  11. Concrete Future Research Directions
                </h4>
                <ul className="space-y-2 text-xs">
                  {s.future_research_opportunities?.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                  {(!s.future_research_opportunities || s.future_research_opportunities.length === 0) && (
                    <span className="text-xs text-slate-400">None generated.</span>
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
