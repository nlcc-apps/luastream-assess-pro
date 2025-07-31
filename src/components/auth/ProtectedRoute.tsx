import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth(); // Use the context value

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}