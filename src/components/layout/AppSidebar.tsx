import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Inbox,
  Mail,
  Columns3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Campaigns", path: "/campaigns", icon: Megaphone },
  { title: "Targets", path: "/targets", icon: Users },
  { title: "Inbox", path: "/inbox", icon: Inbox },
  { title: "Messages", path: "/messages", icon: Mail },
  { title: "CRM", path: "/crm", icon: Columns3 },
  { title: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-xs font-bold text-sidebar-primary-foreground">IR</span>
            </div>
            <span className="text-base font-semibold text-sidebar-primary tracking-tight">
              InstaReach
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sidebar-ring to-sidebar-muted flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-primary">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-primary truncate">
                User
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
