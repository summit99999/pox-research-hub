import React, { useState, useEffect } from 'react';
import { Search, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Terminal, CornerDownLeft } from 'lucide-react';
import { validateQuerySyntax, ENGINE_SCOPES } from '../lib/searchEngine';

const POX_EXAMPLES = [
  '("poly(2-oxazoline)" OR "poly(2-oxazine)") AND ROS',
  'oxazoline AND ("cationic ring-opening polymerization" OR CROP)',
  '("thioether functional" OR "sulfide functional") AND polyoxazoline',
  'polyoxazoline AND ("gene delivery" OR "DNA complexation")',
  'poly(2-oxazine) AND thermoresponsive'
];

const UNIVERSAL_EXAMPLES = [
  'RAFT polymerization AND hydrogel',
  'PLA AND (biodegradable OR "drug delivery")',
  'polyethylene AND (metallocene OR "Ziegler-Natta")',
  '"conducting polymer" AND (PEDOT OR polyaniline)',
  '(cellulose OR chitin) AND nanocomposite',
  'ATRP AND "block copolymer" NOT review'
];

export default function BooleanQueryBar({
  query,
  onChangeQuery,
  onSearch,
  targetField,
  onChangeTargetField,
  engine = ENGINE_SCOPES.POX,
  placeholder,
  loading = false
}) {
  const [syntaxStatus, setSyntaxStatus] = useState({ isValid: true, explanation: '' });
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const res = validateQuerySyntax(query);
    setSyntaxStatus(res);
  }, [query]);

  const examples = engine === ENGINE_SCOPES.POX ? POX_EXAMPLES : UNIVERSAL_EXAMPLES;

  const handleInsertToken = (token) => {
    const space = query && !query.endsWith(' ') ? ' ' : '';
    onChangeQuery(query + space + token);
  };

  const handleSelectExample = (ex) => {
    onChangeQuery(ex);
    setShowHelper(false);
  };

  return (
    <div className="space-y-2">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex flex-col sm:flex-row gap-2">
        {/* Field Target Selector */}
        <select
          value={targetField || 'all'}
          onChange={(e) => onChangeTargetField(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-teal-500 focus:outline-none shrink-0"
          title="Search within specific paper fields"
        >
          <option value="all">All Fields</option>
          <option value="title">Title Only</option>
          <option value="abstract">Abstract Only</option>
          <option value="title_abstract">Title & Abstract</option>
          <option value="author">Authors</option>
          <option value="journal">Journal</option>
          <option value="doi">DOI</option>
          <option value="publisher">Publisher</option>
        </select>

        {/* Query Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={placeholder || (engine === ENGINE_SCOPES.POX 
              ? 'Search POx/POzi literature, e.g. ("poly(2-oxazoline)" OR "poly(2-oxazine)") AND ROS...' 
              : 'Search universal polymer literature, e.g. RAFT polymerization AND hydrogel...')}
            className={`w-full bg-slate-900/90 border rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition-colors font-mono ${
              !syntaxStatus.isValid 
                ? 'border-rose-500/80 focus:border-rose-500' 
                : 'border-slate-800 focus:border-teal-500'
            }`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="p-1 text-slate-400 hover:text-teal-300 rounded"
              title="Query syntax guide & examples"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm flex items-center gap-1 transition-all ${
                engine === ENGINE_SCOPES.POX
                  ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
              }`}
            >
              <span>{loading ? 'Searching...' : 'Search'}</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

      {/* Syntax Status & Live Validation Helper */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          {syntaxStatus.isValid ? (
            <span className="inline-flex items-center gap-1 text-emerald-400/90 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{syntaxStatus.explanation}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{syntaxStatus.error}</span>
            </span>
          )}
        </div>

        {/* Quick Boolean Operator & Field Tag Injectors */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="text-slate-400 mr-1 hidden sm:inline">Insert:</span>
          {['AND', 'OR', 'NOT', '"..."', 'title:', 'abstract:'].map(token => (
            <button
              key={token}
              type="button"
              onClick={() => handleInsertToken(token === '"..."' ? '""' : token)}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-teal-300 transition-colors"
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Query Assistant & Examples Drawer */}
      {showHelper && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span>Boolean Query Syntax Guide ({engine === ENGINE_SCOPES.POX ? 'POx Scope' : 'Universal Scope'})</span>
            </span>
            <button onClick={() => setShowHelper(false)} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px] leading-relaxed">
            <div>
              <strong className="text-slate-100 block mb-1">Supported Logical Operators:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><code className="text-teal-300 font-mono">AND</code>: Papers must match both conditions</li>
                <li><code className="text-teal-300 font-mono">OR</code>: Papers can match either condition</li>
                <li><code className="text-teal-300 font-mono">NOT</code>: Excludes papers matching following term</li>
                <li><code className="text-teal-300 font-mono">"exact phrase"</code>: Matches multi-word phrase precisely</li>
                <li><code className="text-teal-300 font-mono">( ... )</code>: Grouping and nesting conditions</li>
              </ul>
            </div>

            <div>
              <strong className="text-slate-100 block mb-1">Click Example Query to Try:</strong>
              <div className="space-y-1.5">
                {examples.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectExample(ex)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-teal-300 font-mono text-[10px] transition-colors truncate block"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
