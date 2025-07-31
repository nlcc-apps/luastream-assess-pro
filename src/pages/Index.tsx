import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the current page from the URL for the sidebar highlighting
  const currentPage = location.pathname.split('/').pop() || 'dashboard';

  const handlePageChange = (page: string) => {
    // Navigate to the new page within the /app/ structure
    navigate(`/app/${page}`);
  };

  const getPageTitle = () => {
    // You can expand this to return titles for each page
    switch (currentPage) {
      case "dashboard": return "Dashboard";
      case "appraisals": return "Staff Appraisals";
      case "reports": return "Performance Reports";
      case "data": return "Employee Data";
      case "calculations": return "KPI Calculator";
      case "settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} subtitle="Manage your team's performance" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Child routes from App.tsx will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Index;