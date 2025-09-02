import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, TrendingUp, Award, FileText, Target, Settings, UserPlus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { BulkImportModal } from "@/components/modals/BulkImportModal";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalAppraisals: number;
  averageOverallRating: number;
  totalEmployees: number;
  pendingReviews: number;
  onTimeCompletionRate: number;
  employeeSatisfaction: number;
}

interface TeamPerformance {
  department: string;
  averageRating: number;
  totalAppraisals: number;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("AdminDashboard: Starting dashboard data fetch");
      try {
        const [statsData, teamData] = await Promise.all([
          api.getDashboardStats(),
          api.getTeamPerformanceComparison()
        ]);
        console.log("AdminDashboard: Dashboard data loaded:", { statsData, teamData });
        setStats(statsData);
        setTeamPerformance(teamData);
      } catch (error) {
        console.error("AdminDashboard: Failed to load dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const handleGenerateSystemReport = async () => {
    console.log("AdminDashboard: Generate system report clicked");
    try {
      const reports = await api.getPerformanceReports();
      console.log("AdminDashboard: System reports fetched:", reports.length);
      toast({
        title: "System Report Generated",
        description: `Generated report with ${reports.length} performance records`,
      });
      navigate('/app/reports');
    } catch (error) {
      console.error("AdminDashboard: Failed to generate system report:", error);
      toast({
        title: "Error",
        description: "Failed to generate system report",
        variant: "destructive",
      });
    }
  };

  const handleBulkEmployeeImport = () => {
    console.log("AdminDashboard: Bulk employee import clicked");
    setIsBulkImportOpen(true);
  };

  const handleSystemSettings = () => {
    console.log("AdminDashboard: System settings clicked");
    navigate('/app/settings');
    toast({
      title: "Navigating to Settings",
      description: "Opening system settings page",
    });
  };

  const handleUserManagement = () => {
    console.log("AdminDashboard: User management clicked");
    navigate('/app/data');
    toast({
      title: "Navigating to User Management",
      description: "Opening employee database",
    });
  };

  const refreshDashboard = () => {
    console.log("AdminDashboard: Refreshing dashboard data");
    setLoading(true);
    const fetchDashboardData = async () => {
      try {
        const [statsData, teamData] = await Promise.all([
          api.getDashboardStats(),
          api.getTeamPerformanceComparison()
        ]);
        console.log("AdminDashboard: Dashboard data refreshed");
        setStats(statsData);
        setTeamPerformance(teamData);
      } catch (error) {
        console.error("AdminDashboard: Failed to refresh dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading admin dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="secondary">Administrator</Badge>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
              <p className="text-xs text-muted-foreground">Active workforce</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appraisals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppraisals || 0}</div>
              <p className="text-xs text-muted-foreground">Completed reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageOverallRating?.toFixed(1) || "0.0"}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingReviews || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.onTimeCompletionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.employeeSatisfaction || 0}%</div>
              <p className="text-xs text-muted-foreground">Satisfaction score</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Department Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{dept.department}</h3>
                    <p className="text-sm text-muted-foreground">{dept.totalAppraisals} appraisals</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{dept.averageRating.toFixed(1)}/5.0</div>
                    <div className="text-sm text-muted-foreground">Average rating</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="w-full" onClick={handleGenerateSystemReport}>
                <FileText className="h-4 w-4 mr-2" />
                Generate System Report
              </Button>
              <Button variant="outline" className="w-full" onClick={handleBulkEmployeeImport}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Employee Import
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSystemSettings}>
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full" onClick={handleUserManagement}>
                <UserPlus className="h-4 w-4 mr-2" />
                User Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BulkImportModal
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImportComplete={refreshDashboard}
      />
    </Layout>
  );
}