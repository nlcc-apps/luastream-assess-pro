import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { logout } = useAuth(); // Use the logout function from context

  return (
    <header className="bg-card border-b border-border p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground"><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={logout}> {/* Use logout here */}
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}