import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockTargets = [
  { id: 1, username: "@john_doe", campaign: "Product Launch", status: "pending" },
  { id: 2, username: "@jane_smith", campaign: "Product Launch", status: "messaged" },
  { id: 3, username: "@mike_wilson", campaign: "Influencer Collab", status: "replied" },
  { id: 4, username: "@sarah_connor", campaign: "Product Launch", status: "messaged" },
  { id: 5, username: "@alex_brown", campaign: "Brand Awareness", status: "pending" },
  { id: 6, username: "@lisa_jones", campaign: "Customer Feedback", status: "replied" },
  { id: 7, username: "@david_lee", campaign: "Influencer Collab", status: "pending" },
  { id: 8, username: "@emma_white", campaign: "Product Launch", status: "messaged" },
];

const campaigns = ["All Campaigns", "Product Launch", "Influencer Collab", "Brand Awareness", "Customer Feedback"];

export default function Targets() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Targets" description="Manage your target users" />

      <div className="p-8">
        <div className="mb-6">
          <Select defaultValue="All Campaigns">
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTargets.map((target) => (
                <TableRow key={target.id}>
                  <TableCell className="font-medium">{target.username}</TableCell>
                  <TableCell>{target.campaign}</TableCell>
                  <TableCell>
                    <StatusBadge variant={target.status as "pending" | "messaged" | "replied"}>
                      {target.status.charAt(0).toUpperCase() + target.status.slice(1)}
                    </StatusBadge>
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
