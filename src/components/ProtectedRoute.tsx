import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  
  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;