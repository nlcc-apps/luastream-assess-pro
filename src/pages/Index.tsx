import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "./Dashboard";
import { AppraisalsPage } from "./AppraisalsPage";
import { CalculationsPage } from "./CalculationsPage";
import { ReportsPage } from "./ReportsPage";
import { DataPage } from "./DataPage";
import { SettingsPage } from "./SettingsPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const getPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "appraisals":
        return <AppraisalsPage />;
      case "calculations":
        return <CalculationsPage />;
      case "reports":
        return <ReportsPage />;
      case "data":
        return <DataPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "appraisals":
        return "Property Appraisals";
      case "calculations":
        return "Calculation Tools";
      case "reports":
        return "Reports & Analytics";
      case "data":
        return "Data Management";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Overview of your appraisal activities and key metrics";
      case "appraisals":
        return "Create and manage property appraisals";
      case "calculations":
        return "Professional tools for property valuation calculations";
      case "reports":
        return "Generate and manage appraisal reports";
      case "data":
        return "Manage your property database and records";
      case "settings":
        return "Configure your account and system preferences";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        
        <main className="flex-1 p-6">
          {getPageContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
