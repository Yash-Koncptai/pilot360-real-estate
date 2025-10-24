
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Ruler,
  DollarSign,
  Star,
  Calendar,
  Shield,
  Target,
  Droplet,
  Zap,
  Flame,
  TrendingUp,
  Gavel,
  DollarSign as FinancialIcon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Property {
  id?: string;
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
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  features: string[] | null;
  images: string[] | null;
  views: number | null;
  createdAt: string;
  updatedAt: string;
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

  const formatPriceDisplay = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAction = (action: string) => {
    toast.info(`Action "${action}" is not yet implemented.`);
  };

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
          investment gain, connectivity, risks, features, images, views, and
          creation/update dates.
        </p>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid md:grid-cols-2 gap-4">
            {property.images && property.images.length > 0 ? (
              property.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:5050/${image}`}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error("Image load failed:", e.currentTarget.src);
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
                  {property.latitude.toFixed(4)},{" "}
                  {property.longitude.toFixed(4)}
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
                    ? `${property.investment_gain}%`
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

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
                <FinancialIcon className="w-4 h-4 text-primary" />
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
