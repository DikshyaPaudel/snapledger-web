import type {
  DuplicatesResponse, EnqueueResponse, JobResponse,
  Receipt, ReceiptConfirm, Summary,
} from "../types/api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    // FastAPI errors look like { detail: "..." }
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch { /* keep statusText */ }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  extract(file: File) {
    const form = new FormData();
    form.append("file", file); // field name must be "file"
    return request<EnqueueResponse>("/extract", { method: "POST", body: form });
  },
  getJob: (jobId: string) => request<JobResponse>(`/jobs/${jobId}`),
  saveReceipt: (payload: ReceiptConfirm) =>
    request<Receipt>("/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  getReceipts: () => request<Receipt[]>("/receipts"),
  getReceipt: (id: number) => request<Receipt>(`/receipts/${id}`),
  getSummary: () => request<Summary>("/summary"),
  getDuplicates: () => request<DuplicatesResponse>("/duplicates"),
};
