import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CampaignSettings {
  id: string;
  user_id: string;
  webhook_url: string | null;
  webhook_secret: string | null;
  auto_retry: boolean;
  max_retries: number;
}

export function useCampaignSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaign-settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data as CampaignSettings | null;
    },
    enabled: !!user,
  });
}

export function useUpdateCampaignSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<CampaignSettings>) => {
      // Check if settings exist
      const { data: existing } = await supabase
        .from("campaign_settings")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("campaign_settings")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("user_id", user!.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("campaign_settings")
          .insert({ user_id: user!.id, ...data });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Settings saved" });
      queryClient.invalidateQueries({ queryKey: ["campaign-settings"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    },
  });
}