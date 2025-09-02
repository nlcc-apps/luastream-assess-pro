import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { EvaluationModal } from "@/components/modals/EvaluationModal";

interface ManagerStats {
  directReports: number;
  pendingAppraisals: number;
  completedAppraisals: number;
  teamAverageRating: number;
}

interface TeamMember {
  id: number;
  employeeId: string; // Add this field
  name: string;
  position: string;
  lastReview: string;
  status: string;
  rating: string;
}

export function ManagerDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState<ManagerStats>({
    directReports: 0,
    pendingAppraisals: 0,
    completedAppraisals: 0,
    teamAverageRating: 0
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  useEffect(() => {
    const fetchManagerData = async () => {
      console.log("ManagerDashboard: Starting manager data fetch for user:", user?.email);
      try {
        // Fetch employees managed by current user
        const directReports = user?.email ? await api.getEmployeesByManager(user.email) : [];
        
        console.log("ManagerDashboard: Direct reports loaded:", directReports.length);
        setTeamMembers(directReports);
        setStats({
          directReports: directReports.length,
          pendingAppraisals: directReports.filter(emp => emp.status === 'pending').length,
          completedAppraisals: directReports.filter(emp => emp.status === 'active').length,
          teamAverageRating: directReports.length > 0 
            ? directReports.reduce((sum, emp) => sum + parseFloat(emp.rating || '0'), 0) / directReports.length
            : 0
        });
        console.log("ManagerDashboard: Stats calculated for manager");
      } catch (error) {
        console.error("ManagerDashboard: Failed to load manager dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load manager dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [toast, user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "pending": return "warning";
      case "overdue": return "destructive";
      default: return "secondary";
    }
  };

  const handleEvaluateEmployee = (employee: any) => {
    console.log("ManagerDashboard: Evaluate employee clicked for:", employee.employeeId, employee.name);
    setSelectedEmployee(employee);
    setIsEvaluationModalOpen(true);
  };

  const handleCreateTeamReport = async () => {
    console.log("ManagerDashboard: Create team report clicked");
    try {
      const teamAppraisals = user?.email ? await api.getAppraisalsForManagerTeam(user.email) : [];
      console.log("ManagerDashboard: Team appraisals fetched:", teamAppraisals.length);
      
      const reportData = {
        reportId: `TEAM_REPORT_${Date.now()}`,
        employeeName: `Team Report - ${user?.email || 'Manager'}`,
        reportContent: `Team Performance Report\nGenerated: ${new Date().toISOString()}\nTeam Size: ${teamMembers.length}\nTotal Appraisals: ${teamAppraisals.length}`,
        status: 'generated',
        createdDate: new Date().toISOString()
      };
      
      await api.createPerformanceReport(reportData);
      toast({
        title: "Team Report Created",
        description: `Generated team performance report with ${teamAppraisals.length} appraisals`,
      });
    } catch (error) {
      console.error("ManagerDashboard: Failed to create team report:", error);
      toast({
        title: "Error",
        description: "Failed to create team report",
        variant: "destructive",
      });
    }
  };

  const handleScheduleReviews = () => {
    console.log("ManagerDashboard: Schedule reviews clicked");
    toast({
      title: "Schedule Reviews",
      description: "Opening review scheduling interface for your team",
    });
    // Could open a scheduling modal or navigate to scheduling page
  };

  const handleViewTeamAnalytics = () => {
    console.log("ManagerDashboard: View team analytics clicked");
    toast({
      title: "Team Analytics",
      description: "Viewing comprehensive team performance analytics",
    });
    // Could navigate to a team analytics page
    // navigate('/app/team-analytics');
  };

  const handleViewProfile = (employeeId: string) => {
    console.log("ManagerDashboard: View profile clicked for employee:", employeeId);
    toast({
      title: "Employee Profile",
      description: `Viewing profile for employee ${employeeId}`,
    });
    // Could open employee profile modal or navigate to profile page
  };

  const handleEvaluateTeamMember = () => {
    console.log("ManagerDashboard: Evaluate Team Member button clicked");
    if (teamMembers.length > 0) {
      handleEvaluateEmployee(teamMembers[0]); // Default to first team member
    } else {
      toast({
        title: "No Team Members",
        description: "You don't have any team members to evaluate",
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    console.log("ManagerDashboard: Refreshing manager data");
    setLoading(true);
    const fetchManagerData = async () => {
      try {
        const directReports = user?.email ? await api.getEmployeesByManager(user.email) : [];
        
        console.log("ManagerDashboard: Data refreshed, direct reports:", directReports.length);
        setTeamMembers(directReports);
        setStats({
          directReports: directReports.length,
          pendingAppraisals: directReports.filter(emp => emp.status === 'pending').length,
          completedAppraisals: directReports.filter(emp => emp.status === 'active').length,
          teamAverageRating: directReports.length > 0 
            ? directReports.reduce((sum, emp) => sum + parseFloat(emp.rating || '0'), 0) / directReports.length
            : 0
        });
      } catch (error) {
        console.error("ManagerDashboard: Failed to refresh manager dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh manager dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  };

  if (loading) {
    return (
      <Layout title="Manager Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading manager dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Manager Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <Badge variant="secondary">Manager</Badge>
        </div>

        {/* Manager KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Direct Reports</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.directReports}</div>
              <p className="text-xs text-muted-foreground">Team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appraisals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppraisals}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAppraisals}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamAverageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Your Team</span>
              </div>
              <Button onClick={handleEvaluateTeamMember}>Evaluate Team Member</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant={getStatusColor(member.status) as any}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    <p className="text-xs text-muted-foreground">Last review: {member.lastReview}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold">{member.rating}/5</p>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEvaluateEmployee(member)}
                      >
                        Evaluate
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewProfile(member.employeeId)}>View Profile</Button>
                    </div>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No team members found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full" onClick={handleCreateTeamReport}>
                <FileText className="h-4 w-4 mr-2" />
                Create Team Report
              </Button>
              <Button variant="outline" className="w-full" onClick={handleScheduleReviews}>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Reviews
              </Button>
              <Button variant="outline" className="w-full" onClick={handleViewTeamAnalytics}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Team Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <EvaluationModal
        employee={selectedEmployee}
        open={isEvaluationModalOpen}
        onOpenChange={setIsEvaluationModalOpen}
        onEvaluationSubmitted={refreshData}
      />
    </Layout>
  );
}