import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Database, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { api } from '../lib/api';

export default function CollectorModal({ onClose, onCollectionComplete }) {
  const [query, setQuery] = useState('poly(2-oxazoline) OR poly(2-oxazine)');
  const [yearFrom, setYearFrom] = useState(2020);
  const [yearTo, setYearTo] = useState(2026);
  const [source, setSource] = useState('both');
  const [maxResults, setMaxResults] = useState(25);
  const [running, setRunning] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getCollectionLogs();
      setLogs(data || []);
    } catch (e) {
      console.debug('Failed to load collection logs', e);
    }
  };

  const handleRunCollection = async (e) => {
    e.preventDefault();
    setRunning(true);
    setResultMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.triggerCollection({
        query,
        year_from: parseInt(yearFrom),
        year_to: parseInt(yearTo),
        source,
        max_results: parseInt(maxResults)
      });

      if (res.status === 'started_in_background') {
        setResultMsg(res.message);
      } else {
        setResultMsg(`Successfully discovered ${res.records_found} papers and saved ${res.records_saved} new publications to database.`);
      }

      await loadLogs();
      if (onCollectionComplete) onCollectionComplete();
    } catch (err) {
      setErrorMsg(err.message || 'Literature collection failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Scientific Literature Collector
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Query OpenAlex & Crossref for peer-reviewed papers from 2020 onward, normalize DOIs, and save to Supabase.
        </p>

        {resultMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resultMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRunCollection} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Search Query
            </label>
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. poly(2-oxazoline) OR poly(2-oxazine) OR 2-oxazoline monomer"
              className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Year From
              </label>
              <input
                type="number"
                min={2020}
                max={2030}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Year To
              </label>
              <input
                type="number"
                min={2020}
                max={2030}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                API Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="both">Both (OpenAlex + Crossref)</option>
                <option value="openalex">OpenAlex</option>
                <option value="crossref">Crossref</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Batch Size
              </label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value={10}>10 papers (sync)</option>
                <option value={25}>25 papers</option>
                <option value={50}>50 papers</option>
                <option value={100}>100 papers</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={running}
            className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Collecting Publications from Scientific APIs...' : 'Start Literature Collection'}</span>
          </button>
        </form>

        {/* Recent Collection Telemetry Logs */}
        <div className="mt-8 pt-5 border-t border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Collection Telemetry</span>
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 uppercase text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 mr-2">
                    {log.source}
                  </span>
                  <span className="text-slate-300">{log.query || 'POx query'}</span>
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  {log.records_saved} saved / {log.records_found} found
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-xs text-slate-400">No collection history recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
