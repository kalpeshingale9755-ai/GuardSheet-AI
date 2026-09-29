'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Circle, ShieldCheck, FileText } from 'lucide-react';
import { PageInfo, AuditFlag } from '../../lib/types';

interface PageListProps {
  pages: PageInfo[];
  flags: AuditFlag[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  flags,
  selectedPageId,
  onSelectPage,
}) => {
  const totalPages = pages.length;
  const processedCount = pages.filter(p => p.processing_status === 'COMPLETED').length;
  const is100Percent = totalPages > 0 && processedCount === totalPages;

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Booklet Pages</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {totalPages} Total
        </span>
      </div>

      {/* Scrollable Page List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page) => {
          const pageFlags = flags.filter(f => f.page_id === page.id || f.page_number === page.page_number);
          const hasFlags = pageFlags.length > 0;
          const isSelected = page.id === selectedPageId;

          // Status Badge Determination
          let statusBadge = (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> Analyzed
            </span>
          );

          if (page.processing_status === 'FAILED') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                <XCircle className="w-3 h-3" /> Failed
              </span>
            );
          } else if (hasFlags) {
            const hasOpen = pageFlags.some(f => f.status === 'OPEN');
            statusBadge = (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                hasOpen
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
              }`}>
                <AlertTriangle className="w-3 h-3" /> {pageFlags.length} Flag{pageFlags.length > 1 ? 's' : ''}
              </span>
            );
          } else if (page.is_blank) {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                ○ Blank
              </span>
            );
          }

          return (
            <button
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-blue-600/20 border border-blue-500/40 text-slate-100 shadow-sm'
                  : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  {page.page_number}
                </span>
                <span className="text-xs font-medium text-slate-200">
                  Page {page.page_number}
                </span>
              </div>

              {statusBadge}
            </button>
          );
        })}
      </div>

      {/* Coverage Guard Summary Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Coverage Guard
            </span>
            <span className={`font-mono font-bold ${is100Percent ? 'text-emerald-400' : 'text-amber-400'}`}>
              {processedCount}/{totalPages}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${is100Percent ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${totalPages > 0 ? (processedCount / totalPages) * 100 : 0}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-0.5">
            {is100Percent ? '100% Page Coverage Verified' : 'Coverage Check Incomplete'}
          </p>
        </div>
      </div>
    </div>
  );
};
