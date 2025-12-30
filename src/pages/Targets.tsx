import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTargets } from "@/hooks/useTargets";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function Targets() {
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const { data: targets, isLoading } = useTargets(campaignFilter);
  const { data: campaigns } = useCampaigns();

  return (
    <div className="animate-fade-in">
      <PageHeader title="Targets" />

      <div className="px-8 pb-8">
        <div className="mb-6">
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns?.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : targets?.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No targets found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Username</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Campaign</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targets?.map((target, i) => (
                  <TableRow 
                    key={target.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <TableCell className="font-medium font-mono text-sm">@{target.username}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {target.campaigns?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={target.status as "pending" | "messaged" | "replied"}>
                        {target.status}
                      </StatusBadge>
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
