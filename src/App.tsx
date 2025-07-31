import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { ManagerDashboard } from "./pages/dashboards/ManagerDashboard";
import { EmployeeDashboard } from "./pages/dashboards/EmployeeDashboard";
import { StaffAppraisalsPage } from "./pages/StaffAppraisalsPage";
import { CalculationsPage } from "./pages/CalculationsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { DataPage } from "./pages/DataPage";
import { SettingsPage } from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/landing" replace />} />

            {/* Protected Application Layout */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            >
              {/* Nested routes will render inside the Index component's <Outlet /> */}
              <Route index element={<DashboardRouter />} /> {/* Default route for /app */}
              <Route path="dashboard" element={<DashboardRouter />} />
              <Route path="appraisals" element={<StaffAppraisalsPage />} />
              <Route path="calculations" element={<CalculationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="data" element={<DataPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Helper component to route to the correct dashboard based on user role
const DashboardRouter = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    switch (user.role) {
        case "Admin": return <AdminDashboard />;
        case "Manager": return <ManagerDashboard />;
        case "Employee": return <EmployeeDashboard />;
        default: return <NotFound />;
    }
};

export default App;