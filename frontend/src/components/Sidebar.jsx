import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
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
  Settings 
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
  { id: 'search', label: 'Literature Search', icon: Search, section: 'Core' },
  { id: 'publications', label: 'All Publications', icon: BookOpen, section: 'Core' },
  
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

export default function Sidebar({ activeView, setActiveView, onSelectCategory }) {
  // Group navigation items by section
  const sections = Array.from(new Set(NAV_ITEMS.map(i => i.section)));

  const handleNavClick = (item) => {
    setActiveView(item.id);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {sections.map(section => (
          <div key={section} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section}
            </h3>
            <div className="space-y-0.5 pt-1">
              {NAV_ITEMS.filter(item => item.section === section).map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
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
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Target Scope</span>
          <span className="text-slate-300 font-mono">2020–2026+</span>
        </div>
        <div className="flex items-center justify-between mt-1 text-slate-400">
          <span>Sources</span>
          <span className="text-slate-300">OpenAlex, Crossref</span>
        </div>
      </div>
    </aside>
  );
}
