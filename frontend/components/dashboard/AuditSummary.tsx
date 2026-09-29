'use client';

import React from 'react';
import { PageInfo, AuditFlag, DocumentDetail } from '../../lib/types';
import { ShieldCheck, CheckCircle2, Edit3, XCircle, AlertTriangle, FileCheck, Award, ArrowLeft } from 'lucide-react';

interface AuditSummaryProps {
  document: DocumentDetail;
  pages: PageInfo[];
  flags: AuditFlag[];
  onBackToReview: () => void;
  onResetUpload: () => void;
}

export const AuditSummary: React.FC<AuditSummaryProps> = ({
  document,
  pages,
  flags,
  onBackToReview,
  onResetUpload,
}) => {
  const totalPages = pages.length || document.page_count;
  const processedPages = pages.filter(p => p.processing_status === 'COMPLETED').length;
  const coveragePercentage = totalPages > 0 ? Math.round((processedPages / totalPages) * 100) : 100;

  const totalFlags = flags.length;
  const acceptedCount = flags.filter(f => f.status === 'ACCEPTED').length;
  const modifiedCount = flags.filter(f => f.status === 'MODIFIED').length;
  const dismissedCount = flags.filter(f => f.status === 'DISMISSED').length;
  const openCount = flags.filter(f => f.status === 'OPEN').length;

  const isDemoComplete = totalPages === 6 && totalFlags === 3 && openCount === 0 && acceptedCount === 1 && modifiedCount === 1 && dismissedCount === 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Target Demo Banner */}
      {isDemoComplete && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-blue-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-200">Demonstration Audit Target Reached!</p>
              <p className="text-xs text-emerald-400/90">
                All 6 pages tracked, 3 evidence flags reviewed (1 Accepted, 1 Modified, 1 Dismissed, 0 Open).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
            VERIFIED
          </span>
        </div>
      )}

      {/* Main Audit Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              Audit Summary & Examiner Certificate
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Document: {document.filename} | ID: {document.id}
            </p>
          </div>
          <button
            onClick={onBackToReview}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Review
          </button>
        </div>

        {/* Coverage Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pages Processed</p>
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {processedPages}/{totalPages}
            </p>
            <p className="text-[10px] text-slate-500">{coveragePercentage}% Coverage</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Flags</p>
            <p className="text-2xl font-bold font-mono text-amber-400">{totalFlags}</p>
            <p className="text-[10px] text-slate-500">AI Audit Findings</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accepted</p>
            <p className="text-2xl font-bold font-mono text-emerald-400">{acceptedCount}</p>
            <p className="text-[10px] text-slate-500">Mark adjusted</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Open Flags</p>
            <p className={`text-2xl font-bold font-mono ${openCount === 0 ? 'text-slate-400' : 'text-red-400'}`}>
              {openCount}
            </p>
            <p className="text-[10px] text-slate-500">{openCount === 0 ? 'All Reviewed' : 'Requires Action'}</p>
          </div>
        </div>

        {/* Breakdown Breakdown List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Examiner Decisions Breakdown
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Accepted Findings
              </span>
              <span className="font-mono font-bold text-slate-200">{acceptedCount}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-blue-400 font-medium">
                <Edit3 className="w-4 h-4" /> Modified Findings
              </span>
              <span className="font-mono font-bold text-slate-200">{modifiedCount}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400 font-medium">
                <XCircle className="w-4 h-4" /> Dismissed Findings
              </span>
              <span className="font-mono font-bold text-slate-200">{dismissedCount}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Deterministic Coverage & AI Evidence Audit Log Complete
          </div>
          <button
            onClick={onResetUpload}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
          >
            Audit Another Script
          </button>
        </div>
      </div>
    </div>
  );
};
