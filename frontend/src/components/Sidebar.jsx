import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  BookMarked,
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
  ChevronLeft
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
  { id: 'search', label: 'Literature Search', icon: Search, section: 'Core' },
  { id: 'publications', label: 'All Publications', icon: BookOpen, section: 'Core' },
  { id: 'reviews', label: 'POx Review Articles', icon: BookMarked, section: 'Core' },
  
  { id: 'pox', label: 'POx Research', icon: Layers, section: 'Polymer Classes' },
  { id: 'pozi', label: 'POzi Research', icon: Hexagon, section: 'Polymer Classes' },
  
  { id: 'monomers', label: 'Monomer Database', icon: TestTube, section: 'Chemistry Focus' },
  { id: 'polymerization', label: 'Polymerization & CROP', icon: FlaskConical, section: 'Chemistry Focus' },
  { id: 'stimuli', label: 'Stimuli-Responsive', icon: Flame, section: 'Chemistry Focus' },
  { id: 'biomedical', label: 'Biomedical & Delivery', icon: HeartPulse, section: 'Chemistry Focus' },
  
  { id: 'summaries', label: 'AI Summaries', icon: Sparkles, section: 'AI Research Suite' },
  { id: 'gaps', label: 'Research Gap Finder', icon: Compass, section: 'AI Research Suite' },
  { id: 'trends', label: 'Research Trends', icon: TrendingUp, section: 'AI Research Suite' },
  { id: 'review', label: 'Literature Review', icon: FileText, section: 'AI Research Suite' },
  
  { id: 'library', label: 'My Library & Screening', icon: Bookmark, section: 'Personal Workspace' },
  { id: 'settings', label: 'Settings & Cloud DB', icon: Settings, section: 'Personal Workspace' },
];

export default function Sidebar({ 
  isOpen = false, 
  onClose, 
  isPinned = false, 
  onTogglePin,
  activeView, 
  setActiveView 
}) {
  // Group navigation items by section
  const sections = Array.from(new Set(NAV_ITEMS.map(i => i.section)));

  const handleNavClick = (item) => {
    setActiveView(item.id);
    if (!isPinned && onClose) {
      onClose(); // Automatically folds away after selecting view
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Atom className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 tracking-tight">
              Navigation Menu
            </h2>
            <p className="text-[10px] text-teal-400 font-medium">16 Specialized Views</p>
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

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sections.map(section => (
          <div key={section} className="space-y-1">
            <h3 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {section}
            </h3>
            <div className="space-y-0.5 pt-0.5">
              {NAV_ITEMS.filter(item => item.section === section).map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Developer Credit & Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] space-y-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
            SB
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-bold text-teal-400 tracking-wider">
              Developer & Architect
            </div>
            <div className="font-semibold text-slate-200 text-xs truncate">
              Sumit Barik
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              IACS Kolkata · Macromolecules
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 space-y-0.5 px-0.5">
          <div className="flex items-center justify-between">
            <span>Indexed Scope</span>
            <span className="text-slate-300 font-mono">2020–2026+</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sources</span>
            <span className="text-slate-300">OpenAlex, Crossref</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
