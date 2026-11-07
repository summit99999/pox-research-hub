import React, { useState } from 'react';
import { 
  Atom, 
  Search, 
  RefreshCw, 
  Database, 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  AlertCircle, 
  Menu, 
  Network,
  BookOpen,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import EngineSelector from './EngineSelector';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  searchQuery, 
  setSearchQuery, 
  onTriggerSearch, 
  onOpenCollectorModal, 
  onOpenAuthModal, 
  user, 
  onSignOut, 
  health, 
  onToggleSidebar, 
  sidebarOpen,
  currentEngine = ENGINE_SCOPES.POX,
  onSelectEngine,
  theme = 'dark',
  onToggleTheme
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const isPOx = currentEngine === ENGINE_SCOPES.POX;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (activeView !== 'search') {
      setActiveView('search');
    }
    if (onTriggerSearch) {
      onTriggerSearch(localQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 py-2.5 transition-colors duration-200 shadow-lg shadow-black/20">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Menu Toggle + Brand & Project Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={sidebarOpen ? "Fold Sidebar Navigation (Ctrl+B)" : "Open Sidebar Navigation (Ctrl+B)"}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-teal-300 border border-slate-700/80 transition-all flex items-center justify-center shadow-sm group"
            >
              <Menu className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105 ${
              isPOx 
                ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-teal-500/20' 
                : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
            }`}>
              {isPOx ? <Atom className="w-5 h-5 animate-pulse" /> : <Network className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-teal-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Polymer Research Intelligence Hub
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 hidden md:inline-block">
                  PRIH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Two Independent Search Engines · POx Dedicated & Universal Polymer Science
              </p>
            </div>
          </div>
        </div>

        {/* Center: Dual-Engine Switcher Pill + Journals Tracker Pill */}
        {onSelectEngine && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <EngineSelector
              currentEngine={currentEngine}
              onSelectEngine={onSelectEngine}
              compact={true}
            />
            <button
              type="button"
              onClick={() => setActiveView('journals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                activeView === 'journals'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-teal-500/10'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-slate-600'
              }`}
              title="Recent Polymer Publication Tracker across 10 international journals"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Journals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>
          </div>
        )}

        {/* Global Quick Search Bar with shortcut [ / ] */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm lg:max-w-md hidden xl:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder={isPOx 
                ? 'Search POx/POzi (e.g. ROS responsive, CROP)...' 
                : 'Search any polymer (e.g. RAFT, PLA, hydrogel)...'}
              className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 focus:border-teal-500 rounded-xl pl-9 pr-24 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors font-mono"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd 
                className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-700/60 rounded border border-slate-600/60 select-none cursor-pointer"
                title="Press / anywhere to focus"
              >
                /
              </kbd>
              <button
                type="submit"
                className={`px-2.5 py-0.5 text-white rounded-lg text-[11px] font-medium transition-colors ${
                  isPOx ? 'bg-teal-600 hover:bg-teal-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Action Controls, DB Status, Theme Toggle & User Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Cloud DB Live Status Dot */}
          <div 
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/70 text-[11px] text-slate-300 font-mono shadow-sm"
            title="Database Status: Supabase Cloud PostgreSQL Active (Sub-second latency)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">DB:</span>
            <span className="text-emerald-300 font-semibold">Active</span>
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/80 transition-all flex items-center justify-center shadow-sm group"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* Developer Attribution Pill */}
          <div 
            onClick={() => setActiveView('developer')}
            title="View Developer's Publications (Sumit Barik, IACS Kolkata)"
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 cursor-pointer hover:border-teal-500/50 hover:bg-slate-800 transition-all group"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:scale-110 transition-transform">
              SB
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400">Dev: </span>
              <span className="font-semibold text-teal-300 group-hover:underline">Sumit Barik</span>
            </div>
          </div>

          {/* Ingest Papers Button */}
          <button
            onClick={onOpenCollectorModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors shadow-sm"
            title="Ingest papers from OpenAlex & Crossref"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingest</span>
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs shadow-sm">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-200 max-w-[90px] truncate hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="text-slate-400 hover:text-rose-400 ml-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm shadow-indigo-500/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
