import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

interface ManagerStats {
  directReports: number;
  pendingAppraisals: number;
  completedAppraisals: number;
  teamAverageRating: number;
}

interface TeamMember {
  id: number;
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

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        // Fetch employees and filter by manager (this would need to be implemented in the API)
        const employees = await api.getEmployees();
        
        // For demo purposes, we'll show all employees as direct reports
        // In a real application, you'd filter by managerId or similar
        const directReports = employees.filter(() => true); // This should filter by current user as manager
        
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
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "pending": return "warning";
      case "overdue": return "destructive";
      default: return "secondary";
    }
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
              <Button>Evaluate Team Member</Button>
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
                      <Button variant="ghost" size="sm">Evaluate</Button>
                      <Button variant="ghost" size="sm">View Profile</Button>
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
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Create Team Report
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Reviews
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Team Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}