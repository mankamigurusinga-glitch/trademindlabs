/**
 * TanStack Query hooks for the n8n backend account endpoints.
 * Every hook degrades gracefully when a webhook is unavailable.
 */
import { useQuery } from "@tanstack/react-query";
import { getAnalysisHistory, getSubscription } from "@/lib/trademind-account.functions";
import { useAuth } from "@/contexts/AuthContext";

export function useSubscription() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    retry: 1,
    queryFn: () => getSubscription({ data: undefined }),
  });
}

export function useAnalysisHistory(symbol?: string, limit = 25) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["analysis-history", user?.id, symbol ?? "all", limit],
    enabled: !!user,
    staleTime: 30_000,
    retry: 1,
    queryFn: () => getAnalysisHistory({ data: { symbol, limit } }),
  });
}
