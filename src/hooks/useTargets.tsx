import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Target {
  id: string;
  username: string;
  campaign_id: string | null;
  list_name: string | null;
  status: string;
  created_at: string;
  campaigns?: { name: string } | null;
}

export function useTargets(campaignId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["targets", user?.id, campaignId],
    queryFn: async () => {
      let query = supabase
        .from("targets")
        .select("*, campaigns(name)")
        .order("created_at", { ascending: false });

      if (campaignId && campaignId !== "all") {
        query = query.eq("campaign_id", campaignId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Target[];
    },
    enabled: !!user,
  });
}

export function useCreateTargets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { 
      usernames: string[]; 
      campaign_id?: string; 
      list_name?: string 
    }) => {
      const targetsToInsert = data.usernames.map((username) => ({
        user_id: user!.id,
        username: username.trim().replace(/^@/, ""),
        campaign_id: data.campaign_id || null,
        list_name: data.list_name || null,
      }));

      const { data: targets, error } = await supabase
        .from("targets")
        .insert(targetsToInsert)
        .select();

      if (error) throw error;
      return targets;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targets"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useParseCSV() {
  return (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(Boolean);
        
        // Check if first line is a header
        const firstLine = lines[0]?.toLowerCase();
        const hasHeader = firstLine?.includes("username") || firstLine?.includes("user");
        
        const usernames = hasHeader ? lines.slice(1) : lines;
        
        // Extract usernames - handle CSV with multiple columns
        const parsed = usernames.map((line) => {
          const parts = line.split(",");
          return parts[0]?.trim().replace(/^@/, "").replace(/"/g, "");
        }).filter(Boolean);

        resolve(parsed);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
}
