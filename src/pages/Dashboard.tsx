import { Megaphone, Users, Send, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Campaigns", value: 12, icon: Megaphone },
  { title: "Targets", value: "2,847", icon: Users },
  { title: "Sent", value: "1,234", icon: Send },
  { title: "Replies", value: 89, icon: MessageSquare },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" />
      
      <div className="px-8 pb-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.title} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 rounded-2xl bg-card p-8 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Get started</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Create your first campaign to start reaching out to potential leads automatically.
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link to="/campaigns/new">
              <Button className="group">
                Create Campaign
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/targets">
              <Button variant="outline">
                Import Targets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
