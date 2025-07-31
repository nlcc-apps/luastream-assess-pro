import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface PerformanceReportData {
    id: number;
    reportId: string;
    title: string;
    employeeName: string;
    employeePosition: string;
    employeeDepartment: string;
    dateGenerated: string;
    status: string;
    overallRating: number;
    reportContent: string;
}

export function ReportsPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [reports, setReports] = useState<PerformanceReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<PerformanceReportData | null>(null);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5094/api/performance-reports');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: PerformanceReportData[] = await response.json();
            setReports(data);
        } catch (err: any) {
            setError("Failed to load reports. Please try again.");
            toast({
                title: "Error Loading Reports",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "success";
            case "pending": return "warning";
            case "draft": return "secondary";
            default: return "secondary";
        }
    };

    const handleNewPerformanceReport = () => {
        navigate('/appraisals');
    };

    const handleViewReport = (report: PerformanceReportData) => {
        setSelectedReport(report);
    };

    const handleDownloadReport = (reportId: number) => {
        window.open(`http://localhost:5094/api/performance-reports/${reportId}/download`, '_blank');
    };

    if (loading) {
        return <div>Loading reports...</div>;
    }

    if (error) {
        return <div className="text-destructive">{error}</div>;
    }

    const completedReviewsCount = reports.filter(r => r.status.toLowerCase() === 'completed').length;
    const pendingReviewsCount = reports.filter(r => r.status.toLowerCase() === 'pending').length;
    const averageReportRating = reports.length > 0
        ? (reports.reduce((sum, r) => sum + r.overallRating, 0) / reports.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Report Summary</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-success/10 rounded-lg">
                            <p className="text-2xl font-bold text-success">{completedReviewsCount}</p>
                            <p className="text-sm text-muted-foreground">Completed Reviews</p>
                        </div>
                        <div className="text-center p-4 bg-warning/10 rounded-lg">
                            <p className="text-2xl font-bold text-warning">{pendingReviewsCount}</p>
                            <p className="text-sm text-muted-foreground">Pending Reviews</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{averageReportRating}</p>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Performance Reports</span>
                        </div>
                        <Button onClick={handleNewPerformanceReport}>
                            <FileText className="h-4 w-4 mr-2" />
                            New Performance Report
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {reports.length === 0 ? (
                            <p className="text-muted-foreground text-center">No performance reports found.</p>
                        ) : (
                            reports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-shadow">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-medium">{report.title}</h3>
                                            <Badge variant={getStatusColor(report.status) as any}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{report.employeeName} - {report.employeePosition}</p>
                                        <p className="text-xs text-muted-foreground">Generated: {new Date(report.dateGenerated).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-bold">{report.overallRating}/5</p>
                                            <p className="text-sm text-muted-foreground">{report.reportId}</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                {selectedReport && (
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Performance Report</DialogTitle>
                                                        </DialogHeader>
                                                        <div>
                                                            <p><strong>Title:</strong> {selectedReport.title}</p>
                                                            <p><strong>Employee:</strong> {selectedReport.employeeName}</p>
                                                            <p><strong>Position:</strong> {selectedReport.employeePosition}</p>
                                                            <p><strong>Department:</strong> {selectedReport.employeeDepartment}</p>
                                                            <p><strong>Overall Rating:</strong> {selectedReport.overallRating}/5</p>
                                                            <p><strong>Content:</strong></p>
                                                            <p className="whitespace-pre-wrap">{selectedReport.reportContent}</p>
                                                        </div>
                                                    </DialogContent>
                                                )}
                                            </Dialog>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownloadReport(report.id)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}