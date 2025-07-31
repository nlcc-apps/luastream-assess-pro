import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EmployeeData {
    id: number;
    employeeId: string;
    name: string;
    position: string;
    department: string;
    rating: string;
    lastReview: string;
    status: string;
}

export function DataPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5094/api/employees');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: EmployeeData[] = await response.json();
            setEmployees(data);
        } catch (err: any) {
            setError("Failed to load employees. Please try again.");
            toast({
                title: "Error Loading Employees",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active": return "success";
            case "on-leave": return "warning";
            case "terminated": return "destructive";
            default: return "secondary";
        }
    };

    const getDepartmentColor = (department: string) => {
        switch (department.toLowerCase()) {
            case "engineering": return "default";
            case "marketing": return "accent";
            case "sales": return "success";
            case "human resources": return "warning";
            default: return "secondary";
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddEmployee = () => {
        toast({
            title: "Add Employee",
            description: "Functionality to add a new employee will be implemented here.",
        });
    };

    const handleExport = () => {
        window.open('http://localhost:5094/api/employees/export-csv', '_blank');
    };

    const handleViewEmployee = (employee: EmployeeData) => {
        setSelectedEmployee(employee);
    };

    const handleEditEmployee = (employee: EmployeeData) => {
        setSelectedEmployee(employee);
        setIsEditDialogOpen(true);
    };

    const handleUpdateEmployee = async () => {
        if (!selectedEmployee) return;

        try {
            const response = await fetch(`http://localhost:5094/api/employees/${selectedEmployee.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedEmployee),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast({
                title: "Employee Updated",
                description: `${selectedEmployee.name}'s details updated successfully.`,
            });
            setIsEditDialogOpen(false);
            fetchEmployees();
        } catch (err: any) {
            toast({
                title: "Error Updating Employee",
                description: err.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Loading employees...</div>;
    }

    if (error) {
        return <div className="text-destructive">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Employee Database</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button onClick={handleAddEmployee}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Employee
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredEmployees.map((employee) => (
                            <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-shadow">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-medium">{employee.name} - {employee.position}</h3>
                                        <Badge variant={getDepartmentColor(employee.department) as any}>
                                            {employee.department}
                                        </Badge>
                                        <Badge variant={getStatusColor(employee.status) as any}>
                                            {employee.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                        <span>ID: {employee.employeeId}</span>
                                        <span>Rating: {employee.rating}</span>
                                        <span>Last Review: {employee.lastReview}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee)}>
                                                View
                                            </Button>
                                        </DialogTrigger>
                                        {selectedEmployee && (
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Employee Details</DialogTitle>
                                                </DialogHeader>
                                                <div>
                                                    <p><strong>Name:</strong> {selectedEmployee.name}</p>
                                                    <p><strong>Position:</strong> {selectedEmployee.position}</p>
                                                    <p><strong>Department:</strong> {selectedEmployee.department}</p>
                                                    <p><strong>Status:</strong> {selectedEmployee.status}</p>
                                                    <p><strong>Rating:</strong> {selectedEmployee.rating}</p>
                                                    <p><strong>Last Review:</strong> {selectedEmployee.lastReview}</p>
                                                </div>
                                            </DialogContent>
                                        )}
                                    </Dialog>
                                    <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                {selectedEmployee && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Employee</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input id="position" value={selectedEmployee.position} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" value={selectedEmployee.department} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })} />
                            </div>
                            <Button onClick={handleUpdateEmployee}>Save Changes</Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}