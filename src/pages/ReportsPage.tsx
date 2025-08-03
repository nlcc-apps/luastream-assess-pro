import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, PerformanceReport } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { PerformanceReportModal } from "@/components/modals/PerformanceReportModal";
import { useAuth } from "@/contexts/AuthContext";

export function ReportsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PerformanceReport | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getPerformanceReports();
      setReports(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load performance reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (formData: any) => {
    try {
      const newReport: Omit<PerformanceReport, 'id'> = {
        reportId: `RPT-${Date.now()}`,
        employeeName: formData.employeeName,
        reportContent: formData.reportContent,
        status: "Draft",
        createdDate: new Date().toISOString(),
      };

      await api.createPerformanceReport(newReport);
      toast({
        title: "Success",
        description: "Performance report created successfully",
      });
      
      setIsCreateModalOpen(false);
      fetchReports(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create performance report",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = (report: PerformanceReport) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "draft": return "outline";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <Layout title="Performance Reports">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading performance reports...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Performance Reports">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Performance Reports</span>
              </div>
              {user?.role !== "Employee" && (
                <Button 
                  className="w-full"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Report
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{report.reportId}</h3>
                      <Badge variant={getStatusColor(report.status) as any}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.employeeName}</p>
                    <p className="text-xs text-muted-foreground">Created: {new Date(report.createdDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold">{report.status}</p>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No performance reports found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Report Modal */}
      <CreateReportModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onReportCreated={handleCreateReport}
      />

      {/* View Report Modal */}
      <PerformanceReportModal
        report={selectedReport}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />
    </Layout>
  );
}

// Simple Create Report Modal Component
function CreateReportModal({ open, onOpenChange, onReportCreated }: any) {
  const [formData, setFormData] = useState({
    employeeName: '',
    reportContent: ''
  });

  const handleSubmit = () => {
    if (!formData.employeeName || !formData.reportContent) {
      return;
    }
    onReportCreated(formData);
    setFormData({ employeeName: '', reportContent: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Performance Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              placeholder="Enter employee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Report Content</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={formData.reportContent}
              onChange={(e) => setFormData({ ...formData, reportContent: e.target.value })}
              placeholder="Enter report content"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}