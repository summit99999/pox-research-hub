import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  Download, 
  Table, 
  BookOpen, 
  ExternalLink,
  Layers,
  Copy
} from 'lucide-react';
import { api } from '../lib/api';

export default function ReviewWorkspaceView({ selectedPaperIds = [], onOpenSearch }) {
  const [topic, setTopic] = useState('Comparative CROP kinetics and thermoresponsive properties of poly(2-oxazoline)s and poly(2-oxazine)s');
  const [title, setTitle] = useState('Synthesis and Stimuli-Responsive Architectures of Cyclic Imino Ether Polymers: A Critical Synthesis');
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('markdown'); // markdown, matrix

  useEffect(() => {
    if (selectedPaperIds.length > 0) {
      loadSelectedPapers();
    }
  }, [selectedPaperIds]);

  const loadSelectedPapers = async () => {
    try {
      const papers = await Promise.all(
        selectedPaperIds.map(id => api.getPaper(id).catch(() => null))
      );
      setSelectedPapers(papers.filter(Boolean));
    } catch (e) {
      console.debug('Failed to load selected papers for review', e);
    }
  };

  const handleGenerateReview = async (e) => {
    e.preventDefault();
    if (selectedPaperIds.length === 0) {
      setErrorMsg('Please select publications from Literature Search or All Publications first.');
      return;
    }

    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await api.generateReviewDraft({
        title,
        topic,
        paper_ids: selectedPaperIds
      });
      setReviewResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to synthesize literature review.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!reviewResult?.review_markdown) return;
    navigator.clipboard.writeText(reviewResult.review_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-slate-100">
            Literature Review Synthesis Workspace
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Synthesize selected POx/POzi publications into an evidence-grounded review draft with DOI links and comparative property matrices.
        </p>
      </div>

      {/* Critical Scientific Verification Warning */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Mandatory Verification Notice (Section 12)</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          AI-generated literature review drafts and comparative tables require verification against the original peer-reviewed papers. Never submit or cite unverified machine-generated text. Verify all chemical architectures, polymerization yields, and cloud points directly from primary sources.
        </p>
      </div>

      {/* Workspace Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Selected Publications ({selectedPapers.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Papers chosen from search and library for synthesis
            </p>
          </div>

          <button
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-medium"
          >
            + Select More Papers
          </button>
        </div>

        {/* Selected Papers Pills */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedPapers.map((p, idx) => (
            <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs">
              <div className="truncate max-w-xl">
                <span className="font-mono text-teal-400 mr-2">[{idx + 1}]</span>
                <span className="text-slate-200 font-medium">{p.title}</span>
                <span className="text-slate-400 ml-2 italic">{p.journal} ({p.publication_year})</span>
              </div>
              {p.doi && (
                <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                  {p.doi}
                </span>
              )}
            </div>
          ))}
          {selectedPapers.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No publications selected. Check papers in "Literature Search" or "All Publications" to add them to this workspace.
            </div>
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleGenerateReview} className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              Review Section Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              Specific Topic / Synthetic Angle
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={generating || selectedPapers.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generating ? 'Synthesizing Literature with Gemini...' : 'Synthesize Literature Review'}</span>
          </button>
        </form>
      </div>

      {/* Synthesis Result */}
      {reviewResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'markdown'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Structured Review Text (Markdown)
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'matrix'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Comparative Properties Matrix
              </button>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>

          {activeTab === 'markdown' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line shadow-xl">
              {reviewResult.review_markdown}
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Publication</th>
                    <th className="p-3">Polymer Class</th>
                    <th className="p-3">Monomers / Initiator</th>
                    <th className="p-3">Molecular Weight & Đ</th>
                    <th className="p-3">Stimuli / Cloud Point</th>
                    <th className="p-3">Main Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reviewResult.comparison_table?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-200 max-w-xs">
                        <div>{row.paper_title}</div>
                        {row.doi && (
                          <div className="text-[10px] font-mono text-teal-400 mt-0.5">{row.doi}</div>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">{row.polymer_type}</td>
                      <td className="p-3 text-slate-300">{row.monomers_initiators}</td>
                      <td className="p-3 text-slate-300 font-mono">{row.reported_mw_dispersity}</td>
                      <td className="p-3 text-teal-300 font-medium">{row.stimuli_response_or_cloud_point}</td>
                      <td className="p-3 text-slate-400 leading-relaxed max-w-sm">{row.main_findings}</td>
                    </tr>
                  ))}
                  {(!reviewResult.comparison_table || reviewResult.comparison_table.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No matrix items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
