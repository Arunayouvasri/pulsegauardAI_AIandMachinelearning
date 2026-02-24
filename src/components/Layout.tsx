import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assessment": "Health Assessment",
  "/analysis": "Analysis & Charts",
  "/calculators": "Health Calculators",
  "/weather": "Weather Risk",
  "/progress": "Progress Tracker",
  "/report": "PDF Report",
};

export function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "PulseGuard AI";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
