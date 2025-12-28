import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        active: "bg-success/10 text-success",
        paused: "bg-warning/10 text-warning",
        draft: "bg-secondary text-muted-foreground",
        pending: "bg-info/10 text-info",
        messaged: "bg-primary/10 text-primary",
        replied: "bg-success/10 text-success",
        sent: "bg-info/10 text-info",
        delivered: "bg-success/10 text-success",
        failed: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
