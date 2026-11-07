import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function PDFReaderModal({
  isOpen,
  onClose,
  pdf,
  paper,
  pdfUrl,
  originalFilename
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitMode, setFitMode] = useState('width'); // 'width', 'page', 'custom'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const title = paper?.title || pdf?.original_filename || originalFilename || 'Scientific Research Article';
  const journal = paper?.journal || 'Journal Article';
  const year = paper?.publication_year || (pdf?.created_at ? new Date(pdf.created_at).getFullYear() : '2026');
  const authors = paper?.authors ? (Array.isArray(paper.authors) ? paper.authors.map(a => a.name || a.author || a).join(', ') : paper.authors) : '';

  // Reset state when opening a new PDF
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setZoomLevel(100);
      setFitMode('width');
      setLoadError(false);
      setIsLoading(true);
    }
  }, [isOpen, pdfUrl]);

  // Handle Fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage(p => p + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage(p => Math.max(1, p - 1));
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(z => Math.min(250, z + 15));
        setFitMode('custom');
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel(z => Math.max(50, z - 15));
        setFitMode('custom');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = pdf?.original_filename || originalFilename || `${(paper?.title || 'article').slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenExternal = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Construct iframe source with browser-native PDF viewer parameters
  // #page=X&zoom=Y
  let embedUrl = pdfUrl;
  if (embedUrl) {
    const separator = embedUrl.includes('#') ? '&' : '#';
    let zoomParam = `${zoomLevel}`;
    if (fitMode === 'width') zoomParam = 'FitH';
    if (fitMode === 'page') zoomParam = 'Fit';
    embedUrl = `${embedUrl}${separator}page=${currentPage}&zoom=${zoomParam}&navpanes=0&toolbar=1`;
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'PDF File';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 transition-all duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={containerRef}
        className={`flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none border-none' : 'w-full max-w-7xl h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/95 border-b border-slate-800 text-slate-200 z-10">
          {/* Article Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-md lg:max-w-lg">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate" title={title}>
                {title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                <span className="text-cyan-400 font-medium truncate">{journal}</span>
                <span>•</span>
                <span>{year}</span>
                {authors && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[200px]" title={authors}>{authors}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {/* Page Navigation */}
            <div className="flex items-center gap-1 border-r border-slate-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                title="Previous Page (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 px-1 text-xs text-slate-300">
                <input
                  type="number"
                  min="1"
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setCurrentPage(val);
                  }}
                  className="w-10 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded text-white text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-slate-500">Page</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next Page (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-r border-slate-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(z => Math.max(50, z - 15));
                  setFitMode('custom');
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-1 text-xs text-slate-300 min-w-[42px] text-center font-mono">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(z => Math.min(250, z + 15));
                  setFitMode('custom');
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Fit Modes */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setFitMode('width');
                  setZoomLevel(100);
                }}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                  fitMode === 'width' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Fit to Page Width"
              >
                Fit Width
              </button>
              <button
                type="button"
                onClick={() => {
                  setFitMode('page');
                  setZoomLevel(100);
                }}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                  fitMode === 'page' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Fit Entire Page"
              >
                Fit Page
              </button>
            </div>
          </div>

          {/* Action Buttons: Fullscreen, External, Download, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleOpenExternal}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Open in Browser New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium text-xs shadow-sm transition-all"
              title="Download PDF to Computer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors ml-1"
              title="Close Reader (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* PDF Reader Stage */}
        <main className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
          {isLoading && !loadError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-slate-300 font-medium">Loading high-resolution scientific PDF...</p>
              <p className="text-xs text-slate-500 mt-1">{formatFileSize(pdf?.file_size)}</p>
            </div>
          )}

          {loadError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Unable to display PDF inline</h3>
              <p className="text-xs text-slate-400 mb-6">
                Your browser may block inline viewing of this document. You can open it in a dedicated tab or download it directly.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={`PDF: ${title}`}
              className="w-full h-full border-none bg-slate-900"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
            />
          )}
        </main>

        {/* Footer Bar */}
        <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authentic Research Document</span>
            </span>
            <span>•</span>
            <span>{pdf?.original_filename || originalFilename || 'article.pdf'}</span>
            <span>•</span>
            <span>{formatFileSize(pdf?.file_size)}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="hidden md:inline">Shortcuts:</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">←/→</kbd>
            <span className="hidden md:inline">Page</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">+/-</kbd>
            <span className="hidden md:inline">Zoom</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">Esc</kbd>
            <span>Close</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
