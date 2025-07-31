import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface KpiStats {
    totalAppraisals: number;
    averageOverallRating: number;
    onTimeCompletionRate?: number;
    employeeSatisfaction?: number;
}
interface RecentAppraisal {
    id: number;
    employeeName: string;
    position: string;
    overallRating: number;
    status: string;
}
interface DepartmentPerformance {
    department: string;
    averageRating: number;
    totalAppraisals: number;
}

// FIX: Added the 'export' keyword
export function AdminDashboard() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [kpiStats, setKpiStats] = useState<KpiStats | null>(null);
    const [recentAppraisals, setRecentAppraisals] = useState<RecentAppraisal[]>([]);
    const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const kpiResponse = await fetch('http://localhost:5094/api/dashboard/kpi-stats');
            if (!kpiResponse.ok) throw new Error(`HTTP error! Status: ${kpiResponse.status} for KPI stats`);
            const kpiData: KpiStats = await kpiResponse.json();
            setKpiStats(kpiData);

            const appraisalsResponse = await fetch('http://localhost:5094/api/staff-appraisals');
            if (!appraisalsResponse.ok) throw new Error(`HTTP error! Status: ${appraisalsResponse.status} for recent appraisals`);
            const allAppraisals: RecentAppraisal[] = await appraisalsResponse.json();
            const sortedAppraisals = allAppraisals.sort((a, b) => b.id - a.id).slice(0, 3);
            setRecentAppraisals(sortedAppraisals);

            const deptPerfResponse = await fetch('http://localhost:5094/api/dashboard/team-performance-comparison');
            if (!deptPerfResponse.ok) throw new Error(`HTTP error! Status: ${deptPerfResponse.status} for department performance`);
            const deptPerfData: DepartmentPerformance[] = await deptPerfResponse.json();
            setDepartmentPerformance(deptPerfData);

        } catch (err: any) {
            setError("Failed to load dashboard data. Please check backend connection.");
            toast({
                title: "Error Loading Dashboard",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-destructive">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Staff Appraisals" value={kpiStats?.totalAppraisals?.toString() || "0"} icon={FileText} description="Completed this quarter" />
                <StatCard title="Average Rating" value={kpiStats?.averageOverallRating ? `${kpiStats.averageOverallRating.toFixed(1)}/5` : "N/A"} icon={BarChart3} description="Overall performance rating" />
                <StatCard title="Review Completion" value={kpiStats?.onTimeCompletionRate ? `${kpiStats.onTimeCompletionRate}%` : "N/A"} icon={Clock} description="On-time completion rate" />
                <StatCard title="Employee Satisfaction" value={kpiStats?.employeeSatisfaction ? `${kpiStats.employeeSatisfaction}%` : "N/A"} icon={TrendingUp} description="Post-appraisal feedback" />
            </div>
            <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button className="h-24 flex flex-col space-y-2" variant="outline" onClick={() => navigate('/appraisals')}><Plus className="h-6 w-6" /><span>New Staff Appraisal</span></Button>
                        <Button className="h-24 flex flex-col space-y-2" variant="outline" onClick={() => navigate('/reports')}><BarChart3 className="h-6 w-6" /><span>Performance Reports</span></Button>
                        <Button className="h-24 flex flex-col space-y-2" variant="outline" onClick={() => navigate('/data')}><FileText className="h-6 w-6" /><span>Employee Records</span></Button>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Recent Staff Appraisals</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentAppraisals.map((appraisal) => (
                                <div key={appraisal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div>
                                        <p className="font-medium">{appraisal.employeeName}</p>
                                        <p className="text-sm text-muted-foreground">{appraisal.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{appraisal.overallRating.toFixed(1)}/5</p>
                                        <p className="text-sm text-muted-foreground">{appraisal.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Department Performance</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {departmentPerformance.map((dept) => (
                                <div key={dept.department} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div>
                                        <p className="font-medium">{dept.department}</p>
                                        <p className="text-sm text-muted-foreground">{dept.totalAppraisals} appraisals</p>
                                    </div>
                                    <div className="text-success font-bold">{dept.averageRating.toFixed(1)}/5</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}