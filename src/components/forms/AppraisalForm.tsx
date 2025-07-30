import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppraisalData {
  propertyType: string;
  address: string;
  squareFootage: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  lotSize: string;
  condition: string;
  notes: string;
  marketValue: string;
}

export function AppraisalForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AppraisalData>({
    propertyType: "",
    address: "",
    squareFootage: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    lotSize: "",
    condition: "",
    notes: "",
    marketValue: ""
  });

  const handleInputChange = (field: keyof AppraisalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEstimate = () => {
    // Simple calculation logic - in real app, this would be more sophisticated
    const sqft = parseFloat(formData.squareFootage) || 0;
    const basePrice = sqft * 150; // $150 per sqft base rate
    const conditionMultiplier = formData.condition === "excellent" ? 1.2 : 
                               formData.condition === "good" ? 1.0 : 0.8;
    const estimate = (basePrice * conditionMultiplier).toLocaleString();
    
    setFormData(prev => ({ ...prev, marketValue: `$${estimate}` }));
    
    toast({
      title: "Estimate Calculated",
      description: `Market value estimated at $${estimate}`,
    });
  };

  const handleSave = () => {
    // Here you would make API call to save the appraisal
    toast({
      title: "Appraisal Saved",
      description: "Property appraisal has been saved successfully.",
    });
  };

  const handleGenerateReport = () => {
    // Here you would generate a formal report
    toast({
      title: "Report Generated",
      description: "Appraisal report is being prepared.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Property Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Property Condition</Label>
              <Select onValueChange={(value) => handleInputChange("condition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              placeholder="Enter full property address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                placeholder="0"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange("squareFootage", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                placeholder="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="2000"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size (acres)</Label>
            <Input
              id="lotSize"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.lotSize}
              onChange={(e) => handleInputChange("lotSize", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional property details or observations..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Valuation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="marketValue">Estimated Market Value</Label>
              <Input
                id="marketValue"
                placeholder="$0"
                value={formData.marketValue}
                onChange={(e) => handleInputChange("marketValue", e.target.value)}
              />
            </div>
            <Button 
              onClick={calculateEstimate}
              variant="outline"
              className="mt-7"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSave} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Save Appraisal
            </Button>
            <Button onClick={handleGenerateReport} variant="secondary">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}