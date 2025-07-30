import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, BarChart3 } from "lucide-react";

export function ReportsPage() {
  const reports = [
    {
      id: "RPT-001",
      title: "Residential Property Appraisal",
      property: "123 Main St, Anytown",
      date: "2024-01-15",
      status: "completed",
      value: "$385,000"
    },
    {
      id: "RPT-002", 
      title: "Commercial Building Assessment",
      property: "456 Business Blvd, Downtown",
      date: "2024-01-14",
      status: "pending",
      value: "$1,250,000"
    },
    {
      id: "RPT-003",
      title: "Land Valuation Report",
      property: "789 Rural Rd, Countryside",
      date: "2024-01-12",
      status: "completed",
      value: "$95,000"
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
              <p className="text-2xl font-bold text-success">12</p>
              <p className="text-sm text-muted-foreground">Completed Reports</p>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-sm text-muted-foreground">Pending Reports</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">$3.2M</p>
              <p className="text-sm text-muted-foreground">Total Appraised Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Reports</span>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Report
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
                  <p className="text-sm text-muted-foreground">{report.property}</p>
                  <p className="text-xs text-muted-foreground">Generated: {report.date}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{report.value}</p>
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