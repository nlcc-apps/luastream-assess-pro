import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, History, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppraisalHistoryItem {
  id: number;
  reviewPeriod: string;
  overallRating: number;
  status: string;
  submissionDate: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  lastReviewDate: string;
  status: "Pending" | "Completed";
}

// FIX: Added the 'export' keyword here
export function ManagerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [myAppraisalHistory, setMyAppraisalHistory] = useState<AppraisalHistoryItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setMyAppraisalHistory([
        { id: 3, reviewPeriod: "Q2 2024", overallRating: 4.8, status: "Completed", submissionDate: "2024-07-18" },
      ]);
      setTeamMembers([
        { id: 101, name: "Alex Johnson", position: "Frontend Developer", lastReviewDate: "2024-06-20", status: "Completed" },
        { id: 102, name: "Maria Garcia", position: "Backend Developer", lastReviewDate: "2024-07-05", status: "Pending" },
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);
  
  const handleEvaluateTeamMember = (employeeId: number) => {
    toast({
      title: "New Appraisal",
      description: `Starting a new appraisal for employee ID: ${employeeId}.`,
    });
    navigate(`/appraisals?employeeId=${employeeId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>My Appraisals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/appraisals')} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Submit My Appraisal
          </Button>
          {myAppraisalHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{item.reviewPeriod}</p>
                <p className="text-sm text-muted-foreground">Submitted: {new Date(item.submissionDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{item.overallRating.toFixed(1)}/5.0</p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>My Team Evaluations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading team members...</p>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={member.status === 'Completed' ? 'success' : 'warning'}>
                      {member.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEvaluateTeamMember(member.id)}>
                      Evaluate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}