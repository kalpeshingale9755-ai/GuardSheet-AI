'use client';

import React, { useState, useEffect } from 'react';
import { UploadZone } from '../components/upload/UploadZone';
import { UploadStatus } from '../components/upload/UploadStatus';
import { PageList } from '../components/review/PageList';
import { PageViewer } from '../components/review/PageViewer';
import { AuditFlag } from '../components/review/AuditFlag';
import { DecisionControls } from '../components/review/DecisionControls';
import { AuditSummary } from '../components/dashboard/AuditSummary';
import { DocumentDetail, PageInfo, AuditFlag as AuditFlagType } from '../lib/types';
import { uploadDocument, getDocument, getPages, analyzeDocument, getFlags, submitDecision } from '../lib/api';
import { ShieldCheck, FileCheck, Award, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState<'UPLOAD' | 'PROCESSING' | 'REVIEW' | 'SUMMARY'>('UPLOAD');
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [flags, setFlags] = useState<AuditFlagType[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [activeFlagId, setActiveFlagId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Upload custom File
  const handleFileSelected = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const uploadRes = await uploadDocument(file);
      const docDetail = await getDocument(uploadRes.document_id);
      const docPages = await getPages(uploadRes.document_id);

      setDocument(docDetail);
      setPages(docPages);
      if (docPages.length > 0) {
        setSelectedPageId(docPages[0].id);
      }
      setStep('PROCESSING');
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload & Process Demo Booklet
  const handleUseSample = async () => {
    setIsUploading(true);
    setError(null);
    try {
      // Fetch sample_answer_sheet.pdf from backend or public asset
      const sampleRes = await fetch('/sample_answer_sheet.pdf');
      let sampleBlob: Blob;
      if (sampleRes.ok) {
        sampleBlob = await sampleRes.blob();
      } else {
        // Fallback: create mock blob
        sampleBlob = new Blob(['%PDF-1.4 sample demo'], { type: 'application/pdf' });
      }

      const sampleFile = new File([sampleBlob], 'sample_answer_sheet.pdf', { type: 'application/pdf' });
      const uploadRes = await uploadDocument(sampleFile);
      const docDetail = await getDocument(uploadRes.document_id);
      const docPages = await getPages(uploadRes.document_id);

      setDocument(docDetail);
      setPages(docPages);
      if (docPages.length > 0) {
        setSelectedPageId(docPages[0].id);
      }
      setStep('PROCESSING');
    } catch (err: any) {
      // Direct demo call if blob fails
      try {
        const dummyFile = new File(['dummy content'], 'sample_answer_sheet.pdf', { type: 'application/pdf' });
        const uploadRes = await uploadDocument(dummyFile);
        const docDetail = await getDocument(uploadRes.document_id);
        const docPages = await getPages(uploadRes.document_id);
        setDocument(docDetail);
        setPages(docPages);
        if (docPages.length > 0) setSelectedPageId(docPages[0].id);
        setStep('PROCESSING');
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'Failed to initialize sample booklet.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger AI Analysis
  const handleStartAudit = async () => {
    if (!document) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      await analyzeDocument(document.id);
      const updatedDoc = await getDocument(document.id);
      const updatedPages = await getPages(document.id);
      const docFlags = await getFlags(document.id);

      setDocument(updatedDoc);
      setPages(updatedPages);
      setFlags(docFlags);

      if (docFlags.length > 0) {
        setActiveFlagId(docFlags[0].id);
        // Jump to page of first flag
        const firstFlagPage = updatedPages.find(p => p.id === docFlags[0].page_id || p.page_number === docFlags[0].page_number);
        if (firstFlagPage) {
          setSelectedPageId(firstFlagPage.id);
        }
      }

      setStep('REVIEW');
    } catch (err: any) {
      setError(err.message || 'Failed to complete AI analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Examiner Decision Handler
  const handleDecision = async (flagId: string, decision: 'ACCEPT' | 'MODIFY' | 'DISMISS', comment?: string) => {
    try {
      await submitDecision(flagId, decision, comment);
      if (document) {
        const updatedFlags = await getFlags(document.id);
        const updatedPages = await getPages(document.id);
        setFlags(updatedFlags);
        setPages(updatedPages);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record decision');
    }
  };

  // Selected Page object
  const selectedPage = pages.find(p => p.id === selectedPageId) || null;
  // Selected Flag object
  const activeFlag = flags.find(f => f.id === activeFlagId) || null;

  // Active page flags
  const activePageFlags = selectedPage
    ? flags.filter(f => f.page_id === selectedPage.id || f.page_number === selectedPage.page_number)
    : [];

  const openFlagsCount = flags.filter(f => f.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 leading-tight">GuardSheet AI</h1>
            <p className="text-[10px] text-slate-400 font-medium">Examination Audit & Evidence Layer</p>
          </div>
        </div>

        {/* Step Indicator Navigation */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-medium">
          <button
            onClick={() => step !== 'UPLOAD' && setStep('UPLOAD')}
            className={`px-3 py-1 rounded-full transition-all ${
              step === 'UPLOAD' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Upload
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => document && setStep('PROCESSING')}
            disabled={!document}
            className={`px-3 py-1 rounded-full transition-all disabled:opacity-40 ${
              step === 'PROCESSING' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Processing
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => document && setStep('REVIEW')}
            disabled={!document}
            className={`px-3 py-1 rounded-full transition-all disabled:opacity-40 ${
              step === 'REVIEW' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Review {flags.length > 0 ? `(${flags.length})` : ''}
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => document && setStep('SUMMARY')}
            disabled={!document}
            className={`px-3 py-1 rounded-full transition-all disabled:opacity-40 ${
              step === 'SUMMARY' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Summary
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {step === 'REVIEW' && (
            <button
              onClick={() => setStep('SUMMARY')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Award className="w-4 h-4" /> View Audit Summary
            </button>
          )}

          {document && (
            <button
              onClick={() => {
                setStep('UPLOAD');
                setDocument(null);
                setPages([]);
                setFlags([]);
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset Upload"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Body Content based on Active Step */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {step === 'UPLOAD' && (
          <div className="flex-1 p-6 md:p-12 overflow-y-auto flex items-center justify-center">
            <UploadZone
              onFileSelected={handleFileSelected}
              onUseSample={handleUseSample}
              isUploading={isUploading}
              error={error}
            />
          </div>
        )}

        {step === 'PROCESSING' && document && (
          <div className="flex-1 p-6 md:p-12 overflow-y-auto flex items-center justify-center">
            <UploadStatus
              document={document}
              pages={pages}
              isAnalyzing={isAnalyzing}
              onStartAudit={handleStartAudit}
            />
          </div>
        )}

        {step === 'REVIEW' && document && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Booklet Pages */}
            <PageList
              pages={pages}
              flags={flags}
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
            />

            {/* Middle: Answer Sheet Canvas */}
            <PageViewer
              page={selectedPage}
              flags={flags}
              activeFlag={activeFlag}
              onSelectFlag={(flag) => {
                setActiveFlagId(flag.id);
                const pageObj = pages.find(p => p.id === flag.page_id || p.page_number === flag.page_number);
                if (pageObj) setSelectedPageId(pageObj.id);
              }}
            />

            {/* Right Sidebar: Audit Findings & Examiner Decision Controls */}
            <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Audit Findings</h3>
                  <p className="text-[10px] text-slate-400">
                    {flags.length} Flag{flags.length !== 1 ? 's' : ''} detected ({openFlagsCount} Open)
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Page {selectedPage?.page_number || 1}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activePageFlags.length > 0 ? (
                  activePageFlags.map((flag) => (
                    <div key={flag.id} className="space-y-3">
                      <AuditFlag
                        flag={flag}
                        isSelected={activeFlagId === flag.id}
                        onSelect={() => setActiveFlagId(flag.id)}
                      />

                      {activeFlagId === flag.id && (
                        <DecisionControls
                          flag={flag}
                          onDecision={handleDecision}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-500 space-y-2">
                    <ShieldCheck className="w-8 h-8 mx-auto opacity-30 text-emerald-400" />
                    <p className="text-xs font-medium text-slate-400">No AI audit flags on Page {selectedPage?.page_number}</p>
                    <p className="text-[11px] text-slate-500">
                      Page verified cleanly by coverage and reasoning analysis.
                    </p>
                  </div>
                )}

                {/* Other Page Flags Quick Selector */}
                {flags.length > activePageFlags.length && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Other Flagged Pages
                    </p>
                    <div className="space-y-1.5">
                      {flags.filter(f => !activePageFlags.some(apf => apf.id === f.id)).map((otherFlag) => (
                        <button
                          key={otherFlag.id}
                          onClick={() => {
                            setActiveFlagId(otherFlag.id);
                            const pObj = pages.find(p => p.id === otherFlag.page_id || p.page_number === otherFlag.page_number);
                            if (pObj) setSelectedPageId(pObj.id);
                          }}
                          className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center justify-between transition-colors"
                        >
                          <span className="text-slate-300 font-medium truncate max-w-[200px]">
                            {otherFlag.title}
                          </span>
                          <span className="font-mono text-slate-400 text-[10px]">
                            P.{otherFlag.page_number}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'SUMMARY' && document && (
          <div className="flex-1 p-6 md:p-12 overflow-y-auto">
            <AuditSummary
              document={document}
              pages={pages}
              flags={flags}
              onBackToReview={() => setStep('REVIEW')}
              onResetUpload={() => {
                setStep('UPLOAD');
                setDocument(null);
                setPages([]);
                setFlags([]);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
