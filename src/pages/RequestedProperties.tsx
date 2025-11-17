import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import api from "@/utils/api";
import ConfirmationModal from "@/components/ConfirmationModal";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import { useNavigate } from "react-router-dom";

// CONFIG
const ITEMS_PER_PAGE = 5;

/* ──────────────────────── INTERFACES ──────────────────────── */
interface PropertyRequest {
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
  return_of_investment?: number; // Updated to match API
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
  nearest_school_colleges?: string[] | null;
  zoning_status?: string;
  na_permit?: boolean;
  upcoming_infra?: string[] | null;
  ownership_type?: string;
  rera_restration?: string;
  town_planning_permit?: string;
  jantri_rate?: number;
}

/* ──────────────────────── COMPONENT ──────────────────────── */
const RequestedProperties = () => {
  /* ───── State ───── */
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const navigate = useNavigate();

  /* ───── Effects ───── */
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin", { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get("/api/admin/property/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          // Normalize the response to match PropertyRequest interface
          const normalizedRequests: PropertyRequest[] = (response.data.properties || []).map(
            (prop: any) => ({
              id: prop.id.toString(),
              title: prop.title || "",
              price: Number(prop.price) || 0,
              type: prop.type || "",
              size: prop.size || "",
              primary_purpose: prop.primary_purpose || "",
              location: prop.location || "",
              latitude: Number(prop.latitude) || 0,
              longitude: Number(prop.longitude) || 0,
              description: prop.description || "",
              private: Boolean(prop.private),
              investment_gain: prop.investment_gain ? Number(prop.investment_gain) : undefined,
              return_of_investment: prop.return_of_investment ? Number(prop.return_of_investment) : undefined,
              water_connectivity: prop.water_connectivity !== undefined ? Boolean(prop.water_connectivity) : undefined,
              electricity_connectivity: prop.electricity_connectivity !== undefined ? Boolean(prop.electricity_connectivity) : undefined,
              gas_connectivity: prop.gas_connectivity !== undefined ? Boolean(prop.gas_connectivity) : undefined,
              market_risk: prop.market_risk !== undefined ? Boolean(prop.market_risk) : undefined,
              regulatory_risk: prop.regulatory_risk !== undefined ? Boolean(prop.regulatory_risk) : undefined,
              financial_risk: prop.financial_risk !== undefined ? Boolean(prop.financial_risk) : undefined,
              liquidity_risk: prop.liquidity_risk !== undefined ? Boolean(prop.liquidity_risk) : undefined,
              physical_risk: prop.physical_risk !== undefined ? Boolean(prop.physical_risk) : undefined,
              risk_percentage: prop.risk_percentage ? Number(prop.risk_percentage) : undefined,
              features: prop.features || null,
              images: prop.images || null,
              createdAt: prop.createdAt || new Date().toISOString(),
              updatedAt: prop.updatedAt || new Date().toISOString(),
              taluka: prop.taluka || undefined,
              district: prop.district || undefined,
              nearest_town: prop.nearest_town || undefined,
              nearest_road: prop.nearest_road || undefined,
              distance_to_nearest_road: prop.distance_to_nearest_road ? Number(prop.distance_to_nearest_road) : undefined,
              nearest_school_colleges: prop.nearest_school_colleges || null,
              zoning_status: prop.zoning_status || undefined,
              na_permit: prop.na_permit !== undefined ? Boolean(prop.na_permit) : undefined,
              upcoming_infra: prop.upcoming_infra || null,
              ownership_type: prop.ownership_type || undefined,
              rera_restration: prop.rera_restration || undefined,
              town_planning_permit: prop.town_planning_permit || undefined,
              jantri_rate: prop.jantri_rate ? Number(prop.jantri_rate) : undefined,
            })
          );
          setRequests(normalizedRequests);
        } else {
          toast.error(response.data.message || "Failed to fetch pending properties.");
          setRequests([]);
        }
      } catch (err: any) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [navigate]);

  /* ───── Helpers ───── */
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

  const handleAcceptRequest = async (requestId: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await api.put(
        `/api/admin/property/approve?id=${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        toast.success("Property approved successfully.");
      } else {
        toast.error(response.data.message || "Failed to approve property.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Property not found.");
      } else {
        handleAuthError(err);
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await api.delete(`/api/admin/property/reject?id=${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        toast.success("Property rejected successfully.");
      } else {
        toast.error(response.data.message || "Failed to reject property.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Property not found.");
      } else {
        handleAuthError(err);
      }
    }
  };

  const formatPriceDisplay = (value: number) => (value / 100000).toFixed(1) + "L";
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* ───── Search & Pagination ───── */
  const filteredRequests = requests.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.taluka && req.taluka.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.district && req.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.nearest_town && req.nearest_town.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.nearest_road && req.nearest_road.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.nearest_school_colleges &&
        req.nearest_school_colleges.join(", ").toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.zoning_status && req.zoning_status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.upcoming_infra &&
        req.upcoming_infra.join(", ").toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.ownership_type && req.ownership_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.rera_restration && req.rera_restration.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.town_planning_permit &&
        req.town_planning_permit.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  /* ───── Render ───── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ───── Header ───── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Requested Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage property requests submitted by brokers
            </p>
          </div>
        </div>

        {/* ───── Property Requests ───── */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Property Requests</CardTitle>
                <CardDescription>
                  View, approve, or reject pending property requests
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                />
                <Input
                  placeholder="Search title, location, size, type, district..."
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
            {isLoading ? (
              <p className="text-muted-foreground">Loading requests...</p>
            ) : paginatedRequests.length > 0 ? (
              <div className="space-y-4">
                {paginatedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          request.images?.[0]
                            ? `http://localhost:5050/${request.images[0]}`
                            : "https://via.placeholder.com/64"
                        }
                        alt={request.title}
                        className="w-16 h-16 rounded object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "https://via.placeholder.com/64")
                        }
                      />
                      <div>
                        <h3 className="font-semibold">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.location}
                          {request.district ? ` (${request.district})` : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{request.type}</Badge>
                          <Badge variant="outline">{request.primary_purpose}</Badge>
                          {request.rera_restration && (
                            <Badge variant="outline">RERA: {request.rera_restration}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{formatPriceDisplay(request.price || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.size}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setShowAcceptModal(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowRejectModal(request.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No property requests match your search."
                  : "No pending property requests found."}
              </p>
            )}

            {/* Pagination */}
            {filteredRequests.length > ITEMS_PER_PAGE && (
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
      </div>

      {/* ───── Modals ───── */}
      <PropertyDetailModal
        property={selectedRequest}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
      <ConfirmationModal
        isOpen={!!showAcceptModal}
        onClose={() => setShowAcceptModal(null)}
        onConfirm={() => {
          if (showAcceptModal) {
            handleAcceptRequest(showAcceptModal);
            setShowAcceptModal(null);
          }
        }}
        title="Confirm Approve"
        description={`Are you sure you want to approve the property request '${
          requests.find((r) => r.id === showAcceptModal)?.title || "this property"
        }'?`}
        confirmText="Approve"
        cancelText="Cancel"
      />
      <ConfirmationModal
        isOpen={!!showRejectModal}
        onClose={() => setShowRejectModal(null)}
        onConfirm={() => {
          if (showRejectModal) {
            handleRejectRequest(showRejectModal);
            setShowRejectModal(null);
          }
        }}
        title="Confirm Reject"
        description={`Are you sure you want to reject the property request '${
          requests.find((r) => r.id === showRejectModal)?.title || "this property"
        }'?`}
        confirmText="Reject"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RequestedProperties;