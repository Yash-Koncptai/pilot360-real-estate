// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { LandProperty } from '@/data/landProperties';
// import { MapPin, Ruler, TrendingUp, DollarSign, Eye, Calendar, Star, Shield, Zap } from 'lucide-react';

// interface PropertyDetailModalProps {
//   property: LandProperty | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
//   if (!property) return null;

//   const formatCurrency = (value: number) => {
//     if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
//     return `₹${(value / 100000).toFixed(1)}L`;
//   };

//   const getRiskColor = (risk: string) => {
//     switch (risk) {
//       case 'Low': return 'text-green-600 bg-green-50';
//       case 'Medium': return 'text-yellow-600 bg-yellow-50';
//       case 'High': return 'text-red-600 bg-red-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   const getGrowthColor = (growth: string) => {
//     switch (growth) {
//       case 'High': return 'text-green-600 bg-green-50';
//       case 'Medium': return 'text-yellow-600 bg-yellow-50';
//       case 'Low': return 'text-red-600 bg-red-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Image Gallery */}
//           <div className="grid md:grid-cols-2 gap-4">
//             {property.images.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={`${property.title} - Image ${index + 1}`}
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//             ))}
//           </div>

//           {/* Basic Info */}
//           <div className="grid md:grid-cols-3 gap-6">
//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <DollarSign className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">Price</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{formatCurrency(property.price)}</div>
//                 <p className="text-xs text-muted-foreground">
//                   ₹{(property.price / (parseFloat(property.size.split(' ')[0]) * (property.size.includes('acre') ? 43560 : 1))).toLocaleString()}/sq ft
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <Ruler className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">Size</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{property.size}</div>
//                 <p className="text-xs text-muted-foreground">{property.type}</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <MapPin className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">Location</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-lg font-semibold">{property.location}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* AI Insights */}
//           {property.aiInsights && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Zap className="w-5 h-5 text-primary" />
//                   AI Investment Insights
//                 </CardTitle>
//                 <CardDescription>Data-driven analysis for smart decision making</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid md:grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <div className="text-sm text-muted-foreground">Growth Potential</div>
//                     <Badge className={getGrowthColor(property.aiInsights.growthPotential)}>
//                       {property.aiInsights.growthPotential}
//                     </Badge>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-sm text-muted-foreground">Expected ROI</div>
//                     <div className="text-lg font-bold text-green-600">{property.aiInsights.expectedROI}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-sm text-muted-foreground">Risk Level</div>
//                     <Badge className={getRiskColor(property.aiInsights.riskLevel)}>
//                       {property.aiInsights.riskLevel}
//                     </Badge>
//                   </div>
//                 </div>

//                 {property.aiInsights.matchScore && (
//                   <div className="text-center p-4 bg-primary/5 rounded-lg">
//                     <div className="text-sm text-muted-foreground">AI Match Score</div>
//                     <div className="text-2xl font-bold text-primary">{property.aiInsights.matchScore}%</div>
//                     <p className="text-xs text-muted-foreground">Based on your preferences</p>
//                   </div>
//                 )}

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <div className="font-semibold text-sm mb-2">Market Demand</div>
//                     <div className="space-y-1">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm">Views this week</span>
//                         <Badge variant="outline">
//                           <Eye className="w-3 h-3 mr-1" />
//                           {property.aiInsights.demandIndicators.viewsThisWeek}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-sm mb-2">Nearby Developments</div>
//                     <div className="space-y-1">
//                       {property.aiInsights.demandIndicators.nearbyDevelopments.map((dev, index) => (
//                         <div key={index} className="text-xs text-muted-foreground">{dev}</div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Features */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Property Features</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
//                 {property.features.map((feature, index) => (
//                   <Badge key={index} variant="secondary" className="justify-center">
//                     {feature}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Description */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground leading-relaxed">{property.description}</p>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <Button className="flex-1" size="lg">
//               <Star className="w-4 h-4 mr-2" />
//               Express Interest
//             </Button>
//             <Button variant="outline" className="flex-1" size="lg">
//               <Calendar className="w-4 h-4 mr-2" />
//               Schedule Visit
//             </Button>
//             <Button variant="outline" className="flex-1" size="lg">
//               <Shield className="w-4 h-4 mr-2" />
//               Get Legal Verification
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   MapPin,
//   Ruler,
//   DollarSign,
//   Eye,
//   Calendar,
//   Star,
//   Shield,
// } from "lucide-react";

