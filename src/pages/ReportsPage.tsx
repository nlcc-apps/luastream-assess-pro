import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, BarChart3 } from "lucide-react";

export function ReportsPage() {
  const reports = [
    {
      id: "RPT-001",
      title: "Quarterly Performance Review",
      employee: "John Smith - Software Engineer",
      date: "2024-01-15",
      status: "completed",
      rating: "4.5/5"
    },
    {
      id: "RPT-002", 
      title: "Annual Performance Assessment",
      employee: "Sarah Johnson - Marketing Manager",
      date: "2024-01-14",
      status: "pending",
      rating: "4.2/5"
    },
    {
      id: "RPT-003",
      title: "Probation Review Report",
      employee: "Mike Davis - Sales Representative",
      date: "2024-01-12",
      status: "completed",
      rating: "3.8/5"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "pending": return "warning";
      case "draft": return "secondary";
      default: return "secondary";
    }
  };

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
              <p className="text-2xl font-bold text-success">89</p>
              <p className="text-sm text-muted-foreground">Completed Reviews</p>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <p className="text-2xl font-bold text-warning">12</p>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">4.2</p>
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
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Performance Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{report.title}</h3>
                    <Badge variant={getStatusColor(report.status) as any}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.employee}</p>
                  <p className="text-xs text-muted-foreground">Generated: {report.date}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{report.rating}</p>
                    <p className="text-sm text-muted-foreground">{report.id}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}