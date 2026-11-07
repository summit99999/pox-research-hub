import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, Info } from 'lucide-react';

const PRESET_RANGES = [
  { label: 'All History (1950–2026+)', from: 1950, to: 2026 },
  { label: 'Foundational (1950–1980)', from: 1950, to: 1980 },
  { label: 'Early Modern (1980–2000)', from: 1980, to: 2000 },
  { label: 'Millennium Wave (2000–2010)', from: 2000, to: 2010 },
  { label: 'Decade Expansion (2010–2020)', from: 2010, to: 2020 },
  { label: 'Recent Benchmark (2020–2026)', from: 2020, to: 2026 },
  { label: 'Living CROP Era (1995–2026)', from: 1995, to: 2026 },
  { label: 'Custom Range...', from: null, to: null }
];

export default function YearRangeSelector({
  yearFrom,
  yearTo,
  onChangeYears,
  sortBy,
  sortOrder,
  onChangeSort
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSingleYear, setSelectedSingleYear] = useState('');
  const [selectedMultipleYears, setSelectedMultipleYears] = useState('');

  const currentFrom = yearFrom !== null && yearFrom !== undefined ? yearFrom : 1950;
  const currentTo = yearTo !== null && yearTo !== undefined ? yearTo : 2026;

  const currentLabel = PRESET_RANGES.find(p => p.from === currentFrom && p.to === currentTo)?.label 
    || `${currentFrom}–${currentTo}`;

  const handleSelectPreset = (preset) => {
    if (preset.from !== null && preset.to !== null) {
      onChangeYears(preset.from, preset.to);
      setSelectedSingleYear('');
      setSelectedMultipleYears('');
    }
  };

  const handleApplySingleYear = (year) => {
    const y = parseInt(year, 10);
    if (!isNaN(y) && y >= 1900 && y <= 2030) {
      onChangeYears(y, y);
      setSelectedSingleYear(String(y));
    }
  };

  const handleApplyMultipleYears = () => {
    const years = selectedMultipleYears
      .split(/[, ]+/)
      .map(y => parseInt(y.trim(), 10))
      .filter(y => !isNaN(y) && y >= 1900 && y <= 2030);

    if (years.length > 0) {
      const min = Math.min(...years);
      const max = Math.max(...years);
      onChangeYears(min, max);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Main Year Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>Years: <strong className="text-teal-300 font-mono">{currentLabel}</strong></span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Sort Toggle */}
        {onChangeSort && (
          <button
            type="button"
            onClick={() => onChangeSort('publication_year', sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
            title="Toggle chronological sorting"
          >
            {sortOrder === 'desc' ? 'Newest ↓' : 'Oldest ↑'}
          </button>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-80 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              Historical Publication Coverage
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Quick Preset Ranges */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Historical Presets
            </label>
            <div className="grid grid-cols-1 gap-1">
              {PRESET_RANGES.map((preset, idx) => {
                const isSelected = preset.from === currentFrom && preset.to === currentTo;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Year Bounds */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Custom Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1900"
                max="2030"
                value={currentFrom}
                onChange={(e) => onChangeYears(parseInt(e.target.value, 10) || 1900, currentTo)}
                className="w-1/2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 text-center focus:border-teal-500 focus:outline-none"
                placeholder="From (e.g. 1970)"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="number"
                min="1900"
                max="2030"
                value={currentTo}
                onChange={(e) => onChangeYears(currentFrom, parseInt(e.target.value, 10) || 2026)}
                className="w-1/2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 text-center focus:border-teal-500 focus:outline-none"
                placeholder="To (e.g. 2026)"
              />
            </div>
          </div>

          {/* Single Year / Multiple Years Selector */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Target Individual Year(s)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1900"
                max="2030"
                value={selectedSingleYear}
                onChange={(e) => setSelectedSingleYear(e.target.value)}
                placeholder="Only Year (e.g. 2005)"
                className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:border-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplySingleYear(selectedSingleYear)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 rounded-lg text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Note on Historical Database Coverage */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>
              PRIH searches across all years from 1950 to 2026+. Pre-1980 digitized literature is retrieved when indexed by OpenAlex, Crossref, and Europe PMC.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
