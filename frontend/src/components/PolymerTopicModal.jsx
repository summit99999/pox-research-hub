import React, { useEffect } from 'react';
import { 
  X, 
  FlaskConical, 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Atom, 
  ArrowRight, 
  Thermometer, 
  Droplets, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

/**
 * PolymerTopicModal - In-depth scientific detail view for an individual polymer or family.
 * Displays chemically authentic repeat-unit formulas, physical/thermal parameters,
 * synthesis pathways, characterization methods, and provides one-click navigation
 * into the literature search engine.
 */
export default function PolymerTopicModal({ 
  polymer, 
  domain, 
  isOpen, 
  onClose, 
  onSearchLiterature 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !polymer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title & Close */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {domain?.title || 'Polymer Research Topic'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {polymer.acronym}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FlaskConical className="w-7 h-7 text-indigo-400" />
              <span>{polymer.name}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chemical Repeat Unit & Molecular Formula Panel */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Authentic Chemical Repeat-Unit Structure
            </span>
            <span className="text-slate-400 font-mono">
              MW: {polymer.repeatUnitMass ? `${polymer.repeatUnitMass} g/mol` : 'Standard'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Repeating Backbone Formula:</div>
              <div className="text-lg sm:text-xl font-mono font-bold text-teal-300 tracking-wide mt-0.5">
                {polymer.formula || '[-CH2-CH(R)-]n'}
              </div>
            </div>
            {polymer.repeatUnit && (
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400 font-medium">IUPAC / Monomer Name:</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">
                  {polymer.repeatUnit}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Physical & Thermal Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Glass Transition (Tg)</span>
            </div>
            <div className="text-base font-bold font-mono text-rose-200">
              {polymer.tg || 'Amorphous / Variable'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Melting (Tm) / Phase</span>
            </div>
            <div className="text-base font-bold font-mono text-amber-200">
              {polymer.tm || polymer.cloudPoint || 'Amorphous'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Solvent Solubility</span>
            </div>
            <div className="text-xs font-medium text-cyan-200 line-clamp-2">
              {polymer.solubility || 'Polar & Organic Solvents'}
            </div>
          </div>
        </div>

        {/* Synthesis Approach */}
        {polymer.synthesis && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-teal-400" />
              <span>Polymerization & Synthesis Pathway</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              {polymer.synthesis}
            </p>
          </div>
        )}

        {/* Unique Macromolecular Properties */}
        {polymer.properties && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Key Physical & Chemical Properties</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              {polymer.properties}
            </p>
          </div>
        )}

        {/* Applications */}
        {polymer.applications && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Biomedical & Engineering Applications</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              {polymer.applications}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Search Term: <span className="text-slate-400">{polymer.searchQuery}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onSearchLiterature) {
                onSearchLiterature(polymer.searchQuery, domain);
              }
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-600 to-violet-600 hover:from-teal-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Literature for {polymer.acronym}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
