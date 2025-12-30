import { useState } from "react";
import { Plus, MoreHorizontal, Play, Pause, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCampaigns, useUpdateCampaignStatus, useDeleteCampaign } from "@/hooks/useCampaigns";
import { useStartCampaign, usePauseCampaign, useAutoProcessor } from "@/hooks/useMessageQueue";
import { useToast } from "@/hooks/use-toast";
import { CampaignProgress } from "@/components/CampaignProgress";
import { MessageQueueList } from "@/components/MessageQueueList";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();
  const updateStatus = useUpdateCampaignStatus();
  const deleteCampaign = useDeleteCampaign();
  const startCampaign = useStartCampaign();
  const pauseCampaign = usePauseCampaign();
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Auto-process queue when any campaign is active
  const hasActiveCampaign = campaigns?.some(c => c.status === "active");
  useAutoProcessor(hasActiveCampaign || false);

  const handleStart = async (id: string) => {
    try {
      await startCampaign.mutateAsync(id);
    } catch {
      toast({ title: "Error starting campaign", variant: "destructive" });
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseCampaign.mutateAsync(id);
    } catch {
      toast({ title: "Error pausing campaign", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign.mutateAsync(id);
      toast({ title: "Campaign deleted" });
    } catch {
      toast({ title: "Error deleting campaign", variant: "destructive" });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Campaigns"
        action={
          <Link to="/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        }
      />

      <div className="px-8 pb-8">
        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : campaigns?.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No campaigns yet</p>
              <Link to="/campaigns/new">
                <Button className="mt-4">Create your first campaign</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Progress</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Targets</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns?.map((campaign, i) => (
                  <TableRow 
                    key={campaign.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <StatusBadge variant={campaign.status as "active" | "paused" | "draft"}>
                        {campaign.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <CampaignProgress campaignId={campaign.id} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(campaign.targets_count || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {campaign.status !== "active" ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleStart(campaign.id)}
                            disabled={startCampaign.isPending}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handlePause(campaign.id)}
                            disabled={pauseCampaign.isPending}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setSelectedCampaign(campaign.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => setSelectedCampaign(campaign.id)}>
                              View Queue
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(campaign.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Message Queue Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Queue</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <CampaignProgress campaignId={selectedCampaign} />
              <MessageQueueList campaignId={selectedCampaign} maxHeight="400px" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
