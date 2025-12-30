import { useCampaignStats, useRealtimeQueue } from "@/hooks/useMessageQueue";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, Loader2, XCircle } from "lucide-react";

interface CampaignProgressProps {
  campaignId: string;
  className?: string;
}

export function CampaignProgress({ campaignId, className }: CampaignProgressProps) {
  const { data: stats, isLoading } = useCampaignStats(campaignId);
  
  // Subscribe to real-time updates
  useRealtimeQueue(campaignId);

  if (isLoading || !stats) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (stats.total === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No messages queued
      </div>
    );
  }

  const progressPercent = ((stats.sent + stats.failed) / stats.total) * 100;
  const isComplete = stats.pending === 0 && stats.processing === 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isComplete ? "Complete" : "In Progress"}
        </span>
        <span className="text-sm text-muted-foreground">
          {stats.sent + stats.failed} / {stats.total}
        </span>
      </div>
      
      <Progress value={progressPercent} className="h-2" />
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Pending:</span>
          <span className="font-medium">{stats.pending}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Loader2 className={cn(
            "h-3.5 w-3.5",
            stats.processing > 0 ? "animate-spin text-primary" : "text-muted-foreground"
          )} />
          <span className="text-muted-foreground">Processing:</span>
          <span className="font-medium">{stats.processing}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-success" />
          <span className="text-muted-foreground">Sent:</span>
          <span className="font-medium text-success">{stats.sent}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-muted-foreground">Failed:</span>
          <span className="font-medium text-destructive">{stats.failed}</span>
        </div>
      </div>

      {stats.cancelled > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <XCircle className="h-3.5 w-3.5 text-warning" />
          <span className="text-muted-foreground">Cancelled:</span>
          <span className="font-medium">{stats.cancelled}</span>
        </div>
      )}
    </div>
  );
}