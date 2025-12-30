import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface InstagramAccount {
  id: string;
  username: string;
  session_token: string | null;
  status: string;
  created_at: string;
}

export function useInstagramAccounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["instagram_accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instagram_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InstagramAccount[];
    },
    enabled: !!user,
  });
}

export function useAddInstagramAccount() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { username: string; session_token?: string }) => {
      const { data: account, error } = await supabase
        .from("instagram_accounts")
        .insert({
          user_id: user!.id,
          username: data.username,
          session_token: data.session_token || null,
        })
        .select()
        .single();

      if (error) throw error;
      return account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram_accounts"] });
    },
  });
}

export function useDeleteInstagramAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("instagram_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram_accounts"] });
    },
  });
}
