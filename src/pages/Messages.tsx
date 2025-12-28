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
  { id: 1, sentTo: "@john_doe", sentFrom: "@brand_official", campaign: "Product Launch", status: "delivered", date: "2024-01-15 10:30" },
  { id: 2, sentTo: "@jane_smith", sentFrom: "@brand_official", campaign: "Product Launch", status: "sent", date: "2024-01-15 10:25" },
  { id: 3, sentTo: "@mike_wilson", sentFrom: "@marketing_team", campaign: "Influencer Collab", status: "delivered", date: "2024-01-15 09:45" },
  { id: 4, sentTo: "@sarah_connor", sentFrom: "@brand_official", campaign: "Product Launch", status: "failed", date: "2024-01-15 09:30" },
  { id: 5, sentTo: "@alex_brown", sentFrom: "@sales_dept", campaign: "Brand Awareness", status: "delivered", date: "2024-01-14 16:20" },
  { id: 6, sentTo: "@lisa_jones", sentFrom: "@brand_official", campaign: "Customer Feedback", status: "sent", date: "2024-01-14 15:10" },
];

export default function Messages() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Messages" description="View all sent messages" />

      <div className="p-8">
        {/* Filters */}
        <div className="mb-6 p-4 rounded-xl border border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select defaultValue="any">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="success">
              <SelectTrigger>
                <SelectValue placeholder="Message State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="any">
              <SelectTrigger>
                <SelectValue placeholder="Message Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="first">First Message</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="product">Product Launch</SelectItem>
                <SelectItem value="influencer">Influencer Collab</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Sent To" />

            <div className="flex gap-2">
              <Button className="flex-1">Search</Button>
              <Button variant="outline" className="flex-1">Reset</Button>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sent To</TableHead>
                <TableHead>Sent From</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.sentTo}</TableCell>
                  <TableCell>{message.sentFrom}</TableCell>
                  <TableCell>{message.campaign}</TableCell>
                  <TableCell>
                    <StatusBadge variant={message.status as "sent" | "delivered" | "failed"}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{message.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
