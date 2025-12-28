import { Plus, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              {mockCampaigns.map((campaign, i) => (
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
                  <TableCell className="text-muted-foreground">{campaign.targets.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
