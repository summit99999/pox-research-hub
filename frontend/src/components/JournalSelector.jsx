import React, { useState, useMemo } from 'react';
import { BookOpen, Search, X, Check, Filter, AlertTriangle, ShieldCheck } from 'lucide-react';
import { POLYMER_JOURNALS_CATALOG, PUBLISHERS_LIST } from '../lib/journalMeta';

export default function JournalSelector({
  selectedJournals = [],
  excludedJournals = [],
  onSelectJournals,
  onExcludeJournals,
  onClearJournals
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('All Publishers');
  const [excludeMode, setExcludeMode] = useState(excludedJournals.length > 0);

  // Filter dynamic catalog based on search input and publisher
  const filteredJournals = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return POLYMER_JOURNALS_CATALOG.filter(j => {
      const matchSearch = !term || 
        j.name.toLowerCase().includes(term) ||
        j.abbr.toLowerCase().includes(term) ||
        j.issn.toLowerCase().includes(term);

      const matchPublisher = selectedPublisher === 'All Publishers' || 
        j.publisher.toLowerCase().includes(selectedPublisher.toLowerCase());

      return matchSearch && matchPublisher;
    });
  }, [searchTerm, selectedPublisher]);

  const activeCount = selectedJournals.length + excludedJournals.length;

  const handleToggleJournal = (journalName) => {
    if (excludeMode) {
      if (excludedJournals.includes(journalName)) {
        onExcludeJournals(excludedJournals.filter(j => j !== journalName));
      } else {
        onExcludeJournals([...excludedJournals, journalName]);
        // Remove from include list if present
        onSelectJournals(selectedJournals.filter(j => j !== journalName));
      }
    } else {
      if (selectedJournals.includes(journalName)) {
        onSelectJournals(selectedJournals.filter(j => j !== journalName));
      } else {
        onSelectJournals([...selectedJournals, journalName]);
        // Remove from exclude list if present
        onExcludeJournals(excludedJournals.filter(j => j !== journalName));
      }
    }
  };

  const handleAddCustomJournal = (e) => {
    e.preventDefault();
    const custom = searchTerm.trim();
    if (!custom) return;

    if (excludeMode) {
      if (!excludedJournals.includes(custom)) {
        onExcludeJournals([...excludedJournals, custom]);
      }
    } else {
      if (!selectedJournals.includes(custom)) {
        onSelectJournals([...selectedJournals, custom]);
      }
    }
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors shadow-sm cursor-pointer ${
          activeCount > 0
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
            : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
        <span>
          Journals: {activeCount === 0 ? 'Any Journal' : `${selectedJournals.length} included, ${excludedJournals.length} excluded`}
        </span>
      </button>

      {/* Selected Journal Tags Pill Bar */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {selectedJournals.map(j => (
            <span
              key={j}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-950/80 border border-teal-500/40 text-[11px] text-teal-300 font-medium"
            >
              <span>+ {j}</span>
              <button
                type="button"
                onClick={() => onSelectJournals(selectedJournals.filter(item => item !== j))}
                className="hover:text-teal-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {excludedJournals.map(j => (
            <span
              key={j}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-[11px] text-rose-300 font-medium"
            >
              <span>– {j}</span>
              <button
                type="button"
                onClick={() => onExcludeJournals(excludedJournals.filter(item => item !== j))}
                className="hover:text-rose-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearJournals}
            className="text-[10px] text-slate-400 hover:text-slate-200 underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Selection Modal / Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-96 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-slate-100">
                Advanced Journal Filter
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Mode Switcher: Include vs Exclude */}
          <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setExcludeMode(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !excludeMode 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Include Selected
            </button>
            <button
              type="button"
              onClick={() => setExcludeMode(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                excludeMode 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exclude Selected
            </button>
          </div>

          {/* Search Box with Autocomplete and Custom Journal Addition */}
          <form onSubmit={handleAddCustomJournal} className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by full name, abbreviation (e.g. ACS Macro Lett.), or ISSN..."
              className="w-full pl-9 pr-16 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
            />
            {searchTerm.trim() && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[10px] font-semibold"
              >
                Add
              </button>
            )}
          </form>

          {/* Publisher Quick Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            {PUBLISHERS_LIST.map(pub => (
              <button
                key={pub}
                type="button"
                onClick={() => setSelectedPublisher(pub)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                  selectedPublisher === pub
                    ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pub}
              </button>
            ))}
          </div>

          {/* Autocomplete List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredJournals.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                <p>No matching preset journals found.</p>
                <p className="text-[11px] text-teal-400 mt-1 cursor-pointer" onClick={handleAddCustomJournal}>
                  Press "Add" to include "{searchTerm}" as a custom journal.
                </p>
              </div>
            ) : (
              filteredJournals.map(j => {
                const isSelected = selectedJournals.includes(j.name);
                const isExcluded = excludedJournals.includes(j.name);

                return (
                  <div
                    key={j.name}
                    onClick={() => handleToggleJournal(j.name)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-950/60 border border-teal-500/40 text-teal-200 font-medium'
                        : isExcluded
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200 font-medium'
                        : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="truncate font-medium">{j.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-teal-400/90">{j.abbr}</span>
                        <span>• {j.publisher}</span>
                        {j.issn && <span className="font-mono text-slate-400">ISSN {j.issn}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
                        IF {j.impactFactor}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      {isExcluded && <span className="text-rose-400 font-bold text-xs">✕</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
