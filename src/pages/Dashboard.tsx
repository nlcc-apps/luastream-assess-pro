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
          title="Total Appraisals"
          value="247"
          change="+12% from last month"
          changeType="positive"
          icon={FileText}
          description="Completed this month"
        />
        <StatCard
          title="Average Value"
          value="$425,000"
          change="+3.2% from last month"
          changeType="positive"
          icon={DollarSign}
          description="Property valuations"
        />
        <StatCard
          title="Processing Time"
          value="2.4 days"
          change="-15% improvement"
          changeType="positive"
          icon={Clock}
          description="Average completion time"
        />
        <StatCard
          title="Success Rate"
          value="96.8%"
          change="+0.8% from last month"
          changeType="positive"
          icon={TrendingUp}
          description="Approved appraisals"
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
              <span>New Appraisal</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Recent Files</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appraisals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "APR-001", address: "123 Main St, Anytown", value: "$385,000", status: "Completed" },
                { id: "APR-002", address: "456 Oak Ave, Springfield", value: "$520,000", status: "In Progress" },
                { id: "APR-003", address: "789 Pine Rd, Downtown", value: "$295,000", status: "Review" },
              ].map((appraisal) => (
                <div key={appraisal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{appraisal.id}</p>
                    <p className="text-sm text-muted-foreground">{appraisal.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{appraisal.value}</p>
                    <p className="text-sm text-muted-foreground">{appraisal.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: "Downtown", trend: "+5.2%", value: "$450K avg" },
                { area: "Suburbs", trend: "+3.8%", value: "$385K avg" },
                { area: "Waterfront", trend: "+8.1%", value: "$675K avg" },
              ].map((trend) => (
                <div key={trend.area} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{trend.area}</p>
                    <p className="text-sm text-muted-foreground">{trend.value}</p>
                  </div>
                  <div className="text-success font-bold">
                    {trend.trend}
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