import React from 'react';
import { Atom, Network, ShieldCheck, Sparkles } from 'lucide-react';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function EngineSelector({ 
  currentEngine = ENGINE_SCOPES.POX, 
  onSelectEngine,
  compact = false 
}) {
  const isPOx = currentEngine === ENGINE_SCOPES.POX;

  if (compact) {
    return (
      <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
        <button
          onClick={() => onSelectEngine(ENGINE_SCOPES.POX)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isPOx
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Engine 1: Dedicated Poly(2-oxazoline) & Poly(2-oxazine) Engine"
        >
          <Atom className={`w-3.5 h-3.5 ${isPOx ? 'text-teal-400 animate-spin' : 'text-slate-400'}`} />
          <span>POx Research Engine</span>
        </button>

        <button
          onClick={() => onSelectEngine(ENGINE_SCOPES.UNIVERSAL)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            !isPOx
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Engine 2: Universal Polymer Research Engine (All Polymer Families)"
        >
          <Network className={`w-3.5 h-3.5 ${!isPOx ? 'text-indigo-400' : 'text-slate-400'}`} />
          <span>Universal Polymer Engine</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
      {/* Engine 1: Dedicated POx Engine */}
      <button
        onClick={() => onSelectEngine(ENGINE_SCOPES.POX)}
        className={`flex items-start gap-3.5 p-4 rounded-xl text-left transition-all relative overflow-hidden group ${
          isPOx
            ? 'bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border-2 border-teal-500 shadow-lg shadow-teal-500/10'
            : 'border border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
          isPOx
            ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/30'
            : 'bg-slate-800 text-slate-400'
        }`}>
          <Atom className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-sm font-bold truncate ${isPOx ? 'text-teal-300' : 'text-slate-200'}`}>
              POx Research Engine
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
              isPOx 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              Engine 1 · Dedicated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Exclusively dedicated to Poly(2-oxazoline)s, Poly(2-oxazine)s, CROP kinetics, monomer synthesis, and smart biomaterials.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-teal-400/90 font-mono mt-2.5">
            <span>• 487+ Curated POx Papers</span>
            <span>• CROP Living Reaction Schemes</span>
          </div>
        </div>
      </button>

      {/* Engine 2: Universal Polymer Engine */}
      <button
        onClick={() => onSelectEngine(ENGINE_SCOPES.UNIVERSAL)}
        className={`flex items-start gap-3.5 p-4 rounded-xl text-left transition-all relative overflow-hidden group ${
          !isPOx
            ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
            : 'border border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
          !isPOx
            ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30'
            : 'bg-slate-800 text-slate-400'
        }`}>
          <Network className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-sm font-bold truncate ${!isPOx ? 'text-indigo-300' : 'text-slate-200'}`}>
              Universal Polymer Engine
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
              !isPOx 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              Engine 2 · Complete Scope
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Unbiased polymer science search: PE, PP, PS, PLA, PEG, hydrogels, biopolymers, ATRP, RAFT, and conducting polymers.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-indigo-400/90 font-mono mt-2.5">
            <span>• All Polymer Families</span>
            <span>• Broad Historical Coverage (1950–2026+)</span>
          </div>
        </div>
      </button>
    </div>
  );
}
