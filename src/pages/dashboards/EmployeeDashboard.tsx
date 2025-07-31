import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, History, User } from "lucide-react";

interface AppraisalHistoryItem {
  id: number;
  reviewPeriod: string;
  overallRating: number;
  status: string;
  submissionDate: string;
}

// FIX: Added the 'export' keyword here
export function EmployeeDashboard() {
  const navigate = useNavigate();
  const [appraisalHistory, setAppraisalHistory] = useState<AppraisalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      const mockHistory: AppraisalHistoryItem[] = [
        { id: 1, reviewPeriod: "Q2 2024", overallRating: 4.5, status: "Completed", submissionDate: "2024-07-15" },
        { id: 2, reviewPeriod: "Q1 2024", overallRating: 4.2, status: "Completed", submissionDate: "2024-04-10" },
      ];
      setAppraisalHistory(mockHistory);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "completed" ? "success" : "secondary";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Welcome, Employee!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Here you can manage your performance appraisals.
          </p>
          <Button onClick={() => navigate('/appraisals')}>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Appraisal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>My Appraisal History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading history...</p>
          ) : appraisalHistory.length > 0 ? (
            <div className="space-y-4">
              {appraisalHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.reviewPeriod}</p>
                    <p className="text-sm text-muted-foreground">Submitted: {new Date(item.submissionDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.overallRating.toFixed(1)}/5.0</p>
                    <Badge variant={getStatusColor(item.status) as any}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No appraisal history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}