import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in-down">
          Welcome to AssessPro
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
          Your all-in-one solution for managing staff KPIs, conducting performance appraisals, and driving organizational growth.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/login")} 
          className="animate-bounce"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2024 L.U.A.S KPI Systems. All rights reserved.
      </footer>
    </div>
  );
}