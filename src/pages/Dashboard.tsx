import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Plus,
  BarChart3
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Staff Appraisals"
          value="142"
          change="+8% from last quarter"
          changeType="positive"
          icon={FileText}
          description="Completed this quarter"
        />
        <StatCard
          title="Average Rating"
          value="4.2/5"
          change="+0.3 from last quarter"
          changeType="positive"
          icon={DollarSign}
          description="Overall performance rating"
        />
        <StatCard
          title="Review Completion"
          value="89%"
          change="+12% improvement"
          changeType="positive"
          icon={Clock}
          description="On-time completion rate"
        />
        <StatCard
          title="Employee Satisfaction"
          value="92%"
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
            <Button className="h-24 flex flex-col space-y-2" variant="outline">
              <Plus className="h-6 w-6" />
              <span>New Staff Appraisal</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span>Performance Reports</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Employee Records</span>
            </Button>
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
              {[
                { id: "SA-001", employee: "John Smith - Software Engineer", rating: "4.5/5", status: "Completed" },
                { id: "SA-002", employee: "Sarah Johnson - Marketing Manager", rating: "4.2/5", status: "In Progress" },
                { id: "SA-003", employee: "Mike Davis - Sales Representative", rating: "3.8/5", status: "Review" },
              ].map((appraisal) => (
                <div key={appraisal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{appraisal.id}</p>
                    <p className="text-sm text-muted-foreground">{appraisal.employee}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{appraisal.rating}</p>
                    <p className="text-sm text-muted-foreground">{appraisal.status}</p>
                  </div>
                </div>
              ))}
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
  );
}