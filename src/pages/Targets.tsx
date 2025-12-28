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
];

export default function Targets() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Targets" />

      <div className="px-8 pb-8">
        <div className="mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="product">Product Launch</SelectItem>
              <SelectItem value="influencer">Influencer Collab</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">Username</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Campaign</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTargets.map((target, i) => (
                <TableRow 
                  key={target.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <TableCell className="font-medium font-mono text-sm">{target.username}</TableCell>
                  <TableCell className="text-muted-foreground">{target.campaign}</TableCell>
                  <TableCell>
                    <StatusBadge variant={target.status as "pending" | "messaged" | "replied"}>
                      {target.status}
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
