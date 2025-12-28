import { Plus, Pencil, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockCampaigns = [
  { id: 1, name: "Product Launch Outreach", status: "active", targets: 450 },
  { id: 2, name: "Influencer Collaboration", status: "paused", targets: 128 },
  { id: 3, name: "Brand Awareness Campaign", status: "draft", targets: 0 },
  { id: 4, name: "Customer Feedback Drive", status: "active", targets: 892 },
  { id: 5, name: "Holiday Promo", status: "draft", targets: 234 },
];

export default function Campaigns() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Campaigns"
        description="Manage your Instagram DM campaigns"
        action={
          <Link to="/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Targets</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <StatusBadge variant={campaign.status as "active" | "paused" | "draft"}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{campaign.targets.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
