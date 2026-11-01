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
  PanelLeftClose
} from 'lucide-react';

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
  sidebarOpen
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Menu Toggle + Logo & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={sidebarOpen ? "Fold Sidebar Navigation" : "Open Sidebar Navigation"}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-teal-300 border border-slate-700/80 transition-all flex items-center justify-center shadow-sm group"
            >
              <Menu className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
                  POx Research Hub
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Poly(2-oxazoline) & Poly(2-oxazine) Scientific Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search POx/POzi chemistry (e.g. ROS responsive, CROP kinetics, monomers)..."
              className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 focus:border-teal-500 rounded-lg pl-9 pr-24 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Controls & User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Developer Attribution Pill */}
          <div 
            onClick={() => setActiveView('settings')}
            title="Platform Architect & Developer: Sumit Barik (IACS Kolkata)"
            className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 cursor-pointer hover:border-teal-500/40 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              SB
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400">Dev: </span>
              <span className="font-semibold text-teal-300">Sumit Barik</span>
            </div>
          </div>

          {/* Cloud Health Status Pill */}
          <div 
            onClick={() => setActiveView('settings')}
            title={`Database: ${health?.database || 'checking'} | AI: ${health?.ai_engine || 'checking'}`}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 cursor-pointer hover:border-slate-600"
          >
            <span className={`w-2 h-2 rounded-full ${health?.database === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="font-mono text-[11px]">
              {health?.database === 'connected' ? 'Cloud DB' : 'Setup Required'}
            </span>
          </div>

          {/* Collect Papers Button */}
          <button
            onClick={onOpenCollectorModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collect Papers</span>
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-200 max-w-[100px] truncate hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="text-slate-400 hover:text-rose-400 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
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
