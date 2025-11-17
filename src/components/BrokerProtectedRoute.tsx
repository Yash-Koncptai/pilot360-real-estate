

import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BrokerProtectedRouteProps {
  children: React.ReactNode;
}

const BrokerProtectedRoute = ({ children }: BrokerProtectedRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("userAuth") === "true";
  const token = localStorage.getItem("userToken");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isBroker = userData.role && userData.role.toLowerCase() === "broker";

  useEffect(() => {
    if (!isAuthenticated || !token || !isBroker) {
      toast({
        title: "Access Denied",
        description: "Only brokers can access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isBroker, token, toast]);

  if (!isAuthenticated || !token || !isBroker) {
    localStorage.setItem("loginMessage", "Please log in as a broker to list properties.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default BrokerProtectedRoute;