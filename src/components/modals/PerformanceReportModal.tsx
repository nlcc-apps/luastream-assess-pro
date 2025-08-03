import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, PerformanceReport } from "@/lib/api";

interface PerformanceReportModalProps {
  report: PerformanceReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceReportModal({ report, open, onOpenChange }: PerformanceReportModalProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!report) return;

    try {
      const blob = await api.downloadReport(report.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${report.reportId}-${report.employeeName.replace(/\s+/g, '_')}-Report.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Performance Report - {report.employeeName}</span>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Report ID:</span> {report.reportId}
            </div>
            <div>
              <span className="font-medium">Status:</span> {report.status}
            </div>
            <div>
              <span className="font-medium">Employee:</span> {report.employeeName}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(report.createdDate).toLocaleDateString()}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Report Content:</h4>
            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
              <div className="whitespace-pre-wrap text-sm">
                {report.reportContent || "No content available"}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}