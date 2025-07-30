import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "./Dashboard";
import { StaffAppraisalsPage } from "./StaffAppraisalsPage";
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
        return <StaffAppraisalsPage />;
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
        return "Staff Performance Appraisals";
      case "calculations":
        return "Performance Calculation Tools";
      case "reports":
        return "Performance Reports & Analytics";
      case "data":
        return "Employee Data Management";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Overview of staff performance metrics and organizational KPIs";
      case "appraisals":
        return "Create and manage staff performance appraisals";
      case "calculations":
        return "Professional tools for performance rating calculations";
      case "reports":
        return "Generate and manage staff performance reports";
      case "data":
        return "Manage your employee database and HR records";
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
