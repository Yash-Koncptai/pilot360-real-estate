
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  if (!isAuthenticated || !token) {
    // Set message for login page
    localStorage.setItem("loginMessage", "You are logged out. Please log in.");
    // Redirect to login page with current location in state
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
