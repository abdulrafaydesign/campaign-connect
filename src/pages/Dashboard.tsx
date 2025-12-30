import { Megaphone, Users, Send, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  const statItems = [
    { title: "Campaigns", value: stats?.campaigns || 0, icon: Megaphone },
    { title: "Targets", value: stats?.targets?.toLocaleString() || "0", icon: Users },
    { title: "Sent", value: stats?.sent?.toLocaleString() || "0", icon: Send },
    { title: "Replies", value: stats?.replies || 0, icon: MessageSquare },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" />
      
      <div className="px-8 pb-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          ) : (
            statItems.map((stat, i) => (
              <div key={stat.title} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                />
              </div>
            ))
          )}
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
