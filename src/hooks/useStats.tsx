import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Stats {
  campaigns: number;
  targets: number;
  sent: number;
  replies: number;
}

export function useStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stats", user?.id],
    queryFn: async () => {
      const [campaignsRes, targetsRes, messagesRes, repliesRes] = await Promise.all([
        supabase.from("campaigns").select("*", { count: "exact", head: true }),
        supabase.from("targets").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "replied"),
      ]);

      return {
        campaigns: campaignsRes.count || 0,
        targets: targetsRes.count || 0,
        sent: messagesRes.count || 0,
        replies: repliesRes.count || 0,
      } as Stats;
    },
    enabled: !!user,
  });
}
