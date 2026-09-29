'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  onUseSample: () => void;
  isUploading: boolean;
  error?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelected,
  onUseSample,
  isUploading,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Product Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> GuardSheet AI Audit Prototype
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          AI-Assisted Examination Audit Layer
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Deterministic coverage guardrail & evidence-backed audit flags.
          <br />
          <span className="text-slate-300 font-medium">Human examiner remains in full authority.</span>
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900/90'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-200">
              Upload Answer Sheet PDF
            </p>
            <p className="text-xs text-slate-400">
              Drag & drop standard candidate answer booklet PDF here, or click to browse
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800">
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Supported format: PDF
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-200">Uploading & extracting document pages...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Shortcut Card */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span>Sample Answer Booklet</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">6 PAGES</span>
          </div>
          <p className="text-xs text-slate-400">
            Standard candidate script containing calculus, differential equations, rough work, and blank page.
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUseSample();
          }}
          disabled={isUploading}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-blue-500/20 disabled:opacity-50 whitespace-nowrap"
        >
          Use Demo Booklet <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
