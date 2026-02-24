import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, ClipboardList, Activity, Calculator, CloudSun,
  TrendingUp, FileDown, Heart,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Health Assessment", path: "/assessment", icon: ClipboardList },
  { title: "Analysis & Charts", path: "/analysis", icon: Activity },
  { title: "Health Calculators", path: "/calculators", icon: Calculator },
  { title: "Weather Risk", path: "/weather", icon: CloudSun },
  { title: "Progress Tracker", path: "/progress", icon: TrendingUp },
  { title: "PDF Report", path: "/report", icon: FileDown },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">PulseGuard AI</span>
            <span className="text-[10px] text-sidebar-foreground/60">BP Prediction System</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-[10px] text-sidebar-foreground/40">© 2026 PulseGuard AI</p>
      </SidebarFooter>
    </Sidebar>
  );
}
