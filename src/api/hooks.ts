import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { JobResponse } from "../types/api";
import { isExtractionError } from "../types/api";

export const useExtract = () => useMutation({ mutationFn: api.extract });

// Polls GET /jobs/{id} every 2s until the job completes (or the request errors).
export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => api.getJob(jobId!),
    enabled: !!jobId,
    retry: 1,
    refetchInterval: (query) =>
      query.state.status === "error" || query.state.data?.status === "complete" ? false : 2000,
  });
}

// Turns the raw job response into one simple UI state.
export function jobOutcome(job?: JobResponse) {
  if (!job || job.status !== "complete") return { state: "pending" as const };
  if (isExtractionError(job.result)) return { state: "failed" as const, message: job.result.error };
  return { state: "ready" as const, data: job.result };
}

export function useSaveReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.saveReceipt,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["duplicates"] });
    },
  });
}

export const useReceipts = () => useQuery({ queryKey: ["receipts"], queryFn: api.getReceipts });
export const useReceipt = (id: number) =>
  useQuery({ queryKey: ["receipts", id], queryFn: () => api.getReceipt(id) });
export const useSummary = () => useQuery({ queryKey: ["summary"], queryFn: api.getSummary });
export const useDuplicates = () => useQuery({ queryKey: ["duplicates"], queryFn: api.getDuplicates });
