import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Home } from "lucide-react";

export function CalculationsPage() {
  const [sqft, setSqft] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const total = (parseFloat(sqft) || 0) * (parseFloat(pricePerSqft) || 0);
    setResult(total.toLocaleString());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Basic Property Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                type="number"
                placeholder="Enter square footage"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerSqft">Price per Square Foot</Label>
              <Input
                id="pricePerSqft"
                type="number"
                placeholder="Enter price per sqft"
                value={pricePerSqft}
                onChange={(e) => setPricePerSqft(e.target.value)}
              />
            </div>

            <Button onClick={calculate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Value
            </Button>

            {result && (
              <div className="p-4 bg-primary-soft rounded-lg">
                <p className="text-lg font-bold text-primary">
                  Estimated Value: ${result}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Market Analysis Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Advanced calculation tools for comprehensive property analysis:
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Comparative Market Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Depreciation Calculator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Investment Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}