import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Plus, FileText, Clock, CheckCircle } from "lucide-react";
import { StaffAppraisalForm } from "@/components/forms/StaffAppraisalForm";
import { api, type StaffAppraisal } from "@/lib/api";

export function StaffAppraisalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [appraisals, setAppraisals] = useState<StaffAppraisal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const fetchAppraisals = async () => {
    try {
      const data = await api.getStaffAppraisals();
      setAppraisals(data);
    } catch (error) {
      console.error('Failed to fetch appraisals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    setShowForm(false);
    fetchAppraisals(); // Refresh the list
  };

  const mockAppraisals = [
    {
      id: 1,
      employeeId: "EMP-001",
      employeeName: "John Smith",
      position: "Software Engineer",
      department: "Engineering",
      reviewPeriod: "Q1 2024",
      overallRating: 4.5,
      goals: "Complete project deliverables",
      achievements: "Delivered all milestones on time",
      areasForImprovement: "Communication skills",
      additionalComments: "Great performance overall",
      reviewDate: "2024-01-15",
      reviewerName: "Jane Doe",
      status: "completed"
    }
  ];

  if (loading) {
    return (
      <Layout title="Staff Performance Appraisals" subtitle="Create and manage staff performance appraisals">
        <div className="text-center">Loading appraisals...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Staff Performance Appraisals" subtitle="Create and manage staff performance appraisals">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">{appraisals.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Appraisals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">
                {appraisals.filter(a => a.status === 'completed').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning mb-2">
                {appraisals.filter(a => a.status === 'pending').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Staff Appraisals</span>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Appraisal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <StaffAppraisalForm onClose={() => setShowForm(false)} onSuccess={handleSubmitSuccess} />
            ) : (
              <div className="space-y-4">
                {(appraisals.length > 0 ? appraisals : mockAppraisals).map((appraisal) => (
                  <div key={appraisal.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-shadow">
                    <div className="flex-1">
                      <h3 className="font-medium">{appraisal.employeeName} - {appraisal.position}</h3>
                      <p className="text-sm text-muted-foreground">{appraisal.department} • {appraisal.reviewPeriod}</p>
                      <p className="text-xs text-muted-foreground">ID: {appraisal.employeeId}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold">{appraisal.overallRating}/5</p>
                        <p className="text-sm text-muted-foreground">{appraisal.status}</p>
                      </div>
                      
                      <div className="flex items-center">
                        {appraisal.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <Clock className="h-5 w-5 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}