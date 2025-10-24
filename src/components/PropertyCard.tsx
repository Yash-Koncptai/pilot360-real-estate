
// import { Property } from "@/data/properties";
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
// import {
//   Star,
//   MapPin,
//   Clock,
//   Heart,
//   Droplet,
//   Zap,
//   Flame,
//   AlertTriangle,
// } from "lucide-react";
// import { toast } from "sonner";

// interface PropertyCardProps {
//   property: Property;
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
//   const navigate = useNavigate();

//   const handleViewDetails = () => {
//     const isSignedIn = !!localStorage.getItem("userToken");
//     if (isSignedIn) {
//       navigate(`/property/${property.id}`);
//     } else {
//       setTargetPropertyId(property.id);
//       setAuthModalOpen(true);
//       toast.error("You are signed out. Please sign in.", {
//         action: {
//           label: "Sign In",
//           onClick: () => setAuthModalOpen(true),
//         },
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
//         src={`http://localhost:5050/${
//           property.images?.[0] || "/placeholder.svg"
//         }`}
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
//             <div className="flex items-center gap-1 text-sm">
//               <span className="font-medium">{property.bedrooms}</span>
//               <span className="text-muted-foreground">bed</span>
//             </div>
//             <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
//             <div className="flex items-center gap-1 text-sm">
//               <span className="font-medium">{property.bathrooms}</span>
//               <span className="text-muted-foreground">bath</span>
//             </div>
//             <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
//             <span className="text-sm text-muted-foreground">
//               {property.type}
//             </span>
//           </div>
//         </div>

//         <div className="text-right">
//           <div className="font-bold text-xl text-primary">
//             {formatPrice(property.price)}
//           </div>
//         </div>

//         <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
//           <div className="flex items-center justify-between text-xs">
//             <span className="text-muted-foreground">Investment Rating:</span>
//             <div className="flex items-center gap-1">
//               <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//               <span className="font-medium">
//                 {property.aiInsights?.investmentRating}/5
//               </span>
//             </div>
//           </div>
//           {property.aiInsights?.neighborhood.commuteTime && (
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">Commute:</span>
//               <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span className="font-medium">
//                   {property.aiInsights.neighborhood.commuteTime}
//                 </span>
//               </div>
//             </div>
//           )}
//           {property.return_of_investment && (
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground">ROI:</span>
//               <span className="font-medium">
//                 {property.return_of_investment}%
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
}: PropertyCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const isSignedIn = !!localStorage.getItem("userToken");
    if (isSignedIn) {
      navigate(`/property/${property.id}`);
    } else {
      setTargetPropertyId(property.id.toString());
      setAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to view property details.",
        variant: "destructive",
        action: {
          label: "Sign In",
          onClick: () => setAuthModalOpen(true),
        },
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
          console.error(
            `Failed to load image for ${property.title}: ${target.src}`
          );
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

        <div className="text-right">
          <div className="font-bold text-xl text-primary">
            {formatPrice(property.price)}
          </div>
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