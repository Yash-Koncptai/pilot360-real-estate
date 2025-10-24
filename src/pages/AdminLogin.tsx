
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
import { Lock, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/utils/api";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      console.log("Sending request to: /api/admin/login");
      console.log("Request payload:", {
        username: credentials.username,
        password: credentials.password,
      });
      const response = await api.post("/api/admin/login", {
        username: credentials.username,
        password: credentials.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login API response:", response.data);

      if (response.data.success) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminToken", response.data.token);
        setMessage(response.data.message || "Login successful.");
        // Redirect to the intended route or dashboard
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        console.error("Login failed:", response.data.message);
        setError(response.data.message || "Invalid credentials.");
      }
    } catch (err: any) {
      console.error("Login error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
      if (err.response?.status === 404) {
        setError("Login endpoint not found at /api/admin/login. Please verify the backend endpoint.");
      } else if (err.response?.status === 400) {
        setError("Invalid credentials or missing fields.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please check your username and password.");
      } else {
        setError(err.response?.data?.message || "Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;