// interface PropertyDetailModalProps {
//   property: any | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function PropertyDetailModal({
//   property,
//   isOpen,
//   onClose,
// }: PropertyDetailModalProps) {
//   if (!property) return null;

//   const formatCurrency = (value: number) => {
//     if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
//     return `₹${(value / 100000).toFixed(1)}L`;
//   };

//   const formatPriceDisplay = (value: number) => {
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent
//         className="max-w-4xl max-h-[90vh] overflow-y-auto"
//         aria-describedby="property-detail-description"
//       >
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">
//             {property.title}
//           </DialogTitle>
//         </DialogHeader>
//         <p id="property-detail-description" className="sr-only">
//           Detailed information about the property including price, size,
//           location, features, and description.
//         </p>

//         <div className="space-y-6">
//           {/* Image Gallery */}
//           <div className="grid md:grid-cols-2 gap-4">
//             {property.images && property.images.length > 0 ? (
//               property.images.map((image: string, index: number) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`${property.title} - Image ${index + 1}`}
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//               ))
//             ) : (
//               <p className="text-muted-foreground">No images available</p>
//             )}
//           </div>

//           {/* Basic Info */}
//           <div className="grid md:grid-cols-3 gap-6">
//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <DollarSign className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">
//                   Price
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   ₹{formatPriceDisplay(property.price)}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {formatCurrency(property.price)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <Ruler className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">Size</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{property.size}</div>
//                 <p className="text-xs text-muted-foreground">{property.type}</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center space-y-0 pb-2">
//                 <MapPin className="w-4 h-4 text-primary" />
//                 <CardTitle className="text-sm font-medium ml-2">
//                   Location
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-lg font-semibold">{property.location}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {property.latitude.toFixed(4)},{" "}
//                   {property.longitude.toFixed(4)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Features */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Property Features</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
//                 {property.features && property.features.length > 0 ? (
//                   property.features.map((feature: string, index: number) => (
//                     <Badge
//                       key={index}
//                       variant="secondary"
//                       className="justify-center"
//                     >
//                       {feature}
//                     </Badge>
//                   ))
//                 ) : (
//                   <p className="text-muted-foreground">No features available</p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Description */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground leading-relaxed">
//                 {property.description || "No description available"}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <Button className="flex-1" size="lg">
//               <Star className="w-4 h-4 mr-2" />
//               Express Interest
//             </Button>
//             <Button variant="outline" className="flex-1" size="lg">
//               <Calendar className="w-4 h-4 mr-2" />
//               Schedule Visit
//             </Button>
//             <Button variant="outline" className="flex-1" size="lg">
//               <Shield className="w-4 h-4 mr-2" />
//               Get Legal Verification
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

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
          purpose, location, features, description, and status.
        </p>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid md:grid-cols-2 gap-4">
            {property.images && property.images.length > 0 ? (
              property.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
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
          </div>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={property.private ? "destructive" : "default"}>
                {property.private ? "Private" : "Available"}
              </Badge>
            </CardContent>
          </Card>

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

          {/* Action Buttons */}
          {/* <div className="flex gap-4 pt-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => handleAction("Express Interest")}
            >
              <Star className="w-4 h-4 mr-2" />
              Express Interest
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => handleAction("Schedule Visit")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Visit
            </Button>
            <Button
              variant="outline"
              className="flow-1"
              size="lg"
              onClick={() => handleAction("Get Legal Verification")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Get Legal Verification
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
