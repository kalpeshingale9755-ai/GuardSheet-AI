export interface PageInfo {
  id: string;
  document_id: string;
  page_number: number;
  image_url: string;
  is_blank: boolean;
  processing_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  coverage_status: 'NOT_REVIEWED' | 'ANALYZED' | 'FLAGGED' | 'REVIEWED';
  ai_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
}

export interface DocumentDetail {
  id: string;
  filename: string;
  page_count: number;
  status: 'UPLOADED' | 'PROCESSING' | 'ANALYZED' | 'ERROR';
  created_at: string;
  processed_pages_count: number;
  coverage_percentage: number;
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AuditFlag {
  id: string;
  document_id: string;
  page_id: string;
  page_number: number;
  type: 'REASONING' | 'PARTIAL_CREDIT' | 'ROUGH_WORK' | 'COVERAGE' | 'REVIEW_REQUIRED';
  title: string;
  description: string;
  evidence: string;
  region?: Region | null;
  confidence: number;
  status: 'OPEN' | 'ACCEPTED' | 'MODIFIED' | 'DISMISSED';
  decision_comment?: string | null;
  created_at: string;
}

export interface DecisionResponse {
  flag_id: string;
  status: 'ACCEPTED' | 'MODIFIED' | 'DISMISSED';
  decision: 'ACCEPT' | 'MODIFY' | 'DISMISS';
  comment?: string;
}
