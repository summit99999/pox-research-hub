import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../lib/api';

const SAMPLE_FOCUS_AREAS = [
  "ROS-responsive Poly(2-oxazoline)s and thioether architectures",
  "Comparative CROP kinetics: 2-oxazoline vs 2-oxazine monomers",
  "Photoresponsive and photocleavable oxazoline copolymers",
  "Amino-acid-derived functional oxazoline monomers for gene delivery",
  "POx/POzi block copolymer micellar stability in human serum"
];

export default function GapFinderView() {
  const [focusArea, setFocusArea] = useState(SAMPLE_FOCUS_AREAS[0]);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [pastReports, setPastReports] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expandedGapIndex, setExpandedGapIndex] = useState(0);

  useEffect(() => {
    loadPastReports();
  }, []);

  const loadPastReports = async () => {
    try {
      const data = await api.getGapReports();
      setPastReports(data || []);
      if (data && data.length > 0 && !report) {
        setReport(data[0]);
      }
    } catch (e) {
      console.debug('Failed to load gap reports', e);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg(null);
    try {
      const newReport = await api.generateGapReport({ focus_area: focusArea });
      setReport(newReport);
      setExpandedGapIndex(0);
      await loadPastReports();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate research gap analysis');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Compass className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-slate-100">
            Evidence-Grounded Research Gap Discovery Engine
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          AI synthesis of indexed POx/POzi publications to uncover underexplored synthetic pathways, monomer structures, and biomedical opportunities.
        </p>
      </div>

      {/* Critical Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-teal-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Novelty & Evidence Disclaimer</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          All hypotheses are identified as <span className="text-teal-300 font-medium italic">"Potentially underexplored based on the currently indexed literature."</span> The engine never asserts absolute global novelty without peer review. Always check patent databases and specialized primary literature before initiating lab work.
        </p>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              Specify Research Focus Area
            </label>
            <input
              type="text"
              required
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. ROS-responsive polyoxazolines, thioether functional monomers, POzi vs POx..."
              className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none shadow-sm transition-colors"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Suggested Research Directions:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_FOCUS_AREAS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFocusArea(topic)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                    focusArea === topic 
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' 
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generating ? 'Analyzing Indexed Corpus with Gemini AI...' : 'Discover Research Gaps'}</span>
          </button>
        </form>
      </div>

      {/* Render Current Gap Report */}
      {report && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-100">{report.title}</h2>
              <span className="text-xs text-slate-400">
                Generated from indexed POx/POzi publications
              </span>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 border border-teal-800/60 px-2.5 py-1 rounded">
              {report.gaps?.length || 0} Gaps Proposed
            </span>
          </div>

          <div className="space-y-4">
            {report.gaps?.map((gap, idx) => {
              const isExpanded = expandedGapIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg transition-all"
                >
                  {/* Gap Header Accordion */}
                  <div 
                    onClick={() => setExpandedGapIndex(isExpanded ? -1 : idx)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/40 select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 hover:text-teal-300 transition-colors">
                          {gap.proposed_research_title}
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          gap.confidence_level === 'High' 
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-indigo-950 text-indigo-400 border-indigo-800'
                        }`}>
                          {gap.confidence_level} Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 ml-7">
                        {gap.what_appears_to_be_missing}
                      </p>
                    </div>

                    <button className="text-slate-400 hover:text-slate-200 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Gap Details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                      {/* What is Known vs Missing */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
                          <span className="font-semibold text-slate-300 block mb-1">
                            Current Indexed State of the Art:
                          </span>
                          <p className="text-slate-400 leading-relaxed">
                            {gap.what_is_already_known}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-800/40">
                          <span className="font-semibold text-teal-300 block mb-1">
                            Identified Unexplored Gap:
                          </span>
                          <p className="text-teal-200 leading-relaxed font-medium">
                            {gap.what_appears_to_be_missing}
                          </p>
                        </div>
                      </div>

                      {/* Scientific Rationale & Novelty */}
                      <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
                        <div>
                          <span className="font-semibold text-slate-300 block mb-0.5">Scientific Rationale:</span>
                          <p className="text-slate-400 leading-relaxed">{gap.scientific_rationale}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-700/50">
                          <span className="font-semibold text-indigo-300 block mb-0.5">Anticipated Scientific Novelty:</span>
                          <p className="text-slate-300 leading-relaxed">{gap.expected_novelty}</p>
                        </div>
                      </div>

                      {/* Proposed Experimental Strategy */}
                      <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
                        <span className="font-semibold text-teal-400 block mb-1">
                          Proposed Synthetic & Experimental Strategy:
                        </span>
                        <p className="text-slate-200 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                          {gap.proposed_experimental_strategy}
                        </p>
                      </div>

                      {/* Synthetic Challenges & Characterization Pathways */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <span className="font-semibold text-amber-300 block mb-1">
                            Potential Chemical / Synthetic Hurdles:
                          </span>
                          <p className="text-amber-200 leading-relaxed">
                            {gap.potential_challenges}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
                          <span className="font-semibold text-slate-300 block mb-1.5">
                            Recommended Characterization Techniques:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.recommended_characterization_techniques?.map((t, idx2) => (
                              <span key={idx2} className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-[10px] font-medium font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Supporting Citations & DOI Links */}
                      {gap.supporting_publications?.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-400 block mb-2">
                            Grounding Publications from Indexed Corpus:
                          </span>
                          <div className="space-y-1.5">
                            {gap.supporting_publications.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                                <span className="text-slate-300 truncate max-w-md">{p.title}</span>
                                {p.doi && (
                                  <a 
                                    href={`https://doi.org/${p.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-mono text-[11px]"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{p.doi}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
