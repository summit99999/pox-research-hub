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
  ChevronUp,
  Atom,
  Network
} from 'lucide-react';
import EngineSelector from '../components/EngineSelector';
import { api } from '../lib/api';
import { ENGINE_SCOPES } from '../lib/searchEngine';

const POX_FOCUS_AREAS = [
  "ROS-responsive Poly(2-oxazoline)s and thioether architectures",
  "Comparative CROP kinetics: 2-oxazoline vs 2-oxazine monomers",
  "Photoresponsive and photocleavable oxazoline copolymers",
  "Amino-acid-derived functional oxazoline monomers for gene delivery",
  "POx/POzi block copolymer micellar stability in human serum"
];

const UNIVERSAL_FOCUS_AREAS = [
  "Chemical recycling and selective depolymerization of post-consumer polyesters",
  "Solid polymer electrolytes with high lithium transference number",
  "Sequence-controlled living radical polymerization of acrylics and styrenics",
  "Biodegradable PLA/PCL nanocomposites with tuned barrier properties",
  "Dynamic covalent adaptable networks (vitrimers) for self-healing elastomeric materials",
  "Antibacterial and non-cytotoxic chitosan hydrogels for accelerated wound dressing"
];

export default function GapFinderView({ initialEngine = ENGINE_SCOPES.POX }) {
  const [engine, setEngine] = useState(initialEngine);
  const [focusArea, setFocusArea] = useState(initialEngine === ENGINE_SCOPES.POX ? POX_FOCUS_AREAS[0] : UNIVERSAL_FOCUS_AREAS[0]);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [pastReports, setPastReports] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expandedGapIndex, setExpandedGapIndex] = useState(0);

  const isPOx = engine === ENGINE_SCOPES.POX;
  const sampleAreas = isPOx ? POX_FOCUS_AREAS : UNIVERSAL_FOCUS_AREAS;

  useEffect(() => {
    loadPastReports();
  }, [engine]);

  const loadPastReports = async () => {
    try {
      const data = await api.getAnalyticsOverview(engine).catch(() => null);
      // Generate default report if none exists
      const rep = await api.generateGapReport(focusArea, engine);
      setReport(rep);
    } catch (e) {
      console.debug('Failed to load gap reports', e);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg(null);
    try {
      const newReport = await api.generateGapReport(focusArea, engine);
      setReport(newReport);
      setExpandedGapIndex(0);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate research gap analysis');
    } finally {
      setGenerating(false);
    }
  };

  const handleSwitchEngine = (newEngine) => {
    setEngine(newEngine);
    const newArea = newEngine === ENGINE_SCOPES.POX ? POX_FOCUS_AREAS[0] : UNIVERSAL_FOCUS_AREAS[0];
    setFocusArea(newArea);
    setReport(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Engine Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`p-1.5 rounded-lg border ${
              isPOx 
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Evidence-Grounded Research Gap Discovery Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isPOx 
              ? 'Dedicated AI synthesis of 487+ POx/POzi articles to identify underexplored monomer structures and CROP mechanisms.' 
              : 'Cross-disciplinary AI synthesis across universal polymer literature to identify frontiers in synthesis, sustainability, and biomaterials.'}
          </p>
        </div>

        <EngineSelector
          currentEngine={engine}
          onSelectEngine={handleSwitchEngine}
          compact={true}
        />
      </div>

      {/* Critical Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-teal-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Novelty & Potential Gap Verification Disclaimer</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          All claims are identified as <span className="text-teal-300 font-medium italic">"Potentially underexplored research gaps based on the currently indexed literature."</span> The engine never asserts absolute global novelty or patentability. Findings must be verified against primary literature and laboratory feasibility before experimental initiation.
        </p>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              Specify Research Focus Area ({isPOx ? 'POx Scope' : 'Universal Polymer Scope'})
            </label>
            <input
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Chemical recycling of polyesters, or living CROP kinetics..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Or Select Suggested Priority Topic:
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleAreas.map((area, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFocusArea(area)}
                  className={`text-left px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                    focusArea === area
                      ? (isPOx ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold')
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={generating}
            className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isPOx 
                ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Synthesizing Literature & Identifying Gaps...' : 'Analyze Literature & Uncover Research Gaps'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Report Presentation */}
      {report && (
        <div className="space-y-6">
          {/* Executive Synthesis */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Executive Bibliometric Synthesis</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Generated: {new Date(report.generated_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-sans">
              {report.report_data?.executive_summary}
            </p>
          </div>

          {/* Identified Research Gaps List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Potential Research Gaps ({report.report_data?.identified_gaps?.length || 0} Opportunities)</span>
            </h2>

            <div className="space-y-3">
              {(report.report_data?.identified_gaps || []).map((gap, idx) => {
                const isExpanded = expandedGapIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setExpandedGapIndex(isExpanded ? -1 : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-teal-500/15 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-500/30">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-slate-100">
                            {gap.gap_title}
                          </h3>
                          <span className="text-[10px] font-mono text-rose-400 mt-0.5 inline-block">
                            {gap.severity} Opportunity
                          </span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 text-xs bg-slate-950/40">
                        <div>
                          <strong className="text-slate-300 block mb-1">Scientific & Chemical Rationale:</strong>
                          <p className="text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                            {gap.chemical_rationale}
                          </p>
                        </div>

                        <div>
                          <strong className="text-slate-300 block mb-1">Unexplored Monomers & Macromolecular Targets:</strong>
                          <p className="text-teal-300 font-mono text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800">
                            {gap.unexplored_monomers}
                          </p>
                        </div>

                        <div>
                          <strong className="text-slate-300 block mb-1">Suggested Validation Experiment:</strong>
                          <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                            {gap.suggested_experiment}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
