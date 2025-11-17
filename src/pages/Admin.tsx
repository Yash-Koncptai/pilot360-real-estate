import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
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
  ChevronLeft,
  ChevronRight,
  Search,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Register Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// CONFIG
const ITEMS_PER_PAGE = 5;

/* ──────────────────────── INTERFACES ──────────────────────── */
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
  taluka?: string;
  district?: string;
  nearest_town?: string;
  nearest_road?: string;
  distance_to_nearest_road?: number;
  nearest_school_colleges?: string;
  zoning_status?: string;
  na_permit?: boolean;
  upcoming_infra?: string;
  ownership_type?: string;
  rera_restration?: string; // Changed to string
  town_planning_permit?: string; // Changed to string
  jantri_rate?: number;
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
  email: string;
  role: "admin" | "broker" | "user";
  referral_code: string;
  referred_by: string | null;
  status: "active" | "inactive";
  mobile?: string;
  verification?: boolean;
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
  user: { name: string; email: string };
  property: {
    id: number;
    title: string;
    price: number;
    type: string;
    size: string;
    primary_purpose: string;
    location: string;
  } | null;
}

interface UserSuggestions {
  [userId: number]: string[];
}

/* ──────────────────────── COMPONENT ──────────────────────── */
const AdminDashboard = () => {
  /* ───── State ───── */
  const [properties, setProperties] = useState<Property[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeletePropertyModal, setShowDeletePropertyModal] = useState<string | null>(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState<number | null>(null);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("properties");
  const [referralCodeToNameMap, setReferralCodeToNameMap] = useState<{ [key: string]: string }>({});

  /* Add New User Modal state */
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"broker" | "user">("user");

  const navigate = useNavigate();

  /* ───── Helpers ───── */
  const resetAddUserForm = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("user");
  };

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const payload = {
        name: newUserName,
        email: newUserEmail,
        role: newUserRole === "broker" ? "Broker" : "Regular User",
      };

      const response = await api.post("/api/admin/users/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const addedUser: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role === "Broker" ? "broker" : "user",
          referral_code: response.data.user.referralCode,
          referred_by: response.data.user.referredBy,
          status: response.data.user.verification ? "active" : "inactive",
          mobile: response.data.user.mobile || "N/A",
          verification: response.data.user.verification,
          createdAt: response.data.user.createdAt,
          updatedAt: response.data.user.updatedAt,
        };
        setUsers((prev) => [...prev, addedUser]);
        setUserSuggestions((prev) => ({ ...prev, [addedUser.id]: [] }));
        setReferralCodeToNameMap((prev) => ({
          ...prev,
          [addedUser.referral_code]: addedUser.name,
        }));
        toast.success("User added & email sent!");
        setAddUserOpen(false);
        resetAddUserForm();
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid input");
      } else {
        handleAuthError(err);
      }
    }
  };

  /* Delete User */
  const deleteUser = async (userId: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    // Prevent self-deletion
    const adminUserId = localStorage.getItem("adminUserId");
    if (adminUserId && Number(adminUserId) === userId) {
      toast.error("You cannot delete your own account.");
      return;
    }

    try {
      const response = await api.delete(`/api/admin/users/delete?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const deletedUser = users.find((u) => u.id === userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setUserSuggestions((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        if (deletedUser?.referral_code) {
          setReferralCodeToNameMap((prev) => {
            const updated = { ...prev };
            delete updated[deletedUser.referral_code];
            return updated;
          });
        }
        toast.success("User deleted successfully.");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "User ID is required.");
      } else if (err.response?.status === 404) {
        toast.error(err.response.data.message || "User not found.");
      } else {
        handleAuthError(err);
      }
    }
  };

  const confirmDeleteUser = async () => {
    if (showDeleteUserModal) {
      await deleteUser(showDeleteUserModal);
      setShowDeleteUserModal(null);
    }
  };

  /* ───── Effects ───── */
  useEffect(() => {
    if (activeTab !== "properties") {
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [activeTab]);

  /* Auth check */
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    const token = localStorage.getItem("adminToken");
    if (!isAuthenticated || !token) {
      localStorage.setItem("loginMessage", "You are logged out. Please log in.");
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  /* Dashboard data */
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const response = await api.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setDashboardData({
            properties: Number(response.data.properties),
            available: Number(response.data.available),
            views: Number(response.data.views),
            inquiries: Number(response.data.inquiries),
          });
        }
      } catch (err: any) {
        handleAuthError(err);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  /* Analytics */
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const response = await api.get("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        }
      } catch (err: any) {
        handleAuthError(err);
      }
    };
    fetchAnalyticsData();
  }, [navigate]);

  /* Users */
  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin", { replace: true });
        return;
      }
      try {
        const response = await api.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const normalizedUsers: User[] = (response.data.users || []).map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            mobile: u.mobile || "N/A",
            role: u.role === "Broker" ? "broker" : u.role === "Regular User" ? "user" : "admin",
            referral_code: u.referralCode,
            referred_by: u.referredBy,
            status: u.verification ? "active" : "inactive",
            verification: u.verification,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          }));
          setUsers(normalizedUsers);

          const referralMap: { [key: string]: string } = {};
          normalizedUsers.forEach((user) => {
            if (user.referral_code) {
              referralMap[user.referral_code] = user.name;
            }
          });
          setReferralCodeToNameMap(referralMap);

          const initialSuggestions: UserSuggestions = {};
          normalizedUsers.forEach((user) => {
            initialSuggestions[user.id] = [];
          });
          setUserSuggestions(initialSuggestions);
        } else {
          toast.error(response.data.message || "Failed to fetch users data.");
          setUsers([]);
          setReferralCodeToNameMap({});
        }
      } catch (err: any) {
        handleAuthError(err);
        setUsers([]);
        setReferralCodeToNameMap({});
      }
    };
    fetchUsersData();
  }, [navigate]);

  /* Properties */
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin", { replace: true });
        return;
      }
      try {
        setIsPropertiesLoading(true);
        const response = await api.get("/api/admin/property", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProperties(Array.isArray(response.data.properties) ? response.data.properties : []);
        } else {
          toast.error(response.data.message || "Failed to fetch properties.");
          setProperties([]);
        }
      } catch (err: any) {
        handleAuthError(err);
        setProperties([]);
      } finally {
        setIsPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, [navigate]);

  /* Inquiries (Scheduled Visits) */
  useEffect(() => {
    const fetchInquiries = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const response = await api.get("/api/admin/inquiries", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
            user: { name: inquiry.user.name, email: inquiry.user.email },
            property: inquiry.property
              ? {
                  id: inquiry.property.id,
                  title: inquiry.property.title,
                  price: inquiry.property.price,
                  type: inquiry.property.type,
                  size: inquiry.property.size,
                  primary_purpose: inquiry.property.primary_purpose,
                  location: inquiry.property.location,
                }
              : null,
          }));
          setScheduledVisits(inquiries);
        } else {
          setScheduledVisits([]);
          toast.error(response.data.message || "Failed to fetch inquiries.");
        }
      } catch (err: any) {
        handleAuthError(err);
        setScheduledVisits([]);
      }
    };
    fetchInquiries();
  }, [navigate]);

  const handleAuthError = (err: any) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
      localStorage.setItem("loginMessage", "Session expired. Please log in again.");
      navigate("/admin", { replace: true });
    } else {
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };

  const suggestPropertyToUser = async (userId: number, propertyId: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      setUserSuggestions((prev) => ({ ...prev, [userId]: [...(prev[userId] || []), propertyId] }));
      const response = await api.post(
        "/api/admin/suggestions",
        { user_id: userId, property_id: Number(propertyId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.success) {
        setUserSuggestions((prev) => ({ ...prev, [userId]: prev[userId].filter(id => id !== propertyId) }));
        toast.error(response.data.message);
      } else {
        toast.success("Property suggested!");
      }
    } catch (err: any) {
      handleAuthError(err);
      setUserSuggestions((prev) => ({ ...prev, [userId]: prev[userId].filter(id => id !== propertyId) }));
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    localStorage.setItem("loginMessage", "Logged out successfully.");
    setShowLogoutModal(false);
    navigate("/admin", { replace: true });
  };

  const deleteProperty = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const response = await api.delete(`/api/admin/property/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProperties(prev => prev.filter(p => p.id !== id));
        toast.success("Property deleted.");
        setCurrentPage(1);
      }
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const confirmDeleteProperty = async () => {
    if (showDeletePropertyModal) {
      await deleteProperty(showDeletePropertyModal);
      setShowDeletePropertyModal(null);
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
    if (!token) throw new Error("No token");

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
      if (formData.investment_gain !== undefined)
        payload.append("investment_gain", formData.investment_gain.toString());
      payload.append("water_connectivity", formData.water_connectivity ? "true" : "false");
      payload.append("electricity_connectivity", formData.electricity_connectivity ? "true" : "false");
      payload.append("gas_connectivity", formData.gas_connectivity ? "true" : "false");
      payload.append("market_risk", formData.market_risk ? "true" : "false");
      payload.append("regulatory_risk", formData.regulatory_risk ? "true" : "false");
      payload.append("financial_risk", formData.financial_risk ? "true" : "false");
      payload.append("liquidity_risk", formData.liquidity_risk ? "true" : "false");
      payload.append("physical_risk", formData.physical_risk ? "true" : "false");
      if (formData.features?.length)
        payload.append("features", formData.features.join(","));
      if (formData.taluka) payload.append("taluka", formData.taluka);
      if (formData.district) payload.append("district", formData.district);
      if (formData.nearest_town) payload.append("nearest_town", formData.nearest_town);
      if (formData.nearest_road) payload.append("nearest_road", formData.nearest_road);
      if (formData.distance_to_nearest_road !== undefined)
        payload.append("distance_to_nearest_road", formData.distance_to_nearest_road.toString());
      if (formData.nearest_school_colleges)
        payload.append("nearest_school_colleges", formData.nearest_school_colleges);
      if (formData.zoning_status) payload.append("zoning_status", formData.zoning_status);
      payload.append("na_permit", formData.na_permit ? "yes" : "no"); // Changed to yes/no
      if (formData.upcoming_infra) payload.append("upcoming_infra", formData.upcoming_infra);
      if (formData.ownership_type) payload.append("ownership_type", formData.ownership_type);
      if (formData.rera_restration) payload.append("rera_restration", formData.rera_restration);
      if (formData.town_planning_permit) payload.append("town_planning_permit", formData.town_planning_permit);
      if (formData.jantri_rate !== undefined)
        payload.append("jantri_rate", formData.jantri_rate.toString());

      if (formData.images) {
        formData.images.forEach((img: any) => img instanceof File && payload.append("images", img));
      }
      if (formData.id && formData.existingImages)
        payload.append("existingimages", formData.existingImages.join(","));
      if (formData.id && formData.deletedImages)
        payload.append("deletedimages", formData.deletedImages.join(","));

      const url = formData.id
        ? `/api/admin/property/update?id=${formData.id}`
        : "/api/admin/property/add";

      const response = await api[formData.id ? "put" : "post"](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        if (formData.id) {
          setProperties(prev => prev.map(p => (p.id === formData.id ? response.data.property : p)));
        } else {
          setProperties(prev => [...prev, response.data.property]);
        }
        toast.success(formData.id ? "Updated!" : "Added!");
        setShowEditModal(false);
        setCurrentPage(1);
      }
    } catch (err: any) {
      handleAuthError(err);
      throw err;
    }
  };

  const formatPriceDisplay = (value: number) => (value / 100000).toFixed(1) + "L";
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  /* ───── Search & Pagination (Properties) ───── */
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      (p.taluka && p.taluka.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.nearest_town && p.nearest_town.toLowerCase().includes(q)) ||
      (p.nearest_road && p.nearest_road.toLowerCase().includes(q)) ||
      (p.nearest_school_colleges && p.nearest_school_colleges.toLowerCase().includes(q)) ||
      (p.zoning_status && p.zoning_status.toLowerCase().includes(q)) ||
      (p.upcoming_infra && p.upcoming_infra.toLowerCase().includes(q)) ||
      (p.ownership_type && p.ownership_type.toLowerCase().includes(q)) ||
      (p.rera_restration && p.rera_restration.toLowerCase().includes(q))
    );
  }, [properties, searchQuery]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  /* ───── Chart Data ───── */
  const chartData = analyticsData
    ? {
        labels: ["This Month", "Last Month"],
        datasets: [
          {
            label: "Monthly Views",
            data: [analyticsData.monthly_trend.this_month, analyticsData.monthly_trend.last_month],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Views" } },
      x: { title: { display: true, text: "Period" } },
    },
    plugins: { legend: { display: false } },
  };

  /* ───── Render ───── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ───── Header ───── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your land investment properties</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddProperty} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> Add Property
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Link to="/admin/requested-properties">
                <MapPin className="w-4 h-4 mr-2" /> Requested Properties
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* ───── Stats ───── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Properties", value: dashboardData?.properties || 0, icon: MapPin, change: "+12%" },
            { title: "Available Properties", value: dashboardData?.available || 0, icon: TrendingUp, change: "+8%" },
            { title: "Total Views", value: dashboardData?.views || 0, icon: Eye, change: "+23%" },
            { title: "Inquiries", value: dashboardData?.inquiries || 0, icon: Users, change: "+5%" },
          ].map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ───── Tabs ───── */}
        <Tabs defaultValue="properties" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="visits">Schedule Visit</TabsTrigger>
          </TabsList>

          {/* ───── PROPERTIES TAB ───── */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Property Management</CardTitle>
                    <CardDescription>View, edit, and manage all land properties</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search title, location, size..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isPropertiesLoading ? (
                  <p className="text-muted-foreground">Loading properties...</p>
                ) : paginatedProperties.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <img
                            src={property.images?.[0] ? `http://localhost:5050/${property.images[0]}` : "https://via.placeholder.com/64"}
                            alt={property.title}
                            className="w-16 h-16 rounded object-cover"
                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")}
                          />
                          <div>
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-sm text-muted-foreground">{property.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{property.type}</Badge>
                              <Badge variant={property.private ? "destructive" : "default"}>
                                {property.private ? "Private" : "Available"}
                              </Badge>
                              <Badge variant="outline">{property.primary_purpose}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">₹{formatPriceDisplay(property.price || 0)}</p>
                            <p className="text-sm text-muted-foreground">{property.size}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewProperty(property)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowDeletePropertyModal(property.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {searchQuery ? "No properties match your search." : "No properties found."}
                  </p>
                )}

                {/* Pagination */}
                {filteredProperties.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── ANALYTICS TAB ───── */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                  <CardDescription>Views and inquiries by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData ? (
                    <div className="space-y-4">
                      {[
                        { type: "Agricultural", views: analyticsData.property_performance.Agricultural },
                        { type: "Residential", views: analyticsData.property_performance.Residential },
                        { type: "Commercial", views: analyticsData.property_performance.Commercial },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.type}</span>
                          <Badge>{item.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Loading analytics data...</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Property inquiries and views</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>This Month</span>
                        <Badge variant="default">{analyticsData.monthly_trend.this_month} views</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Month</span>
                        <Badge variant="secondary">{analyticsData.monthly_trend.last_month} views</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Growth Rate</span>
                        <Badge variant="default" className={analyticsData.monthly_trend.growth_rate.startsWith("+") ? "bg-green-500" : "bg-red-500"}>
                          {analyticsData.monthly_trend.growth_rate}
                        </Badge>
                      </div>
                      <div style={{ height: "300px", width: "100%" }}>
                        <Bar data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Loading monthly trends...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ───── USERS TAB ───── */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management & Property Suggestions</CardTitle>
                  <CardDescription>Manage user accounts and suggest properties</CardDescription>
                </div>
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetAddUserForm}>
                      <Plus className="w-4 h-4 mr-2" /> Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Fill in the details below. A referral code and password will be generated by the server and sent via email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as "broker" | "user")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="broker">Broker</SelectItem>
                            <SelectItem value="user">Regular User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser}>Add User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                {isPropertiesLoading ? (
                  <p className="text-muted-foreground">Loading users and properties...</p>
                ) : users.length > 0 ? (
                  <div className="space-y-6">
                    {users.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-sm text-muted-foreground">Mobile: {user.mobile || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Role: <span className="capitalize">{user.role}</span></p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "default"
                                      : user.role === "broker"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {user.role === "admin" ? "Admin" : user.role === "broker" ? "Broker" : "Regular User"}
                                </Badge>
                                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </Badge>
                                <Badge variant="outline">Referral: {user.referral_code}</Badge>
                                <Badge variant="outline">
                                  Referred By: {user.referred_by ? referralCodeToNameMap[user.referred_by] || user.referred_by : "-"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteUserModal(user.id)}
                              disabled={user.role === "admin" || Number(localStorage.getItem("adminUserId")) === user.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Suggested Properties:</div>
                          {properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {properties.slice(0, 3).map((property) => (
                                <div key={property.id} className="flex flex-col p-2 bg-muted/50 rounded text-sm">
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium">{property.title}</div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => suggestPropertyToUser(user.id, property.id)}
                                      disabled={userSuggestions[user.id]?.includes(property.id)}
                                    >
                                      {userSuggestions[user.id]?.includes(property.id) ? "Suggested" : (
                                        <>
                                          <Send className="w-3 h-3 mr-1" /> Suggest
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    ₹{formatPriceDisplay(property.price)} - {property.location}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="secondary">{property.type}</Badge>
                                    <Badge variant={property.private ? "destructive" : "default"}>
                                      {property.private ? "Private" : "Available"}
                                    </Badge>
                                    <Badge variant="outline">{property.primary_purpose}</Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <span>Investment Gain: </span>
                                    <span>{property.investment_gain ? `₹${formatPriceDisplay(property.investment_gain)}` : "N/A"}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {property.water_connectivity && <Badge variant="outline"><Droplet className="w-3 h-3 mr-1" /> Water</Badge>}
                                    {property.electricity_connectivity && <Badge variant="outline"><Zap className="w-3 h-3 mr-1" /> Electricity</Badge>}
                                    {property.gas_connectivity && <Badge variant="outline"><Flame className="w-3 h-3 mr-1" /> Gas</Badge>}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {property.market_risk && <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Market Risk</Badge>}
                                    {property.regulatory_risk && <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Regulatory Risk</Badge>}
                                    {property.financial_risk && <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Financial Risk</Badge>}
                                    {property.liquidity_risk && <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Liquidity Risk</Badge>}
                                    {property.physical_risk && <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Physical Risk</Badge>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">No properties available to suggest.</p>
                          )}
                          {userSuggestions[user.id]?.length > 0 && (
                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <div className="text-xs font-medium text-green-800">
                                {userSuggestions[user.id].length} properties suggested to this user
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No users found or loading user data...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── VISITS TAB ───── */}
          <TabsContent value="visits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Visits</CardTitle>
                <CardDescription>View scheduled property visits</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledVisits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">User Name</th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Phone Number</th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Property</th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Scheduled Date</th>
                          <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledVisits.map((visit) => (
                          <tr key={visit.id} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{visit.userName}</td>
                            <td className="py-2 px-4">{visit.email}</td>
                            <td className="py-2 px-4">{visit.mobile || "N/A"}</td>
                            <td className="py-2 px-4">{visit.property ? visit.property.title : `Property Not Found (ID: ${visit.propertyId})`}</td>
                            <td className="py-2 px-4">{formatDate(visit.visitDate)}</td>
                            <td className="py-2 px-4">{visit.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No scheduled visits found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ───── MODALS ───── */}
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
        isOpen={!!showDeletePropertyModal}
        onClose={() => setShowDeletePropertyModal(null)}
        onConfirm={confirmDeleteProperty}
        title="Confirm Delete"
        description={`Are you sure you want to delete '${
          properties.find((p) => p.id === showDeletePropertyModal)?.title || "this property"
        }'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ConfirmationModal
        isOpen={!!showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(null)}
        onConfirm={confirmDeleteUser}
        title="Confirm Delete User"
        description={`Are you sure you want to delete '${
          users.find((u) => u.id === showDeleteUserModal)?.name || "this user"
        }'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminDashboard;