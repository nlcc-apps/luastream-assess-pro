import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { api, type DashboardStats, type StaffAppraisal } from "@/lib/api";
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Clock,
  Plus,
  BarChart3,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppraisals, setRecentAppraisals] = useState<StaffAppraisal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appraisalsData] = await Promise.all([
          api.getDashboardStats(),
          api.getStaffAppraisals()
        ]);
        setStats(statsData);
        setRecentAppraisals(appraisalsData.slice(-3)); // Get last 3 appraisals
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
  return (
    <Layout title="Dashboard" subtitle="Overview of staff performance metrics and organizational KPIs">
      <div className="space-y-6">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Overview of staff performance metrics and organizational KPIs">
      <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Staff Appraisals"
          value={stats?.totalAppraisals.toString() || "0"}
          change="+8% from last quarter"
          changeType="positive"
          icon={FileText}
          description="Completed this quarter"
        />
        <StatCard
          title="Average Rating"
          value={`${stats?.averageOverallRating.toFixed(1) || "0"}/5`}
          change="+0.3 from last quarter"
          changeType="positive"
          icon={Star}
          description="Overall performance rating"
        />
        <StatCard
          title="Review Completion"
          value={`${stats?.onTimeCompletionRate || 0}%`}
          change="+12% improvement"
          changeType="positive"
          icon={Clock}
          description="On-time completion rate"
        />
        <StatCard
          title="Employee Satisfaction"
          value={`${stats?.employeeSatisfaction || 0}%`}
          change="+5% from last survey"
          changeType="positive"
          icon={TrendingUp}
          description="Post-appraisal feedback"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/staff-appraisals">
              <Button className="h-24 flex flex-col space-y-2 w-full" variant="outline">
                <Plus className="h-6 w-6" />
                <span>New Staff Appraisal</span>
              </Button>
            </Link>
            <Link to="/reports">
              <Button className="h-24 flex flex-col space-y-2 w-full" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span>Performance Reports</span>
              </Button>
            </Link>
            <Link to="/data">
              <Button className="h-24 flex flex-col space-y-2 w-full" variant="outline">
                <Users className="h-6 w-6" />
                <span>Employee Records</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Staff Appraisals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppraisals.length > 0 ? recentAppraisals.map((appraisal) => (
                <div key={appraisal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">#{appraisal.id}</p>
                    <p className="text-sm text-muted-foreground">{appraisal.employeeName} - {appraisal.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{appraisal.overallRating}/5</p>
                    <p className="text-sm text-muted-foreground">{appraisal.status}</p>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">No recent appraisals</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: "Engineering", avgRating: "4.3/5", employees: "24 employees" },
                { department: "Marketing", avgRating: "4.1/5", employees: "18 employees" },
                { department: "Sales", avgRating: "4.5/5", employees: "32 employees" },
              ].map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{dept.department}</p>
                    <p className="text-sm text-muted-foreground">{dept.employees}</p>
                  </div>
                  <div className="text-success font-bold">
                    {dept.avgRating}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
}