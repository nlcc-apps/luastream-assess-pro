import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Database } from "lucide-react";

export function DataPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const properties = [
    {
      id: "PROP-001",
      address: "123 Main St, Anytown",
      type: "Residential",
      sqft: "2,400",
      value: "$385,000",
      lastAppraised: "2024-01-15",
      status: "active"
    },
    {
      id: "PROP-002",
      address: "456 Business Blvd, Downtown", 
      type: "Commercial",
      sqft: "15,000",
      value: "$1,250,000",
      lastAppraised: "2024-01-14",
      status: "active"
    },
    {
      id: "PROP-003",
      address: "789 Rural Rd, Countryside",
      type: "Land",
      sqft: "43,560",
      value: "$95,000", 
      lastAppraised: "2024-01-12",
      status: "archived"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "pending": return "warning";
      case "archived": return "secondary";
      default: return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Residential": return "primary";
      case "Commercial": return "accent";
      case "Land": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Property Database</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
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
                Add Property
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {properties
              .filter(property => 
                property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.type.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{property.address}</h3>
                      <Badge variant={getTypeColor(property.type) as any}>
                        {property.type}
                      </Badge>
                      <Badge variant={getStatusColor(property.status) as any}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <span>Size: {property.sqft} sqft</span>
                      <span>Value: {property.value}</span>
                      <span>Last Appraised: {property.lastAppraised}</span>
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
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">247</p>
            <p className="text-sm text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Appraisals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">18</p>
            <p className="text-sm text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.4GB</p>
            <p className="text-sm text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}