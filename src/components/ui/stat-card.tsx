import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl bg-card p-6 shadow-soft hover-lift cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-card-foreground tracking-tight">{value}</p>
        </div>
        <div className="rounded-xl bg-secondary p-2.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
