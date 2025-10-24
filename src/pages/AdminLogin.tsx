// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";
// import { Lock, Shield } from "lucide-react";

// const AdminLogin = () => {
//   const [credentials, setCredentials] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Mock authentication - in real app this would be backend validation
//     if (credentials.username === "admin" && credentials.password === "admin123") {
//       localStorage.setItem("adminAuth", "true");
//       navigate("/admin/dashboard");
//     } else {
//       setError("Invalid credentials. Use admin/admin123");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center space-y-4">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
//             <CardDescription>
//               Access the administrative dashboard
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Enter username"
//                 value={credentials.username}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter password"
//                 value={credentials.password}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                 required
//               />
//             </div>

//             {error && (
//               <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
//                 {error}
//               </div>
//             )}

//             <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
//               <strong>Demo Credentials:</strong><br />
//               Username: admin<br />
//               Password: admin123
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
//             >
//               <Lock className="w-4 h-4 mr-2" />
//               Sign In
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminLogin;

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";
// import { Lock, Shield } from "lucide-react";
// import axios from "axios";

// const AdminLogin = () => {
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       console.log(
//         "Sending request to:",
//         "http://localhost:5000/api/admin/login"
//       );
//       console.log("Request payload:", {
//         username: credentials.username,
//         password: credentials.password,
//       });
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/login",
//         {
//           username: credentials.username,
//           password: credentials.password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         localStorage.setItem("adminAuth", "true");
//         localStorage.setItem("adminToken", response.data.token);
//         navigate("/admin/dashboard");
//       }
//     } catch (err) {
//       console.error("Login error details:", {
//         message: err.message,
//         response: err.response ? err.response.data : "No response data",
//         status: err.response ? err.response.status : "No status",
//       });
//       localStorage.removeItem("adminAuth");
//       localStorage.removeItem("adminToken");
//       setError("Invalid credentials. Use admin00/admin00");
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center space-y-4">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
//             <CardDescription>
//               Access the administrative dashboard
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Enter username"
//                 value={credentials.username}
//                 onChange={(e) =>
//                   setCredentials((prev) => ({
//                     ...prev,
//                     username: e.target.value,
//                   }))
//                 }
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter password"
//                 value={credentials.password}
//                 onChange={(e) =>
//                   setCredentials((prev) => ({
//                     ...prev,
//                     password: e.target.value,
//                   }))
//                 }
//                 required
//               />
//             </div>

//             {error && (
//               <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
//                 {error}
//               </div>
//             )}

//             {/* <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
//               <strong>Demo Credentials:</strong>
//               <br />
//               Username: admin00
//               <br />
//               Password: admin00
//             </div> */}

//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
//             >
//               <Lock className="w-4 h-4 mr-2" />
//               Sign In
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminLogin;
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Shield } from "lucide-react";
import axios from "axios";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for login message in localStorage
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage) {
      setMessage(loginMessage);
      localStorage.removeItem("loginMessage"); // Clear the message after displaying
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      console.log(
        "Sending request to:",
        "http://localhost:5000/api/admin/login"
      );
      console.log("Request payload:", {
        username: credentials.username,
        password: credentials.password,
      });
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminToken", response.data.token);
        // Redirect to the intended route or dashboard
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response ? err.response.data : "No response data",
        status: err.response ? err.response.status : "No status",
      });
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
      setError("Invalid credentials. Use admin00/admin00");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Access the administrative dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
