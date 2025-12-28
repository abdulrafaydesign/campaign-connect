import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockMessages = [
  { id: 1, sentTo: "@john_doe", sentFrom: "@brand_official", campaign: "Product Launch", status: "delivered", date: "Jan 15, 10:30" },
  { id: 2, sentTo: "@jane_smith", sentFrom: "@brand_official", campaign: "Product Launch", status: "sent", date: "Jan 15, 10:25" },
  { id: 3, sentTo: "@mike_wilson", sentFrom: "@marketing_team", campaign: "Influencer Collab", status: "delivered", date: "Jan 15, 09:45" },
  { id: 4, sentTo: "@sarah_connor", sentFrom: "@brand_official", campaign: "Product Launch", status: "failed", date: "Jan 15, 09:30" },
  { id: 5, sentTo: "@alex_brown", sentFrom: "@sales_dept", campaign: "Brand Awareness", status: "delivered", date: "Jan 14, 16:20" },
];

export default function Messages() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Messages" />

      <div className="px-8 pb-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Select defaultValue="any">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="product">Product Launch</SelectItem>
              <SelectItem value="influencer">Influencer Collab</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Search..." className="w-48" />

          <Button variant="outline">Reset</Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">To</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">From</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Campaign</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMessages.map((m, i) => (
                <TableRow key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <TableCell className="font-medium font-mono text-sm">{m.sentTo}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{m.sentFrom}</TableCell>
                  <TableCell className="text-muted-foreground">{m.campaign}</TableCell>
                  <TableCell>
                    <StatusBadge variant={m.status as "sent" | "delivered" | "failed"}>
                      {m.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
