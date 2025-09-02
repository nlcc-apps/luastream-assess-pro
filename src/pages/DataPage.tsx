import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Users, UserPlus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, Employee } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { BulkImportModal } from "@/components/modals/BulkImportModal";
import { useAuth } from "@/contexts/AuthContext";

export function DataPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      console.log("DataPage: Starting employee fetch for user:", user?.email, user?.role);
      try {
        let data: Employee[];
        
        // Role-based data filtering
        if (user?.role === "Admin") {
          console.log("DataPage: Fetching all employees for admin");
          data = await api.getEmployees();
        } else if (user?.role === "Manager") {
          console.log("DataPage: Fetching employees by manager:", user.email);
          data = await api.getEmployeesByManager(user.email);
        } else {
          console.log("DataPage: Fetching employee's own data");
          // Employee can only see their own data
          const allEmployees = await api.getEmployees();
          data = allEmployees.filter(emp => emp.email === user?.email);
        }
        
        console.log("DataPage: Employees loaded:", data.length);
        setEmployees(data);
      } catch (error) {
        console.error("DataPage: Failed to load employees:", error);
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast, user]);

  const handleExportCSV = async () => {
    console.log("DataPage: Starting CSV export");
    try {
      const blob = await api.exportEmployeesCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'employees.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      console.log("DataPage: CSV export completed successfully");
      toast({
        title: "Success",
        description: "Employee data exported successfully",
      });
    } catch (error) {
      console.error("DataPage: CSV export failed:", error);
      toast({
        title: "Error",
        description: "Failed to export employee data",
        variant: "destructive",
      });
    }
  };

  const handleBulkImport = () => {
    console.log("DataPage: Opening bulk import modal");
    setIsBulkImportOpen(true);
  };

  const handleAddEmployee = () => {
    console.log("DataPage: Add employee functionality triggered");
    // Create a new empty employee for the modal
    const newEmployee: Employee = {
      id: 0,
      employeeId: `EMP${Date.now()}`,
      name: '',
      position: '',
      department: '',
      rating: '0',
      lastReview: new Date().toISOString(),
      status: 'active',
      email: '',
      managerId: ''
    };
    setSelectedEmployee(newEmployee);
    setIsModalOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    console.log("DataPage: Opening employee modal for:", employee.employeeId, employee.name);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const refreshEmployees = () => {
    console.log("DataPage: Refreshing employee data");
    setLoading(true);
    const fetchEmployees = async () => {
      try {
        let data: Employee[];
        
        if (user?.role === "Admin") {
          data = await api.getEmployees();
        } else if (user?.role === "Manager") {
          data = await api.getEmployeesByManager(user.email);
        } else {
          const allEmployees = await api.getEmployees();
          data = allEmployees.filter(emp => emp.email === user?.email);
        }
        
        console.log("DataPage: Employee data refreshed, count:", data.length);
        setEmployees(data);
      } catch (error) {
        console.error("DataPage: Failed to refresh employees:", error);
        toast({
          title: "Error",
          description: "Failed to refresh employees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "default";
      case "pending": return "secondary";
      case "inactive": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <Layout title="Employee Database">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading employees...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Employee Database">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Employee Database</span>
              </div>
              <div className="flex space-x-2">
                {user?.role === "Admin" && (
                  <>
                    <Button variant="outline" onClick={handleExportCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={handleBulkImport}>
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import
                    </Button>
                    <Button onClick={handleAddEmployee}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{employee.name}</h3>
                      <Badge variant={getStatusColor(employee.status) as any}>
                        {employee.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                    <p className="text-xs text-muted-foreground">ID: {employee.employeeId} • Rating: {employee.rating} • Last Review: {employee.lastReview}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold">{employee.rating}/5</p>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p>No employees found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <EmployeeModal
        employee={selectedEmployee}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEmployeeUpdated={refreshEmployees}
      />

      <BulkImportModal
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImportComplete={refreshEmployees}
      />
    </Layout>
  );
}