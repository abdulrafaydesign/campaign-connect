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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-accent-foreground tracking-tight">
            InstaReach
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center text-success-foreground text-sm font-semibold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                User
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                user@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
