import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api, Employee, StaffAppraisal } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface EvaluationModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvaluationSubmitted: () => void;
}

export function EvaluationModal({ employee, open, onOpenChange, onEvaluationSubmitted }: EvaluationModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reviewPeriod: '',
    overallRating: 0,
    goals: '',
    achievements: '',
    areasForImprovement: '',
    additionalComments: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employee || !user) return;
    
    setLoading(true);
    try {
      const appraisal: Omit<StaffAppraisal, 'id'> = {
        employeeId: employee.employeeId,
        employeeName: employee.name,
        employeeEmail: employee.email,
        position: employee.position,
        department: employee.department,
        reviewPeriod: formData.reviewPeriod,
        overallRating: formData.overallRating,
        goals: formData.goals,
        achievements: formData.achievements,
        areasForImprovement: formData.areasForImprovement,
        additionalComments: formData.additionalComments,
        reviewDate: new Date().toISOString(),
        reviewerName: user.email,
        reviewerId: user.email,
        status: 'Completed',
        submittedDate: new Date().toISOString(),
      };

      await api.createStaffAppraisal(appraisal);
      
      toast({
        title: "Success",
        description: "Performance evaluation submitted successfully",
      });
      
      onEvaluationSubmitted();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        reviewPeriod: '',
        overallRating: 0,
        goals: '',
        achievements: '',
        areasForImprovement: '',
        additionalComments: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit evaluation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Evaluate Employee - {employee.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewPeriod">Review Period</Label>
              <Input
                id="reviewPeriod"
                placeholder="e.g., Q1 2024"
                value={formData.reviewPeriod}
                onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="overallRating">Overall Rating (1-5)</Label>
              <Select value={formData.overallRating.toString()} onValueChange={(value) => setFormData({ ...formData, overallRating: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
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

          <div>
            <Label htmlFor="goals">Goals & Objectives</Label>
            <Textarea
              id="goals"
              placeholder="Describe the employee's goals and objectives..."
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea
              id="achievements"
              placeholder="Highlight the employee's key achievements..."
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
            <Textarea
              id="areasForImprovement"
              placeholder="Identify areas where the employee can improve..."
              value={formData.areasForImprovement}
              onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="additionalComments">Additional Comments</Label>
            <Textarea
              id="additionalComments"
              placeholder="Any additional feedback or comments..."
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}