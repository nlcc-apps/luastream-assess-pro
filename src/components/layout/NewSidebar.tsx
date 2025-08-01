import { useState } from "react";
import { Home, FileText, Calculator, BarChart3, Database, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function NewSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const getNavigation = () => {
    const baseItems = [
      { name: "Dashboard", href: "/app/dashboard", icon: Home },
      { name: "Staff Appraisals", href: "/app/appraisals", icon: FileText },
    ];

    if (user?.role === "Admin") {
      return [
        ...baseItems,
        { name: "KPI Calculator", href: "/app/calculations", icon: Calculator },
        { name: "Performance Reports", href: "/app/reports", icon: BarChart3 },
        { name: "Employee Data", href: "/app/data", icon: Database },
        { name: "Settings", href: "/app/settings", icon: Settings },
      ];
    } else if (user?.role === "Manager") {
      return [
        ...baseItems,
        { name: "Performance Reports", href: "/app/reports", icon: BarChart3 },
        { name: "Employee Data", href: "/app/data", icon: Database },
      ];
    }
    return baseItems;
  };

  const navigation = getNavigation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              {!collapsed && (
                <div>
                  <h1 className="font-bold text-lg">L.U.A.S</h1>
                  <p className="text-xs text-muted-foreground">Staff KPI System</p>
                </div>
              )}
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}