import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Database } from "lucide-react";

export function DataPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const employees = [
    {
      id: "EMP-001",
      name: "John Smith",
      position: "Software Engineer",
      department: "Engineering",
      rating: "4.5/5",
      lastReview: "2024-01-15",
      status: "active"
    },
    {
      id: "EMP-002",
      name: "Sarah Johnson", 
      position: "Marketing Manager",
      department: "Marketing",
      rating: "4.2/5",
      lastReview: "2024-01-14",
      status: "active"
    },
    {
      id: "EMP-003",
      name: "Mike Davis",
      position: "Sales Representative",
      department: "Sales",
      rating: "3.8/5",
      lastReview: "2024-01-12",
      status: "on-leave"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "on-leave": return "warning";
      case "terminated": return "destructive";
      default: return "secondary";
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering": return "primary";
      case "Marketing": return "accent";
      case "Sales": return "success";
      case "HR": return "warning";
      default: return "secondary";
    }
  };

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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {employees
              .filter(employee => 
                employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.department.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((employee) => (
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
                      <span>ID: {employee.id}</span>
                      <span>Rating: {employee.rating}</span>
                      <span>Last Review: {employee.lastReview}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">+8 this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HR Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1.2GB</p>
            <p className="text-sm text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}