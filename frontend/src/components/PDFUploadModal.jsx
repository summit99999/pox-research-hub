import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { api } from '../lib/api';

export default function PDFUploadModal({
  isOpen,
  onClose,
  paper,
  onUploadSuccess,
  isReplacement = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceType, setSourceType] = useState('institutional_access');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadSuccessRecord, setUploadSuccessRecord] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !paper) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelectFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    // Check extension and mime type
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      setErrorMessage('Invalid file format. Only Adobe PDF (.pdf) documents are accepted.');
      return;
    }

    // 50MB Limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 50 MB.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a valid PDF file first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setErrorMessage('');

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 25;
        });
      }, 120);

      const record = await api.uploadArticlePdf({
        articleId: paper.id,
        doi: paper.doi,
        file: selectedFile,
        sourceType,
        paper
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccessRecord(record);
      setIsUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess(record);
      }
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'An error occurred during upload. Please verify file integrity and try again.');
    }
  };

  const handleResetAndClose = () => {
    setSelectedFile(null);
    setUploadSuccessRecord(null);
    setErrorMessage('');
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {isReplacement ? 'Replace Article PDF' : 'Upload Article PDF'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isReplacement ? 'Update existing full-text PDF document' : 'Save full-text research paper to your private cloud library'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Article Verification Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Target Canonical Publication</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
              {paper.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-medium text-cyan-700 dark:text-cyan-400">{paper.journal || 'Journal'}</span>
              <span>•</span>
              <span>{paper.publication_year || '2026'}</span>
              {paper.doi && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">DOI: {paper.doi}</span>
                </>
              )}
            </div>
          </div>

          {/* Success State */}
          {uploadSuccessRecord ? (
            <div className="py-6 px-4 flex flex-col items-center text-center space-y-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                  PDF Stored Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
                  Document <span className="font-mono font-medium text-slate-900 dark:text-white">{uploadSuccessRecord.original_filename}</span> is now linked to this publication and saved in your cloud library.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                  <span>Done</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Dropzone Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 text-center ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : selectedFile 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Drop research PDF here, or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Adobe PDF (.pdf) only • Up to 50 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Source/Attribution Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Acquisition Source</span>
                  <span className="text-[11px] text-slate-500">For compliance & library tracking</span>
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="institutional_access">Institutional Access / University Subscription</option>
                  <option value="open_access">Open Access (CC-BY / Public Repository)</option>
                  <option value="author_preprint">Author Self-Archived Preprint (ChemRxiv / arXiv)</option>
                  <option value="manual_upload">Manual Direct Upload</option>
                </select>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Uploading and verifying checksum...</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!uploadSuccessRecord && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
            <button
              type="button"
              onClick={handleResetAndClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartUpload}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isReplacement ? 'Replace PDF' : 'Upload to Cloud'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
