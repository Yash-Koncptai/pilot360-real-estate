// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isAuthenticated = localStorage.getItem("adminAuth") === "true";

//     if (!isAuthenticated) {
//       navigate("/admin");
//     }
//   }, [navigate]);

//   const isAuthenticated = localStorage.getItem("adminAuth") === "true";

//   if (!isAuthenticated) {
//     return null; // or a loading spinner
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem("adminAuth") === "true";
//   const token = localStorage.getItem("adminToken");

//   // Synchronous check to prevent rendering unauthorized content
//   if (!isAuthenticated || !token) {
//     navigate("/admin", { replace: true });
//     return null; // Return null while redirecting
//   }

//   // Remove token validation for now (no /api/validate-token endpoint)
//   useEffect(() => {
//     // Optional: Re-enable this when backend supports token validation
//     // const validateToken = async () => {
//     //   try {
//     //     await axios.get("/api/validate-token", {
//     //       headers: { Authorization: `Bearer ${token}` },
//     //     });
//     //   } catch (err) {
//     //     localStorage.removeItem("adminAuth");
//     //     localStorage.removeItem("adminToken");
//     //     navigate("/admin", { replace: true });
//     //   }
//     // };
//     //
//     // if (token && isAuthenticated) {
//     //   validateToken();
//     // }
//   }, [navigate, token, isAuthenticated]); // Dependencies

//   return <>{children}</>;
// };

// export default ProtectedRoute;
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
