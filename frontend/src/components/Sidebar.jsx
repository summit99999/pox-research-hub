import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  BookMarked,
  Award,
  Layers, 
  Hexagon, 
  TestTube, 
  FlaskConical, 
  Flame, 
  HeartPulse, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  FileText, 
  Bookmark, 
  Settings,
  X,
  Atom,
  Pin,
  PinOff,
  ChevronLeft,
  Network,
  Globe2,
  Boxes
} from 'lucide-react';
import EngineSelector from './EngineSelector';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export const POX_NAV_ITEMS = [
  { id: 'search', label: 'POx Literature Search', icon: Search, engine: ENGINE_SCOPES.POX },
  { id: 'pox', label: 'POx Chemistry', icon: Layers, engine: ENGINE_SCOPES.POX },
  { id: 'pozi', label: 'POzi Chemistry', icon: Hexagon, engine: ENGINE_SCOPES.POX },
  { id: 'monomers', label: 'Monomer Database', icon: TestTube, engine: ENGINE_SCOPES.POX },
  { id: 'polymerization', label: 'Living CROP Kinetics', icon: FlaskConical, engine: ENGINE_SCOPES.POX },
  { id: 'stimuli', label: 'Stimuli-Responsive POx', icon: Flame, engine: ENGINE_SCOPES.POX },
  { id: 'biomedical', label: 'Biomedical & Delivery', icon: HeartPulse, engine: ENGINE_SCOPES.POX },
  { id: 'gaps', label: 'POx Gap Finder', icon: Compass, engine: ENGINE_SCOPES.POX },
  { id: 'trends', label: 'POx Bibliometric Trends', icon: TrendingUp, engine: ENGINE_SCOPES.POX },
];

export const UNIVERSAL_NAV_ITEMS = [
  { id: 'universal_search', label: 'Universal Polymer Search', icon: Globe2, engine: ENGINE_SCOPES.UNIVERSAL },
  { id: 'universal_classes', label: 'Polymer Disciplines (18)', icon: Boxes, engine: ENGINE_SCOPES.UNIVERSAL },
  { id: 'universal_gaps', label: 'Polymer Gap Finder', icon: Compass, engine: ENGINE_SCOPES.UNIVERSAL },
  { id: 'universal_trends', label: 'Global Polymer Trends', icon: TrendingUp, engine: ENGINE_SCOPES.UNIVERSAL },
];

export const SHARED_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'journals', label: 'Journals', icon: BookOpen, badge: 'Live' },
  { id: 'publications', label: 'All Publications', icon: BookMarked },
  { id: 'reviews', label: 'POx Review Articles', icon: FileText },
  { id: 'summaries', label: 'AI Summaries', icon: Sparkles },
  { id: 'review', label: 'Literature Review', icon: Compass },
  { id: 'library', label: 'My Library & Screening', icon: Bookmark },
  { id: 'developer', label: "Developer's Publications", icon: Award },
  { id: 'settings', label: 'Settings & Cloud DB', icon: Settings },
];

export default function Sidebar({ 
  isOpen = false, 
  onClose, 
  isPinned = false, 
  onTogglePin,
  activeView, 
  setActiveView,
  currentEngine = ENGINE_SCOPES.POX,
  onSelectEngine,
  onSelectCategory
}) {
  const isPOx = currentEngine === ENGINE_SCOPES.POX;

  const handleNavClick = (viewId, targetEngine) => {
    if (targetEngine && onSelectEngine && targetEngine !== currentEngine) {
      onSelectEngine(targetEngine);
    }
    setActiveView(viewId);
    if (!isPinned && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/98 backdrop-blur-xl border-r border-slate-800 
        flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        ${isPinned ? 'lg:static lg:z-10 lg:translate-x-0' : ''}
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none lg:w-0 lg:p-0 lg:border-none'}
      `}
    >
      {/* Sliding Header with Close & Pin Controls */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md ${
            isPOx 
              ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/20' 
              : 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/20'
          }`}>
            {isPOx ? <Atom className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4 animate-spin" />}
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 tracking-tight">
              PRIH Platform
            </h2>
            <p className="text-[10px] text-teal-400 font-medium">Two Search Engines</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              title={isPinned ? "Unpin sidebar (auto-fold when clicked)" : "Pin sidebar open"}
              className={`p-1.5 rounded-lg border transition-colors hidden lg:inline-flex ${
                isPinned 
                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/30' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
            title="Fold sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Engine Switcher inside Sidebar */}
      {onSelectEngine && (
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
          <EngineSelector
            currentEngine={currentEngine}
            onSelectEngine={onSelectEngine}
            compact={true}
          />
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Core Shared Navigation */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Core
          </h3>
          <div className="space-y-0.5 pt-0.5">
            {SHARED_NAV_ITEMS.slice(0, 3).map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Engine 1: Dedicated Polyoxazoline Research Engine */}
        <div className="space-y-1">
          <div className="px-3 flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Atom className="w-3 h-3 text-teal-400" />
              <span>Engine 1: POx / POzi Suite</span>
            </h3>
            {isPOx && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            )}
          </div>

          <div className="space-y-0.5 pt-0.5">
            {POX_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id && isPOx;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, ENGINE_SCOPES.POX)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Engine 2: Universal Polymer Research Engine */}
        <div className="space-y-1">
          <div className="px-3 flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Network className="w-3 h-3 text-indigo-400" />
              <span>Engine 2: Universal Polymer</span>
            </h3>
            {!isPOx && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </div>

          <div className="space-y-0.5 pt-0.5">
            {UNIVERSAL_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              // Map view IDs
              const targetView = item.id === 'universal_search' ? 'search' 
                : item.id === 'universal_classes' ? 'search' 
                : item.id === 'universal_gaps' ? 'gaps' 
                : item.id === 'universal_trends' ? 'trends' 
                : item.id;
              const isActive = activeView === targetView && !isPOx;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(targetView, ENGINE_SCOPES.UNIVERSAL)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 font-semibold border-l-2 border-indigo-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI & Workspace Tools */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AI Suite & Workspace
          </h3>
          <div className="space-y-0.5 pt-0.5">
            {SHARED_NAV_ITEMS.slice(3).map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Developer Credit & Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] space-y-2 shrink-0">
        <div 
          onClick={() => handleNavClick('developer')}
          title="Click to view all publications by Sumit Barik"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 flex items-center gap-2.5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            SB
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-bold text-teal-400 tracking-wider flex items-center justify-between">
              <span>Developer's Works</span>
              <span className="text-[9px] text-teal-300 font-normal">View →</span>
            </div>
            <div className="font-semibold text-slate-200 text-xs truncate group-hover:text-teal-300 transition-colors">
              Sumit Barik
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              IACS Kolkata · Macromolecules
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 space-y-0.5 px-0.5 font-mono">
          <div className="flex items-center justify-between">
            <span>Historical Scope</span>
            <span className="text-slate-300">1950–2026+</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Literature APIs</span>
            <span className="text-slate-300">OpenAlex, Crossref, PMC</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
