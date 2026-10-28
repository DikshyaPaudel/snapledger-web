// Types matching the SnapLedger FastAPI backend (main.py, extraction.py, database.py).

export type DocumentType = "receipt" | "sales_invoice" | "purchase_invoice";
export type Confidence = "high" | "medium" | "low";

export interface LineItem {
  description: string | null;
  amount: number | null;
}

// ---- Extraction (POST /extract, GET /jobs/{id}) ----

export interface ExtractedData {
  is_receipt: true;
  vendor: string | null;
  date: string | null; // YYYY-MM-DD
  total_amount: number | null;
  currency: string | null;
  category: string | null; // prompt asks for food|transport|utilities|shopping|health|other, but the model can drift
  line_items: LineItem[] | null;
  confidence: Confidence | null;
}

// A job can be "complete" and still have failed: run_extraction() returns {error} as a normal result.
export interface ExtractionError {
  error: string;
}

export type ExtractionResult = ExtractedData | ExtractionError;

export function isExtractionError(r: ExtractionResult): r is ExtractionError {
  return "error" in r;
}

export interface EnqueueResponse {
  job_id: string;
  status: "queued";
}

// arq statuses (redis mode); inline mode only uses "in_progress" and "complete".
export type JobResponse =
  | { status: "deferred" | "queued" | "in_progress"; result?: null }
  | { status: "complete"; result: ExtractionResult };

// ---- Saved documents (POST/GET /receipts) ----

export interface ReceiptConfirm {
  vendor?: string | null;
  date?: string | null;
  total_amount?: number | null;
  currency?: string | null;
  category?: string | null;
  confidence?: string | null;
  line_items?: LineItem[] | null;
  document_type: DocumentType;
}

export interface Receipt {
  id: number;
  vendor: string | null;
  date: string | null;
  total_amount: number | null;
  currency: string | null;
  category: string | null;
  confidence: string | null;
  line_items: LineItem[] | null;
  document_type: DocumentType | null;
  created_at: string; // ISO datetime
}

// ---- Summary / duplicates ----

export interface Summary {
  total_spent: number;
  total_receipts: number;
  by_category: { category: string; total: number; count: number }[];
}

export interface DuplicateGroup {
  vendor: string;
  total_amount: number;
  receipt_ids: number[];
  count: number;
}

export interface DuplicatesResponse {
  duplicate_groups_found: number;
  groups: DuplicateGroup[];
}
