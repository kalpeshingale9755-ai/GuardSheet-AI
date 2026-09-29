'use client';

import React, { useState } from 'react';
import { AuditFlag } from '../../lib/types';
import { Check, Edit3, X, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

interface DecisionControlsProps {
  flag: AuditFlag;
  onDecision: (flagId: string, decision: 'ACCEPT' | 'MODIFY' | 'DISMISS', comment?: string) => Promise<void>;
}

export const DecisionControls: React.FC<DecisionControlsProps> = ({
  flag,
  onDecision,
}) => {
  const [comment, setComment] = useState<string>(flag.decision_comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  const handleAction = async (decision: 'ACCEPT' | 'MODIFY' | 'DISMISS') => {
    setIsSubmitting(true);
    try {
      await onDecision(flag.id, decision, comment.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> Examiner Control
        </span>
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {showCommentInput ? 'Hide Note' : 'Add Note'}
        </button>
      </div>

      {showCommentInput && (
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">
            Examiner Audit Reason / Note (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter rationale for examiner decision..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      )}

      {/* Action Buttons: Accept / Modify / Dismiss */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleAction('ACCEPT')}
          disabled={isSubmitting}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
            flag.status === 'ACCEPTED'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white'
          } disabled:opacity-50`}
        >
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Accept
        </button>

        <button
          onClick={() => handleAction('MODIFY')}
          disabled={isSubmitting}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
            flag.status === 'MODIFIED'
              ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
          } disabled:opacity-50`}
        >
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
          Modify
        </button>

        <button
          onClick={() => handleAction('DISMISS')}
          disabled={isSubmitting}
          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
            flag.status === 'DISMISSED'
              ? 'bg-slate-700 text-white ring-2 ring-slate-400/50'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
          } disabled:opacity-50`}
        >
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Dismiss
        </button>
      </div>
    </div>
  );
};
