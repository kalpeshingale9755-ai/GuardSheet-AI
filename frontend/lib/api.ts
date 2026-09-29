import { DocumentDetail, PageInfo, AuditFlag, DecisionResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const BACKEND_STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL || 'http://localhost:8000';

export async function uploadDocument(file: File): Promise<{ document_id: string; filename: string; page_count: number; status: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errData.detail || 'Failed to upload answer sheet');
  }

  return res.json();
}

export async function getDocument(documentId: string): Promise<DocumentDetail> {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch document details');
  }
  return res.json();
}

export async function getPages(documentId: string): Promise<PageInfo[]> {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}/pages`);
  if (!res.ok) {
    throw new Error('Failed to fetch document pages');
  }
  const data = await res.json();
  return data.pages;
}

export async function analyzeDocument(documentId: string): Promise<{ document_id: string; status: string; message: string }> {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}/analyze`, {
    method: 'POST',
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errData.detail || 'AI analysis request failed');
  }
  return res.json();
}

export async function getFlags(documentId: string): Promise<AuditFlag[]> {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}/flags`);
  if (!res.ok) {
    throw new Error('Failed to fetch audit flags');
  }
  const data = await res.json();
  return data.flags;
}

export async function submitDecision(flagId: string, decision: 'ACCEPT' | 'MODIFY' | 'DISMISS', comment?: string): Promise<DecisionResponse> {
  const res = await fetch(`${API_BASE_URL}/flags/${flagId}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decision, comment }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Decision failed' }));
    throw new Error(errData.detail || 'Failed to submit decision');
  }
  return res.json();
}
