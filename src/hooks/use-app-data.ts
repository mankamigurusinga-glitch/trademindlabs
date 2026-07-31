import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { JournalEntryInsert, JournalEntryUpdate } from "@/types";

/* --------------------------------- profile -------------------------------- */

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: TablesUpdate<"profiles">) => {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user!.id, email: user!.email, ...patch })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

/* -------------------------------- settings -------------------------------- */

export function useSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateSettings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Omit<TablesUpdate<"user_settings">, "user_id">) => {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ user_id: user!.id, ...patch });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

/* -------------------------------- watchlist ------------------------------- */

export function useWatchlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["watchlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useWatchlistMutations() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["watchlist"] });

  const add = useMutation({
    mutationFn: async (input: { symbol: string; exchange: string }) => {
      const { error } = await supabase
        .from("watchlists")
        .insert({ ...input, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("watchlists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase
        .from("watchlists")
        .update({ is_favorite: value })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, remove, toggleFavorite };
}

/* ---------------------------------- alerts -------------------------------- */

export function useAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["alerts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { alerts, backendError } = await getAlertsFeed({ data: {} });
      if (backendError) {
        toast.error(backendError, { id: "alerts-backend" });
      }
      return alerts;
    },
  });
}


export function useAlertMutations() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["alerts"] });

  const create = useMutation({
    mutationFn: async (input: Omit<TablesInsert<"alerts">, "user_id">) => {
      const { error } = await supabase
        .from("alerts")
        .insert({ ...input, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"alerts"> }) => {
      const { error } = await supabase.from("alerts").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

/* --------------------------------- journal -------------------------------- */

export function useJournal() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["journal", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("opened_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useJournalMutations() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["journal"] });

  const create = useMutation({
    mutationFn: async (input: Omit<JournalEntryInsert, "user_id">) => {
      const { error } = await supabase
        .from("journal_entries")
        .insert({ ...input, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: JournalEntryUpdate }) => {
      const { error } = await supabase.from("journal_entries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
