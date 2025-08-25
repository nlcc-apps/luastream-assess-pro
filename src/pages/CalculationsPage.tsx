import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export function CalculationsPage() {
  const [ratings, setRatings] = useState({
    communication: "",
    teamwork: "",
    productivity: "",
    quality: ""
  });
  const [result, setResult] = useState("");

  const handleRatingChange = (category: string, value: string) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const calculate = () => {
    const ratingValues = Object.values(ratings).map(r => parseFloat(r) || 0);
    const average = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;
    setResult(average.toFixed(1));
  };

  return (
    <Layout title="KPI Calculator" subtitle="Calculate and analyze performance ratings">
      <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Performance Rating Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="communication">Communication (1-5)</Label>
                <Input
                  id="communication"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Rate 1-5"
                  value={ratings.communication}
                  onChange={(e) => handleRatingChange("communication", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamwork">Teamwork (1-5)</Label>
                <Input
                  id="teamwork"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Rate 1-5"
                  value={ratings.teamwork}
                  onChange={(e) => handleRatingChange("teamwork", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productivity">Productivity (1-5)</Label>
                <Input
                  id="productivity"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Rate 1-5"
                  value={ratings.productivity}
                  onChange={(e) => handleRatingChange("productivity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Quality (1-5)</Label>
                <Input
                  id="quality"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Rate 1-5"
                  value={ratings.quality}
                  onChange={(e) => handleRatingChange("quality", e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Overall Rating
            </Button>

            {result && (
              <div className="p-4 bg-primary-soft rounded-lg">
                <p className="text-lg font-bold text-primary">
                  Overall Performance Rating: {result}/5.0
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>HR Analytics Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Advanced calculation tools for comprehensive staff performance analysis:
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Team Performance Comparison
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Goal Achievement Calculator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Trend Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
}