import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, BarChart3, Database, Settings, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-2xl font-bold">L</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">L.U.A.S</h1>
              <p className="text-xl text-primary-foreground/80">Lightweight Universal Appraisal System</p>
            </div>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Professional staff KPI and performance appraisal platform designed for modern organizations.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View key performance metrics, recent activities, and system overview at a glance.
                </p>
                <Link to="/dashboard">
                  <Button>View Dashboard</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Staff Appraisals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create and manage comprehensive staff performance appraisals with detailed evaluation forms.
                </p>
                <Link to="/staff-appraisals">
                  <Button>Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>KPI Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Calculate performance ratings and KPI scores using advanced algorithms and metrics.
                </p>
                <Link to="/calculations">
                  <Button>Calculate Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Generate detailed performance reports and analytics for individuals and teams.
                </p>
                <Link to="/reports">
                  <Button>View Reports</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Employee Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage comprehensive employee records, performance history, and organizational data.
                </p>
                <Link to="/data">
                  <Button>Manage Data</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure system preferences, user settings, and customize your appraisal workflows.
                </p>
                <Link to="/settings">
                  <Button>Configure</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
