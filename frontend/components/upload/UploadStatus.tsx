'use client';

import React from 'react';
import { CheckCircle2, Loader2, AlertTriangle, ShieldCheck, ArrowRight, FileCheck } from 'lucide-react';
import { DocumentDetail, PageInfo } from '../../lib/types';

interface UploadStatusProps {
  document: DocumentDetail;
  pages: PageInfo[];
  isAnalyzing: boolean;
  onStartAudit: () => void;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({
  document,
  pages,
  isAnalyzing,
  onStartAudit,
}) => {
  const isDocUploaded = true;
  const pageCount = pages.length || document.page_count;
  const isCoverageChecked = pages.length > 0 && pages.every(p => p.processing_status === 'COMPLETED');
  const isAiDone = document.status === 'ANALYZED';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              Answer Sheet Loaded
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{document.filename}</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            {pageCount} Pages Detected
          </div>
        </div>

        {/* Real Processing Steps Timeline */}
        <div className="space-y-4">
          {/* Step 1: Document Uploaded */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">Document Uploaded & Validated</p>
              <p className="text-xs text-slate-400">PDF structure, headers, and metadata verified</p>
            </div>
          </div>

          {/* Step 2: Page Detection & Extraction */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">{pageCount} Pages Extracted & Rendered</p>
              <p className="text-xs text-slate-400">PyMuPDF rendered high-resolution images</p>
            </div>
          </div>

          {/* Step 3: Coverage Guardrail Check */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              isCoverageChecked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isCoverageChecked ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">Coverage Guardrail Checked</p>
              <p className="text-xs text-slate-400">
                {isCoverageChecked
                  ? `Deterministic verification: ${pageCount}/${pageCount} pages fully tracked (100% coverage)`
                  : 'Verifying deterministic page processing completion...'}
              </p>
            </div>
          </div>

          {/* Step 4: AI Audit Analysis */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              isAiDone
                ? 'bg-emerald-500/20 text-emerald-400'
                : isAnalyzing
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-slate-800 text-slate-500'
            }`}>
              {isAiDone ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">AI Evidence & Reasoning Analysis</p>
              <p className="text-xs text-slate-400">
                {isAiDone
                  ? 'Gemini analysis complete & schema-validated'
                  : isAnalyzing
                  ? 'Gemini provider analyzing page images for un-evaluated reasoning...'
                  : 'Ready to run multimodal evidence analysis'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onStartAudit}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Answer Sheet Pages...
              </>
            ) : isAiDone ? (
              <>
                Enter Review Workspace <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Start AI Audit Analysis <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
