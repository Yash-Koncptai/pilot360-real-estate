
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  TrendingUp,
  Users,
  Send,
  Droplet,
  Zap,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import EditPropertyModal from "@/components/EditPropertyModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "@/utils/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Property {
  id: string;
  title: string;
  price: number;
  type: string;
  size: string;
  primary_purpose: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  private: boolean;
  investment_gain?: number;
  return_of_investment?: number;
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  risk_percentage?: number;
  features: string[] | null;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  properties: number;
  available: number;
  views: number;
  inquiries: number;
}

interface AnalyticsData {
  property_performance: {
    Agricultural: number;
    Residential: number;
    Commercial: number;
  };
  monthly_trend: {
    this_month: number;
    last_month: number;
    growth_rate: string;
  };
}

interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  verification: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ScheduledVisit {
  id: string;
  userName: string;
  email: string;
  mobile?: string;
  propertyId: string;
  visitDate: string;
  message: string;
  user_id: number;
  user: {
    name: string;
    email: string;
  };
  property: {
    id: number;
    title: string;
    price: number;
    type: string;
    size: string;
    primary_purpose: string;
    location: string;
  };
}

interface UserSuggestions {
  [userId: number]: string[];
}

const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestions>({});
  const navigate = useNavigate();

  // Chart.js data configuration for monthly trend
  const chartData = analyticsData
    ? {
        labels: ["This Month", "Last Month"],
        datasets: [
          {
            label: "Monthly Views",
            data: [
              analyticsData.monthly_trend.this_month,
              analyticsData.monthly_trend.last_month,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(54, 162, 235, 0.6)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Views",
        },
      },
      x: {
        title: {
          display: true,
          text: "Period",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    const token = localStorage.getItem("adminToken");
    if (!isAuthenticated || !token) {
      localStorage.setItem("loginMessage", "You are logged out. Please log in.");
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const response = await api.get("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dashboard API response:", response.data);
        if (response.data.success) {
          setDashboardData({
            properties: Number(response.data.properties),
            available: Number(response.data.available),
            views: Number(response.data.views),
            inquiries: Number(response.data.inquiries),
          });
        } else {
          console.error("Failed to fetch dashboard data:", response.data.message);
          toast.error(response.data.message || "Failed to fetch dashboard data.");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 403) {
          localStorage.setItem("loginMessage", "Invalid or expired token.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch dashboard data.");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const response = await api.get("/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Analytics API response:", response.data);
        if (response.data.success) {
          setAnalyticsData({
            property_performance: {
              Agricultural: response.data.property_performance.Agricultural,
              Residential: response.data.property_performance.Residential,
              Commercial: response.data.property_performance.Commercial,
            },
            monthly_trend: {
              this_month: response.data.monthly_trend["This Month"],
              last_month: response.data.monthly_trend["Last Month"],
              growth_rate: response.data.monthly_trend["Growth Rate"],
            },
          });
        } else {
          console.error("Failed to fetch analytics data:", response.data.message);
          toast.error(response.data.message || "Failed to fetch analytics data.");
        }
      } catch (err: any) {
        console.error("Error fetching analytics data:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 403) {
          localStorage.setItem("loginMessage", "Invalid or expired token.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch analytics data.");
        }
      }
    };

    fetchAnalyticsData();
  }, [navigate]);

  // Fetch users and properties data
  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found, redirecting to login.");
        localStorage.setItem("loginMessage", "You are logged out. Please log in.");
        navigate("/admin", { replace: true });
        return;
      }
      try {
        setIsPropertiesLoading(true);
        const response = await api.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Users API response:", response.data);
        if (response.data.success) {
          setUsers(response.data.users || []);
          const fetchedProperties = response.data.properties || [];
          if (!Array.isArray(fetchedProperties)) {
            console.warn("Properties data is not an array:", fetchedProperties);
            toast.error("Invalid properties data received from server.");
            setProperties([]);
          } else {
            setProperties(fetchedProperties);
          }
          const initialSuggestions: UserSuggestions = {};
          response.data.users.forEach((user: User) => {
            initialSuggestions[user.id] = [];
          });
          setUserSuggestions(initialSuggestions);
        } else {
          console.error("Failed to fetch users data:", response.data.message);
          toast.error(response.data.message || "Failed to fetch users data.");
          setProperties([]);
          setUsers([]);
        }
      } catch (err: any) {
        console.error("Error fetching users data:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 403) {
          localStorage.setItem("loginMessage", "Invalid or expired token.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else if (err.response?.status === 404) {
          toast.error("Users not found.");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch users data.");
        }
        setProperties([]);
        setUsers([]);
      } finally {
        setIsPropertiesLoading(false);
      }
    };

    fetchUsersData();
  }, [navigate]);

  // Fetch inquiries data
  useEffect(() => {
    const fetchInquiries = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found, redirecting to login.");
        localStorage.setItem("loginMessage", "You are logged out. Please log in.");
        navigate("/admin", { replace: true });
        return;
      }
      try {
        const response = await api.get("/api/admin/inquiries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Inquiries API response:", response.data);
        if (response.data.success) {
          const inquiries = response.data.inquiries.map((inquiry: any) => ({
            id: inquiry.id.toString(),
            userName: inquiry.user.name,
            email: inquiry.email,
            mobile: inquiry.mobile || "N/A",
            propertyId: inquiry.property_id.toString(),
            visitDate: inquiry.visit_date,
            message: inquiry.message,
            user_id: inquiry.user_id,
            user: {
              name: inquiry.user.name,
              email: inquiry.user.email,
            },
            property: {
              id: inquiry.property.id,
              title: inquiry.property.title,
              price: inquiry.property.price,
              type: inquiry.property.type,
              size: inquiry.property.size,
              primary_purpose: inquiry.property.primary_purpose,
              location: inquiry.property.location,
            },
          }));
          setScheduledVisits(inquiries);
        } else {
          console.error("Failed to fetch inquiries:", response.data.message);
          toast.error(response.data.message || "Failed to fetch inquiries.");
          setScheduledVisits([]);
        }
      } catch (err: any) {
        console.error("Error fetching inquiries:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 403) {
          localStorage.setItem("loginMessage", "Invalid or expired token.");
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        } else if (err.response?.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch inquiries.");
        }
        setScheduledVisits([]);
      }
    };
    fetchInquiries();
  }, [navigate]);

  // Suggest property to user
  const suggestPropertyToUser = async (userId: number, propertyId: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      localStorage.setItem("loginMessage", "You are logged out. Please log in.");
      navigate("/admin", { replace: true });
      return;
    }
    try {
      setUserSuggestions((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), propertyId],
      }));
      const response = await api.post(
        "/api/admin/suggestions",
        { user_id: userId, property_id: Number(propertyId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Suggest property response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Property suggested successfully.");
      } else {
        console.error("Failed to suggest property:", response.data.message);
        toast.error(response.data.message || "Failed to suggest property.");
        setUserSuggestions((prev) => ({
          ...prev,
          [userId]: prev[userId].filter((id) => id !== propertyId),
        }));
      }
    } catch (err: any) {
      console.error("Error suggesting property:", err.response?.data || err.message);
      let errorMessage = "Failed to suggest property.";
      if (err.response?.status === 400) {
        errorMessage = "Missing required fields for suggestion.";
      } else if (err.response?.status === 404) {
        errorMessage = err.response?.data?.message.includes("user")
          ? "User not found."
          : "Property not found.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authorization token missing or malformed.";
        localStorage.setItem("loginMessage", errorMessage);
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      } else if (err.response?.status === 403) {
        errorMessage = "Invalid or expired token.";
        localStorage.setItem("loginMessage", errorMessage);
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      }
      toast.error(err.response?.data?.message || errorMessage);
      setUserSuggestions((prev) => ({
        ...prev,
        [userId]: prev[userId].filter((id) => id !== propertyId),
      }));
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    localStorage.setItem("loginMessage", "You have successfully logged out.");
    setShowLogoutModal(false);
    navigate("/admin", { replace: true });
  };

  const deleteProperty = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      localStorage.setItem("loginMessage", "You are logged out. Please log in.");
      navigate("/admin", { replace: true });
      return;
    }

    try {
      const response = await api.delete(`/api/admin/property/delete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete property response:", response.data);
      if (response.data.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                properties: prev.properties - 1,
                available: prev.available - (properties.find((p) => p.id === id)?.private ? 0 : 1),
              }
            : prev
        );
        const analyticsResponse = await api.get("/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (analyticsResponse.data.success) {
          setAnalyticsData({
            property_performance: {
              Agricultural: analyticsResponse.data.property_performance.Agricultural,
              Residential: analyticsResponse.data.property_performance.Residential,
              Commercial: analyticsResponse.data.property_performance.Commercial,
            },
            monthly_trend: {
              this_month: analyticsResponse.data.monthly_trend["This Month"],
              last_month: analyticsResponse.data.monthly_trend["Last Month"],
              growth_rate: analyticsResponse.data.monthly_trend["Growth Rate"],
            },
          });
        }
        toast.success(response.data.message || "Property deleted successfully.");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      } else if (err.response?.status === 403) {
        localStorage.setItem("loginMessage", "Invalid or expired token.");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      } else if (err.response?.status === 404) {
        toast.error("Property not found.");
      } else {
        toast.error(err.response?.data?.message || "Failed to delete property.");
      }
    }
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      await deleteProperty(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowEditModal(true);
  };

  const handlePropertySave = async (
    formData: Property & {
      images: File[] | string[] | null;
      existingImages?: string[] | null;
      deletedImages?: string[] | null;
    }
  ) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      localStorage.setItem("loginMessage", "You are logged out. Please log in.");
      navigate("/admin", { replace: true });
      throw new Error("No authentication token found");
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("price", formData.price.toString());
      payload.append("type", formData.type);
      payload.append("size", formData.size);
      payload.append("primary_purpose", formData.primary_purpose);
      payload.append("location", formData.location);
      payload.append("latitude", formData.latitude.toString());
      payload.append("longitude", formData.longitude.toString());
      payload.append("description", formData.description);
      payload.append("privacy", formData.private.toString());
      if (formData.investment_gain !== undefined) {
        payload.append("investment_gain", formData.investment_gain.toString());
      }
      if (formData.return_of_investment !== undefined) {
        payload.append("return_of_investment", formData.return_of_investment.toString());
      }
      payload.append("water_connectivity", formData.water_connectivity ? "true" : "false");
      payload.append("electricity_connectivity", formData.electricity_connectivity ? "true" : "false");
      payload.append("gas_connectivity", formData.gas_connectivity ? "true" : "false");
      payload.append("market_risk", formData.market_risk ? "true" : "false");
      payload.append("regulatory_risk", formData.regulatory_risk ? "true" : "false");
      payload.append("financial_risk", formData.financial_risk ? "true" : "false");
      payload.append("liquidity_risk", formData.liquidity_risk ? "true" : "false");
      payload.append("physical_risk", formData.physical_risk ? "true" : "false");
      if (formData.features && formData.features.length) {
        payload.append("features", formData.features.join(","));
      }

      if (formData.images && Array.isArray(formData.images)) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            payload.append("images", image);
          }
        });
      }

      if (formData.id && formData.existingImages) {
        payload.append("existingimages", formData.existingImages.join(","));
      }
      if (formData.id && formData.deletedImages) {
        payload.append("deletedimages", formData.deletedImages.join(","));
      }

      if (formData.id) {
        const response = await api.put(`/api/admin/property/update?id=${formData.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Update property response:", response.data);
        if (response.data.success) {
          setProperties((prev) =>
            prev.map((p) => (p.id === formData.id ? response.data.property : p))
          );
          const dashboardResponse = await api.get("/api/admin/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (dashboardResponse.data.success) {
            setDashboardData({
              properties: Number(dashboardResponse.data.properties),
              available: Number(dashboardResponse.data.available),
              views: Number(dashboardResponse.data.views),
              inquiries: Number(dashboardResponse.data.inquiries),
            });
          }
          const analyticsResponse = await api.get("/api/admin/analytics", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (analyticsResponse.data.success) {
            setAnalyticsData({
              property_performance: {
                Agricultural: analyticsResponse.data.property_performance.Agricultural,
                Residential: analyticsResponse.data.property_performance.Residential,
                Commercial: analyticsResponse.data.property_performance.Commercial,
              },
              monthly_trend: {
                this_month: analyticsResponse.data.monthly_trend["This Month"],
                last_month: analyticsResponse.data.monthly_trend["Last Month"],
                growth_rate: analyticsResponse.data.monthly_trend["Growth Rate"],
              },
            });
          }
          toast.success(response.data.message || "Property updated successfully.");
        }
      } else {
        const response = await api.post("/api/admin/property/add", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Add property response:", response.data);
        if (response.data.success) {
          setProperties((prev) => [...prev, response.data.property]);
          setDashboardData((prev) =>
            prev
              ? {
                  ...prev,
                  properties: prev.properties + 1,
                  available: prev.available + (formData.private ? 0 : 1),
                }
              : prev
          );
          const analyticsResponse = await api.get("/api/admin/analytics", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (analyticsResponse.data.success) {
            setAnalyticsData({
              property_performance: {
                Agricultural: analyticsResponse.data.property_performance.Agricultural,
                Residential: analyticsResponse.data.property_performance.Residential,
                Commercial: analyticsResponse.data.property_performance.Commercial,
              },
              monthly_trend: {
                this_month: analyticsResponse.data.monthly_trend["This Month"],
                last_month: analyticsResponse.data.monthly_trend["Last Month"],
                growth_rate: analyticsResponse.data.monthly_trend["Growth Rate"],
              },
            });
          }
          toast.success(response.data.message || "Property added successfully.");
        }
      }
      setShowEditModal(false);
    } catch (err: any) {
      console.error("Error saving property:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.setItem("loginMessage", "Authorization token missing or malformed.");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      } else if (err.response?.status === 403) {
        localStorage.setItem("loginMessage", "Invalid or expired token.");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      } else if (err.response?.status === 400) {
        toast.error("Missing required fields or invalid file format.");
      } else if (err.response?.status === 404) {
        toast.error("Property not found.");
      } else {
        toast.error(err.response?.data?.message || "Failed to save property.");
      }
      throw err;
    }
  };

  // Format price for display
  const formatPriceDisplay = (value: number) => {
    return (value / 100000).toFixed(1) + "L";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your land investment properties
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddProperty}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Properties",
              value: dashboardData?.properties || 0,
              icon: MapPin,
              change: dashboardData ? "+12%" : "0%",
              changeType: "positive" as const,
            },
            {
              title: "Available Properties",
              value: dashboardData?.available || 0,
              icon: TrendingUp,
              change: dashboardData ? "+8%" : "0%",
              changeType: "positive" as const,
            },
            {
              title: "Total Views",
              value: dashboardData?.views || 0,
              icon: Eye,
              change: dashboardData ? "+23%" : "0%",
              changeType: "positive" as const,
            },
            {
              title: "Inquiries",
              value: dashboardData?.inquiries || 0,
              icon: Users,
              change: dashboardData ? "+5%" : "0%",
              changeType: "positive" as const,
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="visits">Schedule Visit</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  View, edit, and manage all land properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPropertiesLoading ? (
                  <p className="text-muted-foreground">Loading properties...</p>
                ) : properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              property.images && property.images.length > 0
                                ? `http://localhost:5050/${property.images[0]}`
                                : "https://via.placeholder.com/64"
                            }
                            alt={property.title}
                            className="w-16 h-16 rounded object-cover"
                            onError={(e) => {
                              console.error(
                                "Image load failed:",
                                e.currentTarget.src
                              );
                              e.currentTarget.src =
                                "https://via.placeholder.com/64";
                            }}
                          />
                          <div>
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {property.location}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{property.type}</Badge>
                              <Badge
                                variant={
                                  property.private ? "destructive" : "default"
                                }
                              >
                                {property.private ? "Private" : "Available"}
                              </Badge>
                              <Badge variant="outline">
                                {property.primary_purpose}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">
                              ₹{formatPriceDisplay(property.price || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {property.size}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProperty(property)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteModal(property.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No properties found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                  <CardDescription>
                    Views and inquiries by property type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData ? (
                    <div className="space-y-4">
                      {[
                        {
                          type: "Agricultural",
                          views:
                            analyticsData.property_performance.Agricultural,
                        },
                        {
                          type: "Residential",
                          views: analyticsData.property_performance.Residential,
                        },
                        {
                          type: "Commercial",
                          views: analyticsData.property_performance.Commercial,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span>{item.type}</span>
                          <Badge>{item.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Loading analytics data...
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Property inquiries and views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>This Month</span>
                        <Badge variant="default">
                          {analyticsData.monthly_trend.this_month} views
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Month</span>
                        <Badge variant="secondary">
                          {analyticsData.monthly_trend.last_month} views
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Growth Rate</span>
                        <Badge
                          variant="default"
                          className={
                            analyticsData.monthly_trend.growth_rate.startsWith(
                              "+"
                            )
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        >
                          {analyticsData.monthly_trend.growth_rate}
                        </Badge>
                      </div>
                      <div style={{ height: "300px", width: "100%" }}>
                        <Bar data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Loading monthly trends...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management & Property Suggestions</CardTitle>
                <CardDescription>
                  Manage user accounts and suggest properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPropertiesLoading ? (
                  <p className="text-muted-foreground">
                    Loading users and properties...
                  </p>
                ) : users.length > 0 ? (
                  <div className="space-y-6">
                    {users.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Mobile: {user.mobile}
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {user.verification
                                ? "Verified User"
                                : "Regular User"}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm font-medium">
                            Suggested Properties:
                          </div>
                          {properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {properties.slice(0, 3).map((property) => (
                                <div
                                  key={property.id}
                                  className="flex flex-col p-2 bg-muted/50 rounded text-sm"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium">
                                      {property.title}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        suggestPropertyToUser(
                                          user.id,
                                          property.id
                                        )
                                      }
                                      disabled={userSuggestions[
                                        user.id
                                      ]?.includes(property.id)}
                                    >
                                      {userSuggestions[user.id]?.includes(
                                        property.id
                                      ) ? (
                                        "Suggested"
                                      ) : (
                                        <>
                                          <Send className="w-3 h-3 mr-1" />
                                          Suggest
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    ₹{formatPriceDisplay(property.price)} -{" "}
                                    {property.location}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="secondary">
                                      {property.type}
                                    </Badge>
                                    <Badge
                                      variant={
                                        property.private
                                          ? "destructive"
                                          : "default"
                                      }
                                    >
                                      {property.private
                                        ? "Private"
                                        : "Available"}
                                    </Badge>
                                    <Badge variant="outline">
                                      {property.primary_purpose}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <span>Investment Gain: </span>
                                    <span>
                                      {property.investment_gain
                                        ? `${property.investment_gain}%`
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <span>Return on Investment: </span>
                                    <span>
                                      {property.return_of_investment
                                        ? `${property.return_of_investment}%`
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {property.water_connectivity && (
                                      <Badge variant="outline">
                                        <Droplet className="w-3 h-3 mr-1" />
                                        Water
                                      </Badge>
                                    )}
                                    {property.electricity_connectivity && (
                                      <Badge variant="outline">
                                        <Zap className="w-3 h-3 mr-1" />
                                        Electricity
                                      </Badge>
                                    )}
                                    {property.gas_connectivity && (
                                      <Badge variant="outline">
                                        <Flame className="w-3 h-3 mr-1" />
                                        Gas
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {property.market_risk && (
                                      <Badge variant="outline">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Market Risk
                                      </Badge>
                                    )}
                                    {property.regulatory_risk && (
                                      <Badge variant="outline">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Regulatory Risk
                                      </Badge>
                                    )}
                                    {property.financial_risk && (
                                      <Badge variant="outline">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Financial Risk
                                      </Badge>
                                    )}
                                    {property.liquidity_risk && (
                                      <Badge variant="outline">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Liquidity Risk
                                      </Badge>
                                    )}
                                    {property.physical_risk && (
                                      <Badge variant="outline">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Physical Risk
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No properties available to suggest.
                            </p>
                          )}
                          {userSuggestions[user.id]?.length > 0 && (
                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <div className="text-xs font-medium text-green-800">
                                {userSuggestions[user.id].length} properties
                                suggested to this user
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No users found or loading user data...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Visits</CardTitle>
                <CardDescription>
                  View scheduled property visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledVisits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            User Name
                          </th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            Email
                          </th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            Phone Number
                          </th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            Property
                          </th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            Scheduled Date
                          </th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledVisits.map((visit) => (
                          <tr
                            key={visit.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-2 px-4">{visit.userName}</td>
                            <td className="py-2 px-4">{visit.email}</td>
                            <td className="py-2 px-4">
                              {visit.mobile || "N/A"}
                            </td>
                            <td className="py-2 px-4">
                              {visit.property.title}
                            </td>
                            <td className="py-2 px-4">
                              {formatDate(visit.visitDate)}
                            </td>
                            <td className="py-2 px-4">{visit.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No scheduled visits found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
      <EditPropertyModal
        property={selectedProperty}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handlePropertySave}
      />
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
      <ConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete '${
          properties.find((p) => p.id === showDeleteModal)?.title ||
          "this property"
        }'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminDashboard;