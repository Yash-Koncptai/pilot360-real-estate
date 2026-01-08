// import { LandProperty } from "@/data/landProperties";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useNavigate } from "react-router-dom";
// import { MapPin, Droplet, Zap, Flame, AlertTriangle, Heart } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import api from "@/utils/api";

// interface PropertyCardProps {
//   property: LandProperty;
//   setAuthModalOpen: (open: boolean) => void;
//   setTargetPropertyId: (id: string) => void;
// }

// const formatPrice = (value: number) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(value);
// };

// export default function PropertyCard({
//   property,
//   setAuthModalOpen,
//   setTargetPropertyId,
// }: PropertyCardProps) {
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleViewDetails = () => {
//     const isSignedIn = !!localStorage.getItem("userToken");
//     if (isSignedIn) {
//       navigate(`/property/${property.id}`);
//     } else {
//       setTargetPropertyId(property.id.toString());
//       setAuthModalOpen(true);
//       toast({
//         title: "Authentication Required",
//         description: (
//           <div>
//             You are signed out.{" "}
//             <button
//               onClick={() => setAuthModalOpen(true)}
//               className="underline text-primary font-medium"
//             >
//               Sign in first
//             </button>
//             .
//           </div>
//         ),
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
//       <Badge className="absolute top-3 right-3 z-10 bg-white/90 text-gray-800 shadow-md">
//         {property.primary_purpose || "Not specified"}
//       </Badge>
//       {property.matchPercentage !== undefined && (
//         <Badge className="absolute top-3 left-3 z-10 bg-green-500/90 text-white shadow-md flex items-center gap-1">
//           <Heart className="w-3 h-3 fill-white" />
//           {property.matchPercentage}% Match
//         </Badge>
//       )}

//       <img
//         src={
//           property.images[0]?.startsWith("http")
//             ? property.images[0]
//             : `${api.defaults.baseURL}/${property.images[0] || "/placeholder.svg"}`
//         }
//         alt={`${property.title} - ${property.location}`}
//         loading="lazy"
//         className="h-48 w-full object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.src = "/placeholder.svg";
//           console.error(
//             `Failed to load image for ${property.title}: ${target.src}`
//           );
//         }}
//       />
//       <CardHeader className="pb-3">
//         <CardTitle className="text-base font-bold leading-tight mb-2">
//           {property.title}
//         </CardTitle>
//         <div className="flex items-center gap-1 text-sm text-muted-foreground">
//           <MapPin className="w-4 h-4" />
//           <p>{property.location}</p>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-muted-foreground">
//               {property.type}
//             </span>
//             <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
//             <span className="text-sm text-muted-foreground">
//               {property.size}
//             </span>
//           </div>
//         </div>

//         <div className="text-right">
//           <div className="font-bold text-xl text-primary">
//             {formatPrice(property.price)}
//           </div>
//         </div>

//         <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
//           {property.return_of_investment && (
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">ROI:</span>
//               <span className="font-medium">
//                 {property.return_of_investment}% per annum
//               </span>
//             </div>
//           )}
//           <div className="flex items-center justify-between text-xs">
//             <span className="text-muted-foreground">Utilities:</span>
//             <div className="flex items-center gap-2">
//               {property.water_connectivity && (
//                 <Droplet className="w-3 h-3 text-blue-500" />
//               )}
//               {property.electricity_connectivity && (
//                 <Zap className="w-3 h-3 text-yellow-500" />
//               )}
//               {property.gas_connectivity && (
//                 <Flame className="w-3 h-3 text-orange-500" />
//               )}
//             </div>
//           </div>
//           {property.risk_percentage && (
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Risk:</span>
//               <div className="flex items-center gap-1">
//                 <AlertTriangle className="w-3 h-3 text-red-500" />
//                 <span className="font-medium">{property.risk_percentage}%</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Collapsible Property Details Section */}
//         <details className="space-y-2 p-3 bg-secondary/10 rounded-lg">
//           <summary className="text-sm font-semibold cursor-pointer">
//             Property Details
//           </summary>
//           <div className="space-y-2 pt-2">
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Taluka:</span>
//               <span className="font-medium">
//                 {property.taluka || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">District:</span>
//               <span className="font-medium">
//                 {property.district || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Nearest Town:</span>
//               <span className="font-medium">
//                 {property.nearest_town || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Nearest Road:</span>
//               <span className="font-medium">
//                 {property.nearest_road || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Distance to Road:</span>
//               <span className="font-medium">
//                 {property.distance_to_nearest_road != null
//                   ? `${property.distance_to_nearest_road} km`
//                   : "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Nearest Schools/Colleges:</span>
//               <span className="font-medium">
//                 {property.nearest_school_colleges?.length
//                   ? property.nearest_school_colleges.join(", ")
//                   : "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Zoning Status:</span>
//               <span className="font-medium">
//                 {property.zoning_status || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">NA Permit:</span>
//               <span className="font-medium">
//                 {property.na_permit ? "Yes" : "No"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Upcoming Infra:</span>
//               <span className="font-medium">
//                 {property.upcoming_infra?.length
//                   ? property.upcoming_infra.join(", ")
//                   : "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Ownership Type:</span>
//               <span className="font-medium">
//                 {property.ownership_type || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">RERA Registration:</span>
//               <span className="font-medium">
//                 {property.rera_registration || "Not registered"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Town Planning Permit:</span>
//               <span className="font-medium">
//                 {property.town_planning_permit || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Jantri Rate:</span>
//               <span className="font-medium">
//                 {property.jantri_rate != null
//                   ? formatPrice(property.jantri_rate) + " per sq ft"
//                   : "Not specified"}
//               </span>
//             </div>
//           </div>
//         </details>
//       </CardContent>
//       <CardFooter>
//         <Button
//           className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
//           onClick={handleViewDetails}
//         >
//           View Details
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }

import { LandProperty } from "@/data/landProperties";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Droplet, Zap, Flame, AlertTriangle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

interface PropertyCardProps {
  property: LandProperty;
  setAuthModalOpen: (open: boolean) => void;
  setTargetPropertyId: (id: string) => void;
  isAuthenticated: boolean; // ← NEW PROP
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PropertyCard({
  property,
  setAuthModalOpen,
  setTargetPropertyId,
  isAuthenticated,
}: PropertyCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (isAuthenticated) {
      navigate(`/property/${property.id}`);
    } else {
      setTargetPropertyId(property.id.toString());
      setAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: (
          <div>
            You are signed out.{" "}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="underline text-primary font-medium"
            >
              Sign in first
            </button>
            .
          </div>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <Badge className="absolute top-3 right-3 z-10 bg-white/90 text-gray-800 shadow-md">
        {property.primary_purpose || "Not specified"}
      </Badge>
      {property.matchPercentage !== undefined && (
        <Badge className="absolute top-3 left-3 z-10 bg-green-500/90 text-white shadow-md flex items-center gap-1">
          <Heart className="w-3 h-3 fill-white" />
          {property.matchPercentage}% Match
        </Badge>
      )}

      <img
        src={
          property.images[0]?.startsWith("http")
            ? property.images[0]
            : `${api.defaults.baseURL}/${property.images[0] || "/placeholder.svg"}`
        }
        alt={`${property.title} - ${property.location}`}
        loading="lazy"
        className="h-48 w-full object-cover"
        onError={(e) => {


          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />

      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold leading-tight mb-2">
          {property.title}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <p>{property.location}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {property.type}
            </span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {property.size}
            </span>
          </div>
        </div>

        {/* BLURRED PRICE FOR GUESTS */}
        <div className="text-right">
          {isAuthenticated ? (
            <div className="font-bold text-xl text-primary">
              {formatPrice(property.price)}
            </div>
          ) : (
            <div className="relative inline-block">
              <div className="font-bold text-xl blur-sm select-none text-gray-400">
                ₹XX,XX,XXX
              </div>
              <span className="absolute inset-0 flex items-center justify-end text-xs text-muted-foreground italic pointer-events-none">
                Sign in to view price
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
          {property.return_of_investment && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ROI:</span>
              <span className="font-medium">
                {property.return_of_investment}% per annum
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Utilities:</span>
            <div className="flex items-center gap-2">
              {property.water_connectivity && (
                <Droplet className="w-3 h-3 text-blue-500" />
              )}
              {property.electricity_connectivity && (
                <Zap className="w-3 h-3 text-yellow-500" />
              )}
              {property.gas_connectivity && (
                <Flame className="w-3 h-3 text-orange-500" />
              )}
            </div>
          </div>
          {property.risk_percentage && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Risk:</span>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="font-medium">{property.risk_percentage}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Property Details (unchanged) */}
        <details className="space-y-2 p-3 bg-secondary/10 rounded-lg">
          <summary className="text-sm font-semibold cursor-pointer">
            Property Details
          </summary>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Taluka:</span>
              <span className="font-medium">
                {property.taluka || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">District:</span>
              <span className="font-medium">
                {property.district || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Nearest Town:</span>
              <span className="font-medium">
                {property.nearest_town || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Nearest Road:</span>
              <span className="font-medium">
                {property.nearest_road || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Distance to Road:</span>
              <span className="font-medium">
                {property.distance_to_nearest_road != null
                  ? `${property.distance_to_nearest_road} km`
                  : "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Nearest Schools/Colleges:</span>
              <span className="font-medium">
                {property.nearest_school_colleges?.length
                  ? property.nearest_school_colleges.join(", ")
                  : "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Zoning Status:</span>
              <span className="font-medium">
                {property.zoning_status || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">NA Permit:</span>
              <span className="font-medium">
                {property.na_permit ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Upcoming Infra:</span>
              <span className="font-medium">
                {property.upcoming_infra?.length
                  ? property.upcoming_infra.join(", ")
                  : "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ownership Type:</span>
              <span className="font-medium">
                {property.ownership_type || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">RERA Registration:</span>
              <span className="font-medium">
                {property.rera_registration || "Not registered"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Town Planning Permit:</span>
              <span className="font-medium">
                {property.town_planning_permit || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Jantri Rate:</span>
              <span className="font-medium">
                {property.jantri_rate != null
                  ? formatPrice(property.jantri_rate) + " per sq ft"
                  : "Not specified"}
              </span>
            </div>
          </div>
        </details>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}