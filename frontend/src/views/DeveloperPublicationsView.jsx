import React, { useState, useEffect } from 'react';
import { 
  Award, 
  GraduationCap, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Database, 
  FileText, 
  FlaskConical, 
  Atom, 
  RefreshCw,
  Quote,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api';
import PaperCard from '../components/PaperCard';

export default function DeveloperPublicationsView({
  onOpenDetails,
  onOpenSummary,
  selectedPaperIds = [],
  onToggleSelectPaper,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening
}) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeveloperPapers();
  }, []);

  const loadDeveloperPapers = async () => {
    setLoading(true);
    try {
      const res = await api.getPapers({
        author: 'Sumit Barik',
        page_size: 20,
        sort_by: 'publication_date',
        sort_order: 'desc'
      });
      setPapers(res.items || res.papers || []);
    } catch (err) {
      console.debug('Failed to load developer papers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Developer Profile Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 p-6 lg:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-xl shadow-teal-500/25 shrink-0 border border-teal-400/30">
              SB
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Sumit Barik
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Platform Architect & Lead Developer</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
                Polymer Chemist and Full-Stack Developer at <span className="font-semibold text-slate-100">Indian Association for the Cultivation of Science (IACS), Kolkata</span>. Lead researcher on stimuli-responsive cyclic imino ether architectures for biomedical applications.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Flagship Journal
            </span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block truncate">
              ACS Macromolecules (IF: 5.5)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Research Unit
            </span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block truncate">
              Polymer Science Unit, IACS
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Core Polymers
            </span>
            <span className="text-xs font-bold text-teal-300 mt-0.5 block truncate">
              PMMPOx, POx Pseudopolypeptides
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Indexed Works
            </span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">
              {papers.length} Peer-Reviewed Articles
            </span>
          </div>
        </div>
      </div>

      {/* Publications Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Developer's Published Works</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
              {papers.length} Publications
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Original peer-reviewed research papers and contributions authored by Sumit Barik
          </p>
        </div>

        <button
          onClick={loadDeveloperPapers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Publications Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
          <span>Loading developer publications from Cloud DB...</span>
        </div>
      ) : papers.length > 0 ? (
        <div className="space-y-4">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isSelected={selectedPaperIds.includes(paper.id)}
              onToggleSelect={onToggleSelectPaper}
              onOpenDetails={onOpenDetails}
              onOpenSummary={onOpenSummary}
              onToggleFavourite={onToggleFavourite}
              onUpdateReadingStatus={onUpdateReadingStatus}
              onUpdateScreening={onUpdateScreening}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            No publications found for author Sumit Barik.
          </p>
        </div>
      )}
    </div>
  );
}
