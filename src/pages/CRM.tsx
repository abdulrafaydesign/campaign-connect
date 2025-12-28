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
];

const columns = [
  { id: "responses", title: "Responses", accent: "bg-info" },
  { id: "interested", title: "Interested", accent: "bg-success" },
  { id: "not-interested", title: "Not Interested", accent: "bg-destructive" },
];

export default function CRM() {
  const [leads, setLeads] = useState(initialLeads);

  const updateStatus = (id: number, status: Lead["status"]) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const getLeads = (status: Lead["status"]) => leads.filter((l) => l.status === status);

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      <PageHeader title="CRM" />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("w-2 h-2 rounded-full", col.accent)} />
                <h3 className="text-sm font-medium">{col.title}</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {getLeads(col.id as Lead["status"]).length}
                </span>
              </div>

              <div className="flex-1 rounded-2xl bg-secondary/50 p-3 space-y-2 overflow-y-auto">
                {getLeads(col.id as Lead["status"]).map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-card rounded-xl p-4 shadow-soft hover-lift animate-scale-in"
                  >
                    <p className="font-medium text-sm mb-1">{lead.username}</p>
                    <p className="text-xs text-muted-foreground mb-3">{lead.campaign}</p>
                    <Select
                      value={lead.status}
                      onValueChange={(v) => updateStatus(lead.id, v as Lead["status"])}
                    >
                      <SelectTrigger className="h-7 text-xs">
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

                {getLeads(col.id as Lead["status"]).length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-8">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
