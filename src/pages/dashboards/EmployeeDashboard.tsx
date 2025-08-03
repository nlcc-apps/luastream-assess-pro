import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Star, TrendingUp, Target, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface EmployeeStats {
  myAppraisals: number;
  pendingActions: number;
  completedGoals: number;
  averageRating: number;
}

interface AppraisalStatus {
  id: number;
  title: string;
  status: string;
  submittedDate: string;
  overallRating?: number;
}

export function EmployeeDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EmployeeStats>({
    myAppraisals: 0,
    pendingActions: 0,
    completedGoals: 0,
    averageRating: 0
  });
  const [myAppraisals, setMyAppraisals] = useState<AppraisalStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch appraisals for the current employee
        const appraisals = await api.getStaffAppraisals();
        
        // Filter appraisals for current user
        const myAppraisalsList = user?.email ? 
          await api.getAppraisalsByEmployee(user.email) : [];
        
        const formattedAppraisals = myAppraisalsList.map((appraisal: any) => ({
          id: appraisal.id,
          title: appraisal.employeeName || 'Staff Appraisal',
          status: appraisal.status || 'Pending',
          submittedDate: appraisal.submittedDate || new Date().toISOString(),
          overallRating: appraisal.overallRating
        }));
        
        setMyAppraisals(formattedAppraisals);
        setStats({
          myAppraisals: formattedAppraisals.length,
          pendingActions: formattedAppraisals.filter((a: any) => a.status === 'Pending').length,
          completedGoals: formattedAppraisals.filter((a: any) => a.status === 'Completed').length,
          averageRating: formattedAppraisals.length > 0 
            ? formattedAppraisals.reduce((sum: number, a: any) => sum + (a.overallRating || 0), 0) / formattedAppraisals.length
            : 0
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employee dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [toast, user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "success";
      case "pending": return "warning";
      case "in-progress": return "default";
      default: return "secondary";
    }
  };

  const handleNewAppraisal = () => {
    navigate('/app/appraisals');
  };

  if (loading) {
    return (
      <Layout title="Employee Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading employee dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Employee Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Badge variant="secondary">Employee</Badge>
        </div>

        {/* Employee KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Appraisals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myAppraisals}</div>
              <p className="text-xs text-muted-foreground">Total submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingActions}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedGoals}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* My Appraisals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>My Appraisals</span>
              </div>
              <Button onClick={handleNewAppraisal}>
                Submit New Appraisal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppraisals.map((appraisal) => (
                <div key={appraisal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{appraisal.title}</h3>
                      <Badge variant={getStatusColor(appraisal.status) as any}>
                        {appraisal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(appraisal.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {appraisal.overallRating && (
                      <div className="text-right">
                        <p className="font-bold">{appraisal.overallRating}/5</p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                    )}
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
              {myAppraisals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No appraisals submitted yet</p>
                  <Button className="mt-4" onClick={handleNewAppraisal}>
                    Submit Your First Appraisal
                  </Button>
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
              <Button className="w-full" onClick={handleNewAppraisal}>
                <FileText className="h-4 w-4 mr-2" />
                Submit Appraisal
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                View Goals
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                My Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}