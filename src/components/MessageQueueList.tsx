import { useMessageQueue } from "@/hooks/useMessageQueue";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle, Clock, AlertCircle, Loader2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageQueueListProps {
  campaignId: string;
  className?: string;
  maxHeight?: string;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; animate?: boolean }> = {
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  processing: { icon: Loader2, color: "text-primary", bg: "bg-primary/10", animate: true },
  sent: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  failed: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  cancelled: { icon: XCircle, color: "text-warning", bg: "bg-warning/10" },
};

export function MessageQueueList({ campaignId, className, maxHeight = "400px" }: MessageQueueListProps) {
  const { data: messages, isLoading } = useMessageQueue(campaignId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No messages in queue
      </div>
    );
  }

  return (
    <ScrollArea className={className} style={{ maxHeight }}>
      <div className="space-y-2 pr-4">
        {messages.map((message) => {
          const config = statusConfig[message.status];
          const Icon = config.icon;

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                config.bg,
                "border-border/50"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0",
                config.color,
                config.animate && "animate-spin"
              )} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium truncate">
                    @{message.targets?.username}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded uppercase tracking-wider",
                    config.bg,
                    config.color
                  )}>
                    {message.status}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {message.message_content}
                </p>
                
                {message.error_message && (
                  <p className="text-xs text-destructive mt-1">
                    {message.error_message}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {message.sent_at 
                  ? format(new Date(message.sent_at), "HH:mm:ss")
                  : format(new Date(message.scheduled_at), "HH:mm:ss")
                }
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}