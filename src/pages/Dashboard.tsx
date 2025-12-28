import { Megaphone, Users, Send, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

const stats = [
  { title: "Total Campaigns", value: 12, icon: Megaphone },
  { title: "Total Targets", value: "2,847", icon: Users },
  { title: "Messages Sent", value: "1,234", icon: Send },
  { title: "Replies Received", value: 89, icon: MessageSquare },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" description="Overview of your Instagram DM automation" />
      
      <div className="p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
        
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating a new campaign or importing your target list.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/campaigns/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create Campaign
            </a>
            <a
              href="/targets"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
            >
              Manage Targets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
