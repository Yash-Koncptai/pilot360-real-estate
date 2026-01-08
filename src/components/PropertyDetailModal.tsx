import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Ruler,
  DollarSign,
  Target,
  Shield,
  Droplet,
  Zap,
  Flame,
  TrendingUp,
  Gavel,
  AlertTriangle,
  Calendar,
} from "lucide-react";

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
  rera_restration?: string;
  town_planning_permit?: string;
  jantri_rate?: number;
}

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailModal({
  property,
  isOpen,
  onClose,
}: PropertyDetailModalProps) {
  if (!property || !isOpen) return null;

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const formatPriceDisplay = (value: number) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="property-detail-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {property.title}
          </DialogTitle>
        </DialogHeader>
        <p id="property-detail-description" className="sr-only">
          Detailed information about the property including price, size, primary
          purpose, location, coordinates, description, private status,
          investment gain, connectivity, risks, features, images, and
          creation/update dates.
        </p>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid md:grid-cols-2 gap-4">
            {property.images && property.images.length > 0 ? (
              property.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`https://staging.chokhizameen.com/${image}`}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300";
                  }}
                />
              ))
            ) : (
              <img
                src="https://via.placeholder.com/300"
                alt="No image available"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{formatPriceDisplay(property.price)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(property.price)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Ruler className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{property.size}</div>
                <p className="text-xs text-muted-foreground">{property.type}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Target className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Primary Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.primary_purpose}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{property.location}</div>
                <p className="text-xs text-muted-foreground">
                  {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Shield className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={property.private ? "destructive" : "default"}>
                  {property.private ? "Private" : "Available"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Investment Gain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.investment_gain
                    ? `₹${formatPriceDisplay(property.investment_gain)}`
                    : "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Return on Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.return_of_investment
                    ? `${property.return_of_investment}%`
                    : "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Created At
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {formatDate(property.createdAt)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Taluka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.taluka || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    District
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.district || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Nearest Town
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.nearest_town || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Nearest Road
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.nearest_road || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Distance to Road
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.distance_to_nearest_road
                      ? `${property.distance_to_nearest_road} km`
                      : "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Schools/Colleges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.nearest_school_colleges || "N/A"}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Zoning Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.zoning_status || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    NA Permit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.na_permit ? "Yes" : "No"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Ownership Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.ownership_type || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    RERA Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.rera_restration || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Town Planning Permit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.town_planning_permit || "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Jantri Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.jantri_rate ? `₹${property.jantri_rate}` : "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-medium ml-2">
                    Upcoming Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {property.upcoming_infra || "N/A"}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Connectivity */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Droplet className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Water Connectivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.water_connectivity ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Zap className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Electricity Connectivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.electricity_connectivity ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Flame className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Gas Connectivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.gas_connectivity ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Market Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.market_risk ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Gavel className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Regulatory Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.regulatory_risk ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Financial Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.financial_risk ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Liquidity Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.liquidity_risk ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Physical Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.physical_risk ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium ml-2">
                  Risk Percentage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {property.risk_percentage ? `${property.risk_percentage}%` : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {property.features && property.features.length > 0 ? (
                  property.features.map((feature: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="justify-center"
                    >
                      {feature}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No features available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}