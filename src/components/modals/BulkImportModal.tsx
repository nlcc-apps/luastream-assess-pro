import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export function BulkImportModal({ open, onOpenChange, onImportComplete }: BulkImportModalProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("BulkImportModal: File selection started");
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("BulkImportModal: File selected:", selectedFile.name, selectedFile.size);
      setFile(selectedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        console.log("BulkImportModal: File content read, length:", content.length);
        setCsvData(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleBulkImport = async () => {
    console.log("BulkImportModal: Starting bulk import process");
    if (!csvData.trim()) {
      console.log("BulkImportModal: No CSV data provided");
      toast({
        title: "Error",
        description: "Please provide CSV data or select a file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("BulkImportModal: Parsing CSV data");
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      console.log("BulkImportModal: CSV headers:", headers);
      
      const employees = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 6) { // Minimum required fields
          const employee = {
            employeeId: values[0] || `EMP${Date.now()}${i}`,
            name: values[1] || '',
            position: values[2] || '',
            department: values[3] || '',
            rating: values[4] || '0',
            lastReview: values[5] || new Date().toISOString(),
            status: values[6] || 'active',
            email: values[7] || '',
            managerId: values[8] || ''
          };
          employees.push(employee);
          console.log("BulkImportModal: Parsed employee:", employee.employeeId, employee.name);
        }
      }

      console.log("BulkImportModal: Total employees to import:", employees.length);
      
      // Import employees one by one
      let successCount = 0;
      for (const employee of employees) {
        try {
          console.log("BulkImportModal: Creating employee:", employee.employeeId);
          await api.createEmployee(employee);
          successCount++;
        } catch (error) {
          console.error("BulkImportModal: Failed to create employee:", employee.employeeId, error);
        }
      }

      console.log("BulkImportModal: Import completed. Success count:", successCount);
      toast({
        title: "Success",
        description: `Successfully imported ${successCount} employees`,
      });

      onImportComplete();
      onOpenChange(false);
      setFile(null);
      setCsvData("");
    } catch (error) {
      console.error("BulkImportModal: Bulk import failed:", error);
      toast({
        title: "Error",
        description: "Failed to import employees. Please check your CSV format.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    console.log("BulkImportModal: Downloading CSV template");
    const csvTemplate = `employeeId,name,position,department,rating,lastReview,status,email,managerId
EMP001,John Doe,Software Engineer,IT,4.5,2024-01-15,active,john.doe@company.com,MGR001
EMP002,Jane Smith,Marketing Manager,Marketing,4.8,2024-02-10,active,jane.smith@company.com,`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'employee_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your computer",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Bulk Employee Import</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">CSV Format Requirements:</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The CSV file should contain the following columns in order:
            </p>
            <code className="text-xs bg-background p-2 rounded block">
              employeeId, name, position, department, rating, lastReview, status, email, managerId
            </code>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="mt-1"
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="text-center text-muted-foreground">OR</div>

            <div>
              <Label htmlFor="csv-data">Paste CSV Data</Label>
              <Textarea
                id="csv-data"
                placeholder="Paste your CSV data here..."
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={8}
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport} disabled={loading || !csvData.trim()}>
              {loading ? (
                <>
                  <FileText className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Employees
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}