import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  BarChart3, 
  Database, 
  Calculator,
  Settings,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "appraisals", label: "Staff Appraisals", icon: FileText },
  { id: "calculations", label: "KPI Calculator", icon: Calculator },
  { id: "reports", label: "Performance Reports", icon: BarChart3 },
  { id: "data", label: "Employee Data", icon: Database },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <div>
                <h1 className="text-sidebar-foreground font-bold text-lg">L.U.A.S</h1>
                <p className="text-sidebar-foreground/60 text-xs">Staff KPI System</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "professional" : "ghost"}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-0",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
              )}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "text-xs text-sidebar-foreground/60",
          collapsed && "text-center"
        )}>
          {collapsed ? "v1.0" : "Version 1.0.0"}
        </div>
      </div>
    </div>
  );
}