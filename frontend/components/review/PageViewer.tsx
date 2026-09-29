'use client';

import React, { useState } from 'react';
import { PageInfo, AuditFlag, Region } from '../../lib/types';
import { BACKEND_STATIC_URL } from '../../lib/api';
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Eye } from 'lucide-react';

interface PageViewerProps {
  page: PageInfo | null;
  flags: AuditFlag[];
  activeFlag: AuditFlag | null;
  onSelectFlag: (flag: AuditFlag) => void;
}

export const PageViewer: React.FC<PageViewerProps> = ({
  page,
  flags,
  activeFlag,
  onSelectFlag,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);

  if (!page) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8">
        <Eye className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">Select a page from the left sidebar to inspect</p>
      </div>
    );
  }

  const pageFlags = flags.filter(f => f.page_id === page.id || f.page_number === page.page_number);
  const fullImageUrl = page.image_url.startsWith('http')
    ? page.image_url
    : `${BACKEND_STATIC_URL}${page.image_url}`;

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-200">
            Page {page.page_number} Answer Sheet Canvas
          </span>
          {page.is_blank && (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
              BLANK PAGE
            </span>
          )}
          {pageFlags.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {pageFlags.length} Flagged Region{pageFlags.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-2 font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 transition-colors ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Page Image & Bounding Box Overlay Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start relative bg-slate-950">
        <div
          className="relative inline-block shadow-2xl rounded border border-slate-800 transition-transform duration-150"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Page Rendered Image */}
          {page.image_url ? (
            <img
              src={fullImageUrl}
              alt={`Page ${page.page_number}`}
              className="max-w-[700px] h-auto rounded block bg-white"
            />
          ) : (
            <div className="w-[600px] h-[800px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
              Page Image Unavailable
            </div>
          )}

          {/* Region Bounding Box Overlays */}
          {pageFlags.map((flag) => {
            if (!flag.region) return null;
            const isSelected = activeFlag?.id === flag.id;
            const r: Region = flag.region;

            return (
              <div
                key={flag.id}
                onClick={() => onSelectFlag(flag)}
                className={`absolute rounded transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/20 shadow-lg shadow-amber-500/20 ring-4 ring-amber-400/30 z-20 scale-[1.01]'
                    : 'border-blue-400/80 bg-blue-500/10 hover:border-amber-400 hover:bg-amber-400/10 z-10'
                }`}
                style={{
                  left: `${r.x * 100}%`,
                  top: `${r.y * 100}%`,
                  width: `${r.width * 100}%`,
                  height: `${r.height * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-slate-900/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {flag.type}: {Math.round(flag.confidence * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
