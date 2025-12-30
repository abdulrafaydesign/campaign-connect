import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export interface MessageQueueItem {
  id: string;
  campaign_id: string;
  target_id: string;
  message_content: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';
  scheduled_at: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
  targets?: { username: string };
}

export interface CampaignStats {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  cancelled: number;
  total: number;
}

export function useMessageQueue(campaignId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["message-queue", campaignId],
    queryFn: async () => {
      let query = supabase
        .from("message_queue")
        .select("*, targets(username)")
        .order("scheduled_at", { ascending: true });

      if (campaignId) {
        query = query.eq("campaign_id", campaignId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MessageQueueItem[];
    },
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useCampaignStats(campaignId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaign-stats", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_queue")
        .select("status")
        .eq("campaign_id", campaignId);

      if (error) throw error;

      const stats: CampaignStats = {
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        cancelled: 0,
        total: data?.length || 0,
      };

      data?.forEach((msg) => {
        const status = msg.status as keyof CampaignStats;
        if (status in stats && status !== 'total') {
          stats[status]++;
        }
      });

      return stats;
    },
    enabled: !!user && !!campaignId,
    refetchInterval: 3000,
  });
}

export function useStartCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase.functions.invoke("process-messages", {
        body: { action: "start_campaign", campaign_id: campaignId, user_id: user!.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({ title: data.message || "Campaign started" });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["message-queue"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error starting campaign", description: error.message, variant: "destructive" });
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase.functions.invoke("process-messages", {
        body: { action: "pause_campaign", campaign_id: campaignId, user_id: user!.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Campaign paused" });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["message-queue"] });
    },
  });
}

export function useProcessQueue() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("process-messages", {
        body: { action: "process_queue", user_id: user!.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-queue"] });
      queryClient.invalidateQueries({ queryKey: ["targets"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
    },
  });
}

// Auto-processor hook that runs the queue
export function useAutoProcessor(enabled: boolean) {
  const processQueue = useProcessQueue();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      try {
        await processQueue.mutateAsync();
      } catch (error) {
        console.error("Queue processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 5000); // Process every 5 seconds

    return () => clearInterval(interval);
  }, [enabled, isProcessing]);

  return { isProcessing };
}

// Real-time subscription hook
export function useRealtimeQueue(campaignId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('message-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_queue',
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["message-queue", campaignId] });
          queryClient.invalidateQueries({ queryKey: ["campaign-stats", campaignId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, queryClient]);
}