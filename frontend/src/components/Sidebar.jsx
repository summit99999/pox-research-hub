import React, { useState } from 'react';
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
  ChevronRight,
  Network,
  Globe2,
  Boxes,
  Zap,
  Newspaper,
  Sun,
  Moon,
  FolderHeart
} from 'lucide-react';
import EngineSelector from './EngineSelector';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export const PRIMARY_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '⌘D' },
  { id: 'domains', label: 'Research Domains', icon: Compass, badge: '18 Classes', color: 'purple', shortcut: '⌘R' },
  { id: 'search', label: 'POx Search', icon: Atom, engine: ENGINE_SCOPES.POX, badge: 'POx/POzi', color: 'teal', shortcut: '⌘1' },
  { id: 'universal_search', label: 'Polymer Search', icon: Network, engine: ENGINE_SCOPES.UNIVERSAL, badge: 'Universal', color: 'indigo', shortcut: '⌘2' },
  { id: 'journals', label: 'Journals', icon: Newspaper, isDistinctive: true, badge: 'LIVE', shortcut: '⌘J' },
];

export const WORKSPACE_NAV_ITEMS = [
  { id: 'pdf_library', label: 'My PDF Library', icon: FileText, badge: 'PDF', color: 'emerald', shortcut: '⌘P' },
  { id: 'watchlist', label: 'My Watchlist', icon: BookMarked, badge: 'Track', color: 'violet', shortcut: '⌘W' },
  { id: 'library', label: 'Saved Papers', icon: Bookmark, badge: 'Library' },
  { id: 'publications', label: 'Research Collections', icon: Boxes },
  { id: 'summaries', label: 'AI Research Assistant', icon: Sparkles, color: 'purple', badge: 'AI' },
];

export const INTELLIGENCE_NAV_ITEMS = [
  { id: 'trends', label: 'Literature Analytics', icon: TrendingUp },
  { id: 'gaps', label: 'Research Trends & Gaps', icon: Compass },
];

export const SYSTEM_NAV_ITEMS = [
  { id: 'developer', label: "Developer's Works", icon: Award, badge: 'IACS' },
  { id: 'settings', label: 'Settings & Cloud DB', icon: Settings },
];

