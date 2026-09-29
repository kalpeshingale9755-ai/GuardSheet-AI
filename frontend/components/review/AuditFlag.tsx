'use client';

import React from 'react';
import { AuditFlag as AuditFlagType } from '../../lib/types';
import { AlertTriangle, CheckCircle2, Edit3, XCircle, FileSearch, Sparkles } from 'lucide-react';

interface AuditFlagProps {
  flag: AuditFlagType;
  isSelected: boolean;
  onSelect: () => void;
}

export const AuditFlag: React.FC<AuditFlagProps> = ({
  flag,
  isSelected,
  onSelect,
}) => {
  // Flag Type Colors & Badges
  let typeBadge = (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
      REASONING
    </span>
  );

  if (flag.type === 'ROUGH_WORK') {
    typeBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
        ROUGH WORK
      </span>
    );
  } else if (flag.type === 'COVERAGE') {
    typeBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
        COVERAGE
      </span>
    );
  } else if (flag.type === 'PARTIAL_CREDIT') {
    typeBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        PARTIAL CREDIT
      </span>
    );
  }

  // Decision Status Badge
  let statusBadge = (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
      <AlertTriangle className="w-3 h-3" /> OPEN
    </span>
  );

  if (flag.status === 'ACCEPTED') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> ACCEPTED
      </span>
    );
  } else if (flag.status === 'MODIFIED') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1">
        <Edit3 className="w-3 h-3" /> MODIFIED
      </span>
    );
  } else if (flag.status === 'DISMISSED') {
    statusBadge = (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
        <XCircle className="w-3 h-3" /> DISMISSED
      </span>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
        isSelected
          ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {typeBadge}
          <span className="text-[11px] font-mono text-slate-400">Page {flag.page_number}</span>
        </div>
        {statusBadge}
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
          {flag.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {flag.description}
        </p>
      </div>

      {/* Evidence Highlight Box */}
      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Extracted Evidence
          </span>
          <span className="font-mono text-slate-400 font-normal">
            Confidence: {Math.round(flag.confidence * 100)}%
          </span>
        </div>
        <p className="text-xs font-mono text-slate-300 italic bg-slate-900/50 p-2 rounded border border-slate-800">
          "{flag.evidence}"
        </p>
      </div>

      {flag.decision_comment && (
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-start gap-1">
          <span className="font-semibold text-slate-300">Examiner Note:</span> {flag.decision_comment}
        </div>
      )}
    </div>
  );
};
