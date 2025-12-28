import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary/30">
      <AppSidebar />
      <main className="pl-[220px]">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
