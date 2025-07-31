import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Save, FileText, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface StaffAppraisalData {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  manager: string;
  reviewPeriod: string;
  performanceGoals: string;
  achievements: string;
  areasForImprovement: string;
  skillsAssessment: string;
  communicationRating: string;
  teamworkRating: string;
  productivityRating: string;
  qualityRating: string;
  overallRating: string;
  comments: string;
}

interface StaffAppraisalFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function StaffAppraisalForm({ onClose, onSuccess }: StaffAppraisalFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<StaffAppraisalData>({
    employeeId: "",
    employeeName: "",
    department: "",
    position: "",
    manager: "",
    reviewPeriod: "",
    performanceGoals: "",
    achievements: "",
    areasForImprovement: "",
    skillsAssessment: "",
    communicationRating: "",
    teamworkRating: "",
    productivityRating: "",
    qualityRating: "",
    overallRating: "",
    comments: ""
  });

  const handleInputChange = (field: keyof StaffAppraisalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateOverallRating = () => {
    // Calculate overall rating based on individual ratings
    const ratings = [
      parseFloat(formData.communicationRating) || 0,
      parseFloat(formData.teamworkRating) || 0,
      parseFloat(formData.productivityRating) || 0,
      parseFloat(formData.qualityRating) || 0
    ];
    
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const overallRating = average.toFixed(1);
    
    setFormData(prev => ({ ...prev, overallRating }));
    
    toast({
      title: "Overall Rating Calculated",
      description: `Overall performance rating: ${overallRating}/5.0`,
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    
    try {
      await api.createStaffAppraisal({
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        position: formData.position,
        department: formData.department,
        reviewPeriod: formData.reviewPeriod,
        overallRating: parseFloat(formData.overallRating) || 0,
        goals: formData.performanceGoals,
        achievements: formData.achievements,
        areasForImprovement: formData.areasForImprovement,
        additionalComments: formData.comments,
        reviewDate: new Date().toISOString().split('T')[0],
        reviewerName: formData.manager || "Current User",
        status: "completed"
      });
      
      toast({
        title: "Success",
        description: "Staff appraisal has been saved successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save staff appraisal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateReport = () => {
    // Here you would generate a formal performance report
    toast({
      title: "Performance Report Generated",
      description: "Staff performance report is being prepared.",
    });
  };

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appraisals
          </Button>
        </div>
      )}
      
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Employee Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter employee ID"
                value={formData.employeeId}
                onChange={(e) => handleInputChange("employeeId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeName">Full Name</Label>
              <Input
                id="employeeName"
                placeholder="Enter employee full name"
                value={formData.employeeName}
                onChange={(e) => handleInputChange("employeeName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Enter job title/position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Reporting Manager</Label>
              <Input
                id="manager"
                placeholder="Enter manager name"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewPeriod">Review Period</Label>
            <Select onValueChange={(value) => handleInputChange("reviewPeriod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select review period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2024">Q1 2024</SelectItem>
                <SelectItem value="q2-2024">Q2 2024</SelectItem>
                <SelectItem value="q3-2024">Q3 2024</SelectItem>
                <SelectItem value="q4-2024">Q4 2024</SelectItem>
                <SelectItem value="annual-2024">Annual 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="performanceGoals">Performance Goals & Objectives</Label>
            <Textarea
              id="performanceGoals"
              placeholder="List the key performance goals and objectives for this review period..."
              value={formData.performanceGoals}
              onChange={(e) => handleInputChange("performanceGoals", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea
              id="achievements"
              placeholder="Describe the employee's key achievements and accomplishments..."
              value={formData.achievements}
              onChange={(e) => handleInputChange("achievements", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
            <Textarea
              id="areasForImprovement"
              placeholder="Identify areas where the employee can improve and develop..."
              value={formData.areasForImprovement}
              onChange={(e) => handleInputChange("areasForImprovement", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillsAssessment">Skills Assessment</Label>
            <Textarea
              id="skillsAssessment"
              placeholder="Evaluate technical and soft skills development..."
              value={formData.skillsAssessment}
              onChange={(e) => handleInputChange("skillsAssessment", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Performance Ratings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="communicationRating">Communication (1-5)</Label>
              <Select onValueChange={(value) => handleInputChange("communicationRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamworkRating">Teamwork (1-5)</Label>
              <Select onValueChange={(value) => handleInputChange("teamworkRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productivityRating">Productivity (1-5)</Label>
              <Select onValueChange={(value) => handleInputChange("productivityRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualityRating">Quality of Work (1-5)</Label>
              <Select onValueChange={(value) => handleInputChange("qualityRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="overallRating">Overall Performance Rating</Label>
              <Input
                id="overallRating"
                placeholder="Auto-calculated"
                value={formData.overallRating}
                readOnly
                className="bg-muted"
              />
            </div>
            <Button 
              onClick={calculateOverallRating}
              variant="outline"
              className="mt-7"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Any additional feedback or comments..."
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSave} variant="default" disabled={submitting}>
              <Save className="h-4 w-4 mr-2" />
              {submitting ? "Saving..." : "Save Appraisal"}
            </Button>
            <Button onClick={handleGenerateReport} variant="secondary">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}