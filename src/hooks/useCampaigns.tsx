import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  working_hours_start: number;
  working_hours_end: number;
  messages_per_day: number;
  created_at: string;
  targets_count?: number;
}

export function useCampaigns() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaigns", user?.id],
    queryFn: async () => {
      const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get target counts for each campaign
      const campaignsWithCounts = await Promise.all(
        (campaigns || []).map(async (campaign) => {
          const { count } = await supabase
            .from("targets")
            .select("*", { count: "exact", head: true })
            .eq("campaign_id", campaign.id);
          return { ...campaign, targets_count: count || 0 };
        })
      );

      return campaignsWithCounts as Campaign[];
    },
    enabled: !!user,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      working_hours_start: number;
      working_hours_end: number;
      messages_per_day: number;
    }) => {
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .insert({
          user_id: user!.id,
          name: data.name,
          description: data.description || null,
          working_hours_start: data.working_hours_start,
          working_hours_end: data.working_hours_end,
          messages_per_day: data.messages_per_day,
        })
        .select()
        .single();

      if (error) throw error;
      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("campaigns")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
