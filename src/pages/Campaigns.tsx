import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCampaigns, useUpdateCampaignStatus, useDeleteCampaign } from "@/hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();
  const updateStatus = useUpdateCampaignStatus();
  const deleteCampaign = useDeleteCampaign();
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: `Campaign ${status}` });
    } catch {
      toast({ title: "Error updating campaign", variant: "destructive" });
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
                    <TableCell className="text-muted-foreground">
                      {(campaign.targets_count || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          {campaign.status !== "active" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "active")}>
                              Activate
                            </DropdownMenuItem>
                          )}
                          {campaign.status === "active" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "paused")}>
                              Pause
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
