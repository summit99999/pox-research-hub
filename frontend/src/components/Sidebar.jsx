import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  BookMarked,
  Layers, 
  Hexagon, 
  TestTube, 
  FlaskConical, 
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
  Boxes, 
  Newspaper, 
  Sun, 
  Moon 
} from 'lucide-react';
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
  { id: 'settings', label: 'Settings', icon: Settings },
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
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('sidebar') === 'collapsed';
    } catch {
      return false;
    }
  });
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
        sidebar-glass-gold
        ${collapsed ? 'w-20' : 'w-72'}
        ${isPinned ? 'lg:static lg:z-10 lg:translate-x-0' : ''}
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none lg:w-0 lg:p-0 lg:border-none'}
      `}
    >
      {/* Header with Warm Golden / Honey Ambient Branding & Collapse Controls */}
      <div className="p-3.5 border-b border-amber-500/20 flex items-center justify-between shrink-0 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950/40">
        <div 
          onClick={() => handleNavClick('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none min-w-0"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-100 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 shadow-md shadow-amber-500/30 shrink-0 transition-transform group-hover:scale-105 border border-amber-300/40">
            {isPOx ? <Atom className="w-4 h-4" /> : <Network className="w-4 h-4" />}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-amber-100 dark:text-amber-100 light:text-amber-950 tracking-tight truncate">
                  PRIH Platform
                </h2>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-amber-300/80 font-medium truncate">
                {isPOx ? 'POx Research Suite' : 'Universal Polymer'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Collapse Rail Toggle (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar (⌘B)" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30 transition-colors hidden lg:inline-flex"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {onTogglePin && !collapsed && (
            <button
              onClick={onTogglePin}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
              className={`p-1.5 rounded-lg border transition-colors hidden lg:inline-flex ${
                isPinned 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/60 hover:bg-amber-500/10 text-amber-200/60 border-amber-500/20'
              }`}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-200/80 hover:text-amber-100 border border-amber-500/30 transition-colors lg:hidden"
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
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-200/60 flex items-center justify-between">
              <span>Scientific Engines</span>
              <span className="text-[9px] font-mono text-amber-400 font-semibold">Live</span>
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
                        ? 'nav-item-active-gold'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-100 hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive 
                          ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                          : 'text-amber-200/70 group-hover/item:text-amber-300'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                          : item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-amber-950/40 text-amber-300/80 border border-amber-500/25'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip in collapsed mode */}
                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-semibold text-amber-100 shadow-2xl whitespace-nowrap pointer-events-none font-sans">
                      {item.label} {item.shortcut && <span className="text-[10px] text-amber-300/60 ml-1">({item.shortcut})</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 2: RESEARCH WORKSPACE & AI */}
        <div className="space-y-1 pt-1 border-t border-amber-500/15">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-200/60">
              Workspace &amp; AI
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
                        ? 'nav-item-active-gold'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-100 hover:bg-amber-500/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive 
                          ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                          : 'text-amber-200/70 group-hover/item:text-amber-300'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                        isActive 
                          ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40' 
                          : 'bg-amber-950/40 text-amber-300/80 border border-amber-500/25'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-semibold text-amber-100 shadow-2xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 3: ANALYTICS & INTELLIGENCE */}
        <div className="space-y-1 pt-1 border-t border-amber-500/15">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-200/60">
              Analytics &amp; Trends
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
                        ? 'nav-item-active-gold'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-100 hover:bg-amber-500/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-amber-200/70 group-hover/item:text-amber-300'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-semibold text-amber-100 shadow-2xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GROUP 4: PLATFORM & SYSTEM */}
        <div className="space-y-1 pt-1 border-t border-amber-500/15">
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-200/60">
              Platform &amp; System
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
                        ? 'nav-item-active-gold'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-100 hover:bg-amber-500/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-amber-200/70 group-hover/item:text-amber-300'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>

                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-semibold text-amber-100 shadow-2xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Platform Scope & Theme Controls Footer with Warm Golden Glow */}
      <div className="p-3 border-t border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950/40 text-[11px] space-y-2 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between px-1 py-1 text-[11px] font-mono text-amber-200/70">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Corpus 1950–2026+</span>
            </span>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/70 text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-1 border border-amber-500/30 shadow-sm"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/70 text-amber-200 transition-colors border border-amber-500/30"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
