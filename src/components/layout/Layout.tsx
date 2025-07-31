import { SidebarProvider } from "@/components/ui/sidebar";
import { NewSidebar } from "./NewSidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <NewSidebar />
        <div className="flex-1 flex flex-col">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}