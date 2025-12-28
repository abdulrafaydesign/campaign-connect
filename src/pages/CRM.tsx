import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Lead {
  id: number;
  username: string;
  campaign: string;
  status: "responses" | "interested" | "not-interested";
}

const initialLeads: Lead[] = [
  { id: 1, username: "@john_doe", campaign: "Product Launch", status: "responses" },
  { id: 2, username: "@jane_smith", campaign: "Product Launch", status: "interested" },
  { id: 3, username: "@mike_wilson", campaign: "Influencer Collab", status: "responses" },
  { id: 4, username: "@sarah_connor", campaign: "Brand Awareness", status: "not-interested" },
  { id: 5, username: "@alex_brown", campaign: "Product Launch", status: "interested" },
  { id: 6, username: "@lisa_jones", campaign: "Customer Feedback", status: "responses" },
];

const columns = [
  { id: "responses", title: "Responses", color: "bg-kanban-responses" },
  { id: "interested", title: "Interested", color: "bg-kanban-interested" },
  { id: "not-interested", title: "Not Interested", color: "bg-kanban-not-interested" },
];

export default function CRM() {
  const [leads, setLeads] = useState(initialLeads);

  const updateLeadStatus = (leadId: number, newStatus: Lead["status"]) => {
    setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)));
  };

  const getLeadsByStatus = (status: Lead["status"]) => leads.filter((lead) => lead.status === status);

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      <PageHeader title="CRM" description="Manage your leads pipeline" />

      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {getLeadsByStatus(column.id as Lead["status"]).length}
                </span>
              </div>

              <div
                className={cn(
                  "flex-1 rounded-xl border border-border p-4 space-y-3 overflow-y-auto",
                  column.color
                )}
              >
                {getLeadsByStatus(column.id as Lead["status"]).map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-card-foreground mb-1">{lead.username}</div>
                    <div className="text-sm text-muted-foreground mb-3">{lead.campaign}</div>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateLeadStatus(lead.id, value as Lead["status"])}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="responses">Responses</SelectItem>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="not-interested">Not Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                {getLeadsByStatus(column.id as Lead["status"]).length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">No leads</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