export default function Sidebar({ 
  isOpen = false, 
  onClose, 
  isPinned = true, 
  onTogglePin,
  activeView, 
  setActiveView,
  currentEngine = ENGINE_SCOPES.POX,
  onSelectEngine,
  theme = 'dark',
  onToggleTheme
}) {
  const isPOx = currentEngine === ENGINE_SCOPES.POX;
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleNavClick = (viewId, targetEngine) => {
    if (viewId === 'universal_search') {
      if (onSelectEngine) onSelectEngine(ENGINE_SCOPES.UNIVERSAL);
      setActiveView('search');
    } else if (viewId === 'search') {
      if (onSelectEngine) onSelectEngine(ENGINE_SCOPES.POX);
      setActiveView('search');
    } else {
      if (targetEngine && onSelectEngine && targetEngine !== currentEngine) {
        onSelectEngine(targetEngine);
      }
      setActiveView(viewId);
    }

    if (!isPinned && onClose) {
      onClose();
    }
  };

  const isItemActive = (item) => {
    if (item.id === 'universal_search') {
      return activeView === 'search' && !isPOx;
    }
    if (item.id === 'search') {
      return activeView === 'search' && isPOx;
    }
    return activeView === item.id;
  };

  return (
    <aside
      className={`
        fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-in-out flex flex-col shadow-2xl
        border-r backdrop-blur-2xl
        bg-slate-900/98 dark:bg-slate-950/95 light:bg-white/95
        border-slate-800 dark:border-slate-800/80 light:border-slate-200
        ${collapsed ? 'w-20' : 'w-72'}
        ${isPinned ? 'lg:static lg:z-10 lg:translate-x-0' : ''}
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none lg:w-0 lg:p-0 lg:border-none'}
      `}
    >
      {/* Header with Branding & Collapse */}
      <div className="p-3.5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between shrink-0 bg-slate-950/40 dark:bg-slate-950/60 light:bg-slate-50/80">
        <div 
          onClick={() => handleNavClick('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none min-w-0"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform group-hover:scale-105 ${
            isPOx 
              ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/20' 
              : 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/20'
          }`}>
            {isPOx ? <Atom className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4 animate-spin" />}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight truncate">
                  PRIH Platform
                </h2>
                <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-teal-400 font-medium truncate">
                {isPOx ? 'POx Research Suite' : 'Universal Polymer'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Collapse Icon Rail Toggle (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar (⌘B)" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors hidden lg:inline-flex"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {onTogglePin && !collapsed && (
            <button
              onClick={onTogglePin}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
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
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors lg:hidden"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {/* GROUP 1: CORE ENGINES & DISCOVERY */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 light:text-slate-400 flex items-center justify-between">
              <span>Scientific Engines</span>
              <span className="text-[9px] font-mono text-teal-400">Live</span>
            </h3>
          )}

          <div className="space-y-0.5 pt-0.5">
            {PRIMARY_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <div key={item.id} className="relative group/item">
                  <button
                    onClick={() => handleNavClick(item.id, item.engine)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left relative ${
                      isActive
                        ? item.isDistinctive
                          ? 'bg-gradient-to-r from-teal-500/25 to-emerald-500/20 text-teal-200 border-l-4 border-teal-400 shadow-md shadow-teal-500/10'
                          : item.color === 'indigo'
                          ? 'bg-gradient-to-r from-indigo-500/25 to-purple-500/20 text-indigo-200 border-l-4 border-indigo-400 shadow-md shadow-indigo-500/10'
                          : item.color === 'purple'
                          ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/20 text-purple-200 border-l-4 border-purple-400 shadow-md shadow-purple-500/10'
                          : 'bg-gradient-to-r from-teal-500/20 to-emerald-500/15 text-teal-300 border-l-4 border-teal-400 shadow-md shadow-teal-500/10'
                        : item.isDistinctive
                        ? 'text-teal-400 hover:text-teal-200 hover:bg-teal-500/10 border border-teal-500/20'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive 
                          ? item.color === 'indigo' ? 'text-indigo-400' : item.color === 'purple' ? 'text-purple-400' : 'text-teal-400'
                          : item.isDistinctive ? 'text-teal-400' : 'text-slate-400'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip in collapsed mode */}
                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-xl whitespace-nowrap pointer-events-none font-sans">
                      {item.label} {item.shortcut && <span className="text-[10px] text-slate-500 ml-1">({item.shortcut})</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 2: RESEARCH WORKSPACE & AI */}
        <div className="space-y-1 pt-1 border-t border-slate-800/70 dark:border-slate-800/70 light:border-slate-200">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 light:text-slate-400">
              Workspace & AI
            </h3>
          )}

          <div className="space-y-0.5 pt-0.5">
            {WORKSPACE_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <div key={item.id} className="relative group/item">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? item.color === 'purple'
                          ? 'bg-purple-500/20 text-purple-300 font-semibold border-l-2 border-purple-400 shadow-sm'
                          : 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${
                        isActive ? (item.color === 'purple' ? 'text-purple-400' : 'text-teal-400') : 'text-slate-400'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 3: ANALYTICS & INTELLIGENCE */}
        <div className="space-y-1 pt-1 border-t border-slate-800/70 dark:border-slate-800/70 light:border-slate-200">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 light:text-slate-400">
              Analytics & Trends
            </h3>
          )}

          <div className="space-y-0.5 pt-0.5">
            {INTELLIGENCE_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <div key={item.id} className="relative group/item">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 4: PLATFORM & SYSTEM */}
        <div className="space-y-1 pt-1 border-t border-slate-800/70 dark:border-slate-800/70 light:border-slate-200">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 light:text-slate-400">
              Platform & Creator
            </h3>
          )}

          <div className="space-y-0.5 pt-0.5">
            {SYSTEM_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <div key={item.id} className="relative group/item">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-teal-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Developer Card & Theme Controls Footer */}
      <div className="p-3 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50/80 text-[11px] space-y-2 shrink-0">
        {!collapsed ? (
          <>
            <div 
              onClick={() => handleNavClick('developer')}
              title="View Developer's Publications (Sumit Barik, IACS Kolkata)"
              className="p-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-teal-500/50 hover:bg-slate-850 flex items-center gap-2.5 shadow-sm cursor-pointer transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                SB
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-bold text-teal-400 tracking-wider flex items-center justify-between">
                  <span>Developer</span>
                  <span className="text-[9px] text-teal-300 font-normal">IACS →</span>
                </div>
                <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs truncate group-hover:text-teal-300 transition-colors">
                  Sumit Barik
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Polymer Chemist · IACS Kolkata
                </div>
              </div>
            </div>

            {/* Platform Scope & Theme Toggle Row */}
            <div className="flex items-center justify-between px-1 pt-1 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud DB 1950–2026+</span>
              </span>

              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  className="p-1 rounded-md bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-500" />}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div 
              onClick={() => handleNavClick('developer')}
              title="Sumit Barik (IACS Kolkata)"
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
            >
              SB
            </div>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
