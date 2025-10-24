
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Lock,
  TrendingUp,
  Users,
  Shield,
  Eye,
  Droplet,
  Zap,
  Flame,
  Gavel,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { LandProperty } from "@/data/landProperties";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LandPropertyCardProps {
  property: LandProperty;
  showFullDetails?: boolean;
}

export default function LandPropertyCard({
  property,
  showFullDetails = false,
}: LandPropertyCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(price / 100000).toFixed(0)}L`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Agricultural":
        return "bg-green-100 text-green-800";
      case "Industrial":
        return "bg-blue-100 text-blue-800";
      case "Commercial":
        return "bg-purple-100 text-purple-800";
      case "Farmhouse":
        return "bg-orange-100 text-orange-800";
      case "Non-Agricultural":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const imageUrl =
    property.images?.length > 0
      ? property.images[0].startsWith("http://localhost:5050/")
        ? property.images[0]
        : `http://localhost:5050/${property.images[0]}`
      : "/placeholder.png";

  useEffect(() => {
    console.log(`Image URL for ${property.title}: ${imageUrl}`);
  }, [imageUrl, property.title]);

  const handleViewDetails = () => {
    if (!property.isLocked || showFullDetails) {
      navigate(`/property/${property.id}`);
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${
        property.isLocked && !showFullDetails ? "relative overflow-hidden" : ""
      }`}
    >
      {property.isLocked && !showFullDetails && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-lg text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold">Details Locked</p>
            <p className="text-sm text-muted-foreground">
              Complete onboarding to unlock
            </p>
          </div>
        </div>
      )}

      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={property.title}
          className={`w-full h-full object-cover rounded-t-lg ${
            property.isLocked && !showFullDetails ? "filter blur-sm" : ""
          }`}
          onError={(e) => {
            console.error(
              `Failed to load image for ${property.title}: ${imageUrl}`
            );
            e.currentTarget.src = "/placeholder.png";
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge className={getTypeColor(property.type)}>{property.type}</Badge>
        </div>

        {showFullDetails && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground">
              {property.matchPercentage}% Match
            </Badge>
          </div>
        )}

        {property.aiInsights?.growthPotential === "High" && showFullDetails && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-green-500 text-white flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              High Growth
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-muted-foreground text-sm">{property.location}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{property.size}</div>
              <div className="text-xs text-muted-foreground">Total Area</div>
            </div>
          </div>

          {showFullDetails && (
            <div className="space-y-3 border-t pt-4">
              {property.aiInsights && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Expected ROI</span>
                    </div>
                    <div className="text-green-600">
                      {property.aiInsights.expectedROI}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Risk Level</span>
                    </div>
                    <div
                      className={getRiskColor(property.aiInsights.riskLevel)}
                    >
                      {property.aiInsights.riskLevel}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Water Connectivity</span>
                  </div>
                  <div>{property.water_connectivity ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Electricity</span>
                  </div>
                  <div>{property.electricity_connectivity ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Gas Connectivity</span>
                  </div>
                  <div>{property.gas_connectivity ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Investment Gain</span>
                  </div>
                  <div>
                    {property.investment_gain
                      ? `${property.investment_gain}%`
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Investment Cost</span>
                  </div>
                  <div>{formatPrice(property.price)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium">Risk Percentage</span>
                  </div>
                  <div>
                    {property.risk_percentage
                      ? `${property.risk_percentage}%`
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Market Risk</span>
                  </div>
                  <div>{property.market_risk ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Gavel className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Regulatory Risk</span>
                  </div>
                  <div>{property.regulatory_risk ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    <span className="font-medium">Financial Risk</span>
                  </div>
                  <div>{property.financial_risk ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Liquidity Risk</span>
                  </div>
                  <div>{property.liquidity_risk ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Physical Risk</span>
                  </div>
                  <div>{property.physical_risk ? "Yes" : "No"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {property.aiInsights?.demandIndicators.viewsThisWeek ||
                    property.views}{" "}
                  views this week
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  High interest area
                </div>
              </div>
            </div>
          )}

          {!showFullDetails && property.isLocked && (
            <div className="text-center py-2 text-muted-foreground text-sm">
              Login to view full details, ROI analysis, and AI insights
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {property.features
              .slice(0, showFullDetails ? 4 : 2)
              .map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            {property.features.length > (showFullDetails ? 4 : 2) && (
              <Badge variant="secondary" className="text-xs">
                +{property.features.length - (showFullDetails ? 4 : 2)} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          variant={
            property.isLocked && !showFullDetails ? "outline" : "default"
          }
          onClick={handleViewDetails}
          disabled={property.isLocked && !showFullDetails}
        >
          {property.isLocked && !showFullDetails
            ? "Unlock Details"
            : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
