// import Seo from "@/components/Seo";
// import { LandProperty } from "@/data/landProperties";
// import PropertyCard from "@/components/PropertyCard";
// import { useMemo, useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import AuthModal from "@/components/AuthModal";
// import { AlertTriangle } from "lucide-react";
// import api from "@/utils/api";

// export default function Listings() {
//   const { toast } = useToast();
//   const [params, setParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [location, setLocation] = useState(params.get("location") || "");
//   const [primaryPurpose, setPrimaryPurpose] = useState<
//     "Personal Use" | "Investment" | "Commercial Use" | "any"
//   >((params.get("primary_purpose") as any) || "any");
//   const [type, setType] = useState<
//     | "Agricultural"
//     | "Non-Agricultural"
//     | "Farmhouse"
//     | "Industrial"
//     | "Commercial"
//     | "any"
//   >((params.get("type") as any) || "any");
//   const [min, setMin] = useState(params.get("min") || "");
//   const [max, setMax] = useState(params.get("max") || "");
//   const [bed, setBed] = useState("");
//   const [bath, setBath] = useState("");
//   const [view, setView] = useState<"grid" | "list">("grid");
//   const [properties, setProperties] = useState<LandProperty[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [authModalOpen, setAuthModalOpen] = useState(false);
//   const [targetPropertyId, setTargetPropertyId] = useState<string | null>(null);

//   const validateInputs = () => {
//     if (min && (isNaN(Number(min)) || Number(min) < 0)) {
//       toast({
//         title: "Invalid Minimum Price",
//         description: "Please enter a valid non-negative number.",
//         variant: "destructive",
//       });
//       return false;
//     }
//     if (max && (isNaN(Number(max)) || Number(max) < 0)) {
//       toast({
//         title: "Invalid Maximum Price",
//         description: "Please enter a valid non-negative number.",
//         variant: "destructive",
//       });
//       return false;
//     }
//     if (min && max && Number(min) > Number(max)) {
//       toast({
//         title: "Invalid Price Range",
//         description: "Minimum price must be less than maximum price.",
//         variant: "destructive",
//       });
//       return false;
//     }
//     if (bed && (isNaN(Number(bed)) || Number(bed) < 0)) {
//       toast({
//         title: "Invalid Bedrooms",
//         description: "Please enter a valid non-negative number.",
//         variant: "destructive",
//       });
//       return false;
//     }
//     if (bath && (isNaN(Number(bath)) || Number(bath) < 0)) {
//       toast({
//         title: "Invalid Bathrooms",
//         description: "Please enter a valid non-negative number.",
//         variant: "destructive",
//       });
//       return false;
//     }
//     return true;
//   };

//   const updateSearchParams = () => {
//     const newParams = new URLSearchParams();
//     if (type !== "any") newParams.append("type", type);
//     if (min) newParams.append("min", min);
//     if (max) newParams.append("max", max);
//     if (location) newParams.append("location", location);
//     if (primaryPurpose !== "any") newParams.append("primary_purpose", primaryPurpose);
//     setParams(newParams);
//   };

//   const fetchProperties = async () => {
//     if (!validateInputs()) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const token = localStorage.getItem("userToken");

//     try {
//       const queryParams = new URLSearchParams();
//       if (type !== "any") queryParams.append("type", type);
//       if (min) queryParams.append("min", min);
//       if (max) queryParams.append("max", max);
//       if (location) queryParams.append("location", location);
//       if (primaryPurpose !== "any") queryParams.append("primary_purpose", primaryPurpose);

//         const response = await axios.get(
//           `https://staging.chokhizameen.com/api/user/properties?${queryParams.toString()}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//       if (response.data.success) {
//         const mappedProperties: LandProperty[] = response.data.properties.map(
//           (p: any) => ({
//             ...p,
//             images: p.images.map(
//               (img: string) =>
//                 img.startsWith("http") ? img : `${api.defaults.baseURL}/${img}`
//             ),
//             features: p.features || [],
//             rera_registration: p.rera_restration || p.rera_registration, // Handle typo
//             nearest_school_colleges: p.nearest_school_colleges || [],
//             upcoming_infra: p.upcoming_infra || [],
//           })
//         );
//         setProperties(mappedProperties);
//       } else {
//         throw new Error(response.data.message || "Error fetching properties");
//       }
//     } catch (err: any) {
//       // Guest mode: no token + 401 → show demo data
//       if (err.response?.status === 401 && !token) {
//         const demoProperties: LandProperty[] = [
//           {
//             id: 1,
//             title: "Prime Agricultural Land",
//             price: 2500000,
//             type: "Agricultural",
//             size: "5 Acres",
//             location: "Bopal, Ahmedabad",
//             latitude: 23.0473,
//             longitude: 72.4634,
//             images: ["/placeholder.svg"],
//             private: false,
//             features: ["Water", "Electricity"],
//             description: "Fertile land perfect for farming.",
//             views: 42,
//             matchPercentage: 78,
//             primary_purpose: "Personal Use",
//             water_connectivity: true,
//             electricity_connectivity: true,
//             gas_connectivity: false,
//             investment_gain: 12,
//             return_of_investment: 10,
//             market_risk: false,
//             regulatory_risk: false,
//             financial_risk: false,
//             liquidity_risk: false,
//             physical_risk: false,
//             risk_percentage: 15,
//             createdAt: "2025-01-01",
//             updatedAt: "2025-01-01",
//             taluka: "Daskroi",
//             district: "Ahmedabad",
//             nearest_town: "Bopal",
//             nearest_road: "SP Ring Road",
//             distance_to_nearest_road: 1,
//             nearest_school_colleges: ["DPS Bopal"],
//             zoning_status: "Agricultural",
//             na_permit: false,
//             upcoming_infra: ["Metro Station"],
//             ownership_type: "Freehold",
//             rera_registration: "Not registered",
//             town_planning_permit: "Not Approved",
//             jantri_rate: 1000,
//           },
//           {
//             id: 2,
//             title: "Commercial Plot - SG Highway",
//             price: 12000000,
//             type: "Commercial",
//             size: "2000 sq ft",
//             location: "SG Highway, Ahmedabad",
//             latitude: 23.0225,
//             longitude: 72.5069,
//             images: ["/placeholder.svg"],
//             private: false,
//             features: ["Road Access", "Electricity"],
//             description: "High-traffic commercial zone.",
//             views: 89,
//             matchPercentage: 92,
//             primary_purpose: "Commercial Use",
//             water_connectivity: true,
//             electricity_connectivity: true,
//             gas_connectivity: true,
//             investment_gain: 18,
//             return_of_investment: 15,
//             market_risk: true,
//             regulatory_risk: false,
//             financial_risk: false,
//             liquidity_risk: false,
//             physical_risk: false,
//             risk_percentage: 35,
//             createdAt: "2025-01-02",
//             updatedAt: "2025-01-02",
//             taluka: "Gota",
//             district: "Ahmedabad",
//             nearest_town: "Gota",
//             nearest_road: "SG Highway",
//             distance_to_nearest_road: 0.5,
//             nearest_school_colleges: ["Nirma University"],
//             zoning_status: "Commercial",
//             na_permit: true,
//             upcoming_infra: ["Highway Expansion"],
//             ownership_type: "Leasehold",
//             rera_registration: "PR/GJ/AHMEDABAD/12345",
//             town_planning_permit: "Approved",
//             jantri_rate: 8500,
//           },
//           {
//             id: 3,
//             title: "Farmhouse Land - Sanand",
//             price: 800000,
//             type: "Farmhouse",
//             size: "2 Acres",
//             location: "Sanand, Gujarat",
//             latitude: 22.9676,
//             longitude: 72.3925,
//             images: ["/placeholder.svg"],
//             private: false,
//             features: ["Water", "Boundary Wall"],
//             description: "Peaceful farmhouse land.",
//             views: 23,
//             matchPercentage: 65,
//             primary_purpose: "Personal Use",
//             water_connectivity: true,
//             electricity_connectivity: false,
//             gas_connectivity: false,
//             investment_gain: 8,
//             return_of_investment: 6,
//             market_risk: false,
//             regulatory_risk: true,
//             financial_risk: false,
//             liquidity_risk: true,
//             physical_risk: false,
//             risk_percentage: 25,
//             createdAt: "2025-01-03",
//             updatedAt: "2025-01-03",
//             taluka: "Sanand",
//             district: "Ahmedabad",
//             nearest_town: "Sanand",
//             nearest_road: "NH 47",
//             distance_to_nearest_road: 3,
//             nearest_school_colleges: ["Sanand Public School"],
//             zoning_status: "Residential",
//             na_permit: false,
//             upcoming_infra: ["Industrial Park"],
//             ownership_type: "Freehold",
//             rera_registration: "Not registered",
//             town_planning_permit: "Not Approved",
//             jantri_rate: 500,
//           },
//         ];

//         setProperties(demoProperties);
//         toast({
//           title: "Guest Mode",
//           description: "Showing sample properties. Sign in to view all listings.",
//         });
//       } else {
//         // Real errors (logged-in user issues)
//         let errorMsg = "Failed to load properties. Please try again.";
//         if (err.response?.status === 401) {
//           errorMsg = "Authentication required. Please sign in again.";
//           setAuthModalOpen(true); // Open login modal
//         } else if (err.response?.status === 404) {
//           errorMsg = "Properties endpoint not found.";
//         }

//         setError(errorMsg);
//         toast({
//           title: "Error",
//           description: err.response?.data?.message || errorMsg,
//           variant: "destructive",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, [type, min, max, location, primaryPurpose]);

//   useEffect(() => {
//     updateSearchParams();
//   }, [type, min, max, location, primaryPurpose]);

//   useEffect(() => {
//     if (targetPropertyId && localStorage.getItem("userToken")) {
//       navigate(`/property/${targetPropertyId}`);
//       setTargetPropertyId(null);
//     }
//   }, [targetPropertyId, navigate]);

//   const filtered = useMemo(() => {
//     return properties.filter((p: LandProperty) => {
//       if (primaryPurpose !== "any" && p.primary_purpose !== primaryPurpose)
//         return false;
//       return true;
//     });
//   }, [properties, primaryPurpose]);

//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//         <p className="mt-2 text-muted-foreground">Loading properties...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="flex items-center justify-center gap-2 text-red-600">
//           <AlertTriangle className="w-5 h-5" />
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Seo
//         title="Property Listings | EstateHub"
//         description="Browse properties by purpose, type, location, price, bedrooms, and bathrooms. Switch grid or list view, or open map view."
//         canonicalPath="/listings"
//       />
//       <header role="banner" aria-label="Property Listings">
//         <h1 className="text-3xl font-bold">Property Listings</h1>
//         <p className="text-muted-foreground mt-2">
//           Browse our curated selection of land properties.
//         </p>
//       </header>

//       <section className="mt-6 bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3" aria-label="Property filters">
//         <div className="col-span-2 md:col-span-1 space-y-2">
//           <Label htmlFor="primary-purpose">Primary Purpose</Label>
//           <Select
//             value={primaryPurpose}
//             onValueChange={(v) => setPrimaryPurpose(v as any)}
//             disabled={loading}
//           >
//             <SelectTrigger id="primary-purpose">
//               <SelectValue placeholder="Primary Purpose" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="any">Any</SelectItem>
//               <SelectItem value="Personal Use">Personal Use</SelectItem>
//               <SelectItem value="Investment">Investment</SelectItem>
//               <SelectItem value="Commercial Use">Commercial Use</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="col-span-2 md:col-span-2 space-y-2">
//           <Label htmlFor="location">Location</Label>
//           <Input
//             id="location"
//             placeholder="Enter location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="min-price">Min Price</Label>
//           <Input
//             id="min-price"
//             placeholder="Min Price"
//             type="number"
//             value={min}
//             onChange={(e) => setMin(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="max-price">Max Price</Label>
//           <Input
//             id="max-price"
//             placeholder="Max Price"
//             type="number"
//             value={max}
//             onChange={(e) => setMax(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className="col-span-2 md:col-span-1 space-y-2">
//           <Label htmlFor="type">Property Type</Label>
//           <Select value={type} onValueChange={(v) => setType(v as any)} disabled={loading}>
//             <SelectTrigger id="type">
//               <SelectValue placeholder="Property Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="any">Any</SelectItem>
//               <SelectItem value="Agricultural">Agricultural</SelectItem>
//               <SelectItem value="Non-Agricultural">Non-Agricultural</SelectItem>
//               <SelectItem value="Farmhouse">Farmhouse</SelectItem>
//               <SelectItem value="Industrial">Industrial</SelectItem>
//               <SelectItem value="Commercial">Commercial</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="bedrooms">Bedrooms</Label>
//           <Input
//             id="bedrooms"
//             placeholder="Bedrooms"
//             type="number"
//             value={bed}
//             onChange={(e) => setBed(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="bathrooms">Bathrooms</Label>
//           <Input
//             id="bathrooms"
//             placeholder="Bathrooms"
//             type="number"
//             value={bath}
//             onChange={(e) => setBath(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
//           <Button
//             variant={view === "grid" ? "default" : "secondary"}
//             onClick={() => setView("grid")}
//             disabled={loading}
//           >
//             Grid
//           </Button>
//           <Button
//             variant={view === "list" ? "default" : "secondary"}
//             onClick={() => setView("list")}
//             disabled={loading}
//           >
//             List
//           </Button>
//           <Button asChild>
//             <Link to="/map">Map view</Link>
//           </Button>
//         </div>
//       </section>

//       <section className="mt-6">
//         <div
//           className={
//             view === "grid"
//               ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
//               : "grid gap-4"
//           }
//         >
//           {filtered.map((p) => (
//             <div
//               key={p.id}
//               className={
//                 view === "grid"
//                   ? ""
//                   : "grid grid-cols-1 sm:grid-cols-3 items-stretch gap-4 p-4 rounded-lg border"
//               }
//             >
//               {view === "grid" ? (
//                 <PropertyCard
//                   property={p}
//                   setAuthModalOpen={setAuthModalOpen}
//                   setTargetPropertyId={setTargetPropertyId}
//                 />
//               ) : (
//                 <>
//                   <img
//                     src={`https://staging.chokhizameen.com/${p.images[0]}`}
//                     alt={`${p.title}`}
//                     className="w-full h-40 object-cover rounded-md"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = "/placeholder.svg";
//                     }}
//                   />
//                   <div className="sm:col-span-2 flex flex-col justify-between">
//                     <PropertyCard
//                       property={p}
//                       setAuthModalOpen={setAuthModalOpen}
//                       setTargetPropertyId={setTargetPropertyId}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
//     </>
//   );
// }

import Seo from "@/components/Seo";
import { LandProperty } from "@/data/landProperties";
import PropertyCard from "@/components/PropertyCard";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import { AlertTriangle } from "lucide-react";
import api from "@/utils/api";

export default function Listings() {
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(params.get("location") || "");
  const [primaryPurpose, setPrimaryPurpose] = useState<
    "Personal Use" | "Investment" | "Commercial Use" | "any"
  >((params.get("primary_purpose") as any) || "any");
  const [type, setType] = useState<
    | "Agricultural"
    | "Non-Agricultural"
    | "Farmhouse"
    | "Industrial"
    | "Commercial"
    | "any"
  >((params.get("type") as any) || "any");
  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");
  const [bed, setBed] = useState("");
  const [bath, setBath] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [properties, setProperties] = useState<LandProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetPropertyId, setTargetPropertyId] = useState<string | null>(null);

  // ADD THIS LINE - Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("userToken");

  const validateInputs = () => {
    if (min && (isNaN(Number(min)) || Number(min) < 0)) {
      toast({
        title: "Invalid Minimum Price",
        description: "Please enter a valid non-negative number.",
        variant: "destructive",
      });
      return false;
    }
    if (max && (isNaN(Number(max)) || Number(max) < 0)) {
      toast({
        title: "Invalid Maximum Price",
        description: "Please enter a valid non-negative number.",
        variant: "destructive",
      });
      return false;
    }
    if (min && max && Number(min) > Number(max)) {
      toast({
        title: "Invalid Price Range",
        description: "Minimum price must be less than maximum price.",
        variant: "destructive",
      });
      return false;
    }
    if (bed && (isNaN(Number(bed)) || Number(bed) < 0)) {
      toast({
        title: "Invalid Bedrooms",
        description: "Please enter a valid non-negative number.",
        variant: "destructive",
      });
      return false;
    }
    if (bath && (isNaN(Number(bath)) || Number(bath) < 0)) {
      toast({
        title: "Invalid Bathrooms",
        description: "Please enter a valid non-negative number.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const updateSearchParams = () => {
    const newParams = new URLSearchParams();
    if (type !== "any") newParams.append("type", type);
    if (min) newParams.append("min", min);
    if (max) newParams.append("max", max);
    if (location) newParams.append("location", location);
    if (primaryPurpose !== "any") newParams.append("primary_purpose", primaryPurpose);
    setParams(newParams);
  };

  const fetchProperties = async () => {
    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("userToken");

    try {
      const queryParams = new URLSearchParams();
      if (type !== "any") queryParams.append("type", type);
      if (min) queryParams.append("min", min);
      if (max) queryParams.append("max", max);
      if (location) queryParams.append("location", location);
      if (primaryPurpose !== "any") queryParams.append("primary_purpose", primaryPurpose);

      const response = await api.get(
        `/api/user/properties?${queryParams.toString()}`,
        token
          ? {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          : {}
      );

      if (response.data.success) {
        const mappedProperties: LandProperty[] = response.data.properties.map(
          (p: any) => ({
            ...p,
            images: p.images.map(
              (img: string) =>
                img.startsWith("http") ? img : `${api.defaults.baseURL}/${img}`
            ),
            features: p.features || [],
            rera_registration: p.rera_restration || p.rera_registration,
            nearest_school_colleges: p.nearest_school_colleges || [],
            upcoming_infra: p.upcoming_infra || [],
          })
        );
        setProperties(mappedProperties);
      } else {
        throw new Error(response.data.message || "Error fetching properties");
      }
    } catch (err: any) {
      if (err.response?.status === 401 && !token) {
        const demoProperties: LandProperty[] = [
          // ... your demo data (unchanged)
          {
            id: 1,
            title: "Prime Agricultural Land",
            price: 2500000,
            type: "Agricultural",
            size: "5 Acres",
            location: "Bopal, Ahmedabad",
            latitude: 23.0473,
            longitude: 72.4634,
            images: ["/placeholder.svg"],
            private: false,
            features: ["Water", "Electricity"],
            description: "Fertile land perfect for farming.",
            views: 42,
            matchPercentage: 78,
            primary_purpose: "Personal Use",
            water_connectivity: true,
            electricity_connectivity: true,
            gas_connectivity: false,
            investment_gain: 12,
            return_of_investment: 10,
            market_risk: false,
            regulatory_risk: false,
            financial_risk: false,
            liquidity_risk: false,
            physical_risk: false,
            risk_percentage: 15,
            createdAt: "2025-01-01",
            updatedAt: "2025-01-01",
            taluka: "Daskroi",
            district: "Ahmedabad",
            nearest_town: "Bopal",
            nearest_road: "SP Ring Road",
            distance_to_nearest_road: 1,
            nearest_school_colleges: ["DPS Bopal"],
            zoning_status: "Agricultural",
            na_permit: false,
            upcoming_infra: ["Metro Station"],
            ownership_type: "Freehold",
            rera_registration: "Not registered",
            town_planning_permit: "Not Approved",
            jantri_rate: 1000,
          },
          {
            id: 2,
            title: "Commercial Plot - SG Highway",
            price: 12000000,
            type: "Commercial",
            size: "2000 sq ft",
            location: "SG Highway, Ahmedabad",
            latitude: 23.0225,
            longitude: 72.5069,
            images: ["/placeholder.svg"],
            private: false,
            features: ["Road Access", "Electricity"],
            description: "High-traffic commercial zone.",
            views: 89,
            matchPercentage: 92,
            primary_purpose: "Commercial Use",
            water_connectivity: true,
            electricity_connectivity: true,
            gas_connectivity: true,
            investment_gain: 18,
            return_of_investment: 15,
            market_risk: true,
            regulatory_risk: false,
            financial_risk: false,
            liquidity_risk: false,
            physical_risk: false,
            risk_percentage: 35,
            createdAt: "2025-01-02",
            updatedAt: "2025-01-02",
            taluka: "Gota",
            district: "Ahmedabad",
            nearest_town: "Gota",
            nearest_road: "SG Highway",
            distance_to_nearest_road: 0.5,
            nearest_school_colleges: ["Nirma University"],
            zoning_status: "Commercial",
            na_permit: true,
            upcoming_infra: ["Highway Expansion"],
            ownership_type: "Leasehold",
            rera_registration: "PR/GJ/AHMEDABAD/12345",
            town_planning_permit: "Approved",
            jantri_rate: 8500,
          },
          {
            id: 3,
            title: "Farmhouse Land - Sanand",
            price: 800000,
            type: "Farmhouse",
            size: "2 Acres",
            location: "Sanand, Gujarat",
            latitude: 22.9676,
            longitude: 72.3925,
            images: ["/placeholder.svg"],
            private: false,
            features: ["Water", "Boundary Wall"],
            description: "Peaceful farmhouse land.",
            views: 23,
            matchPercentage: 65,
            primary_purpose: "Personal Use",
            water_connectivity: true,
            electricity_connectivity: false,
            gas_connectivity: false,
            investment_gain: 8,
            return_of_investment: 6,
            market_risk: false,
            regulatory_risk: true,
            financial_risk: false,
            liquidity_risk: true,
            physical_risk: false,
            risk_percentage: 25,
            createdAt: "2025-01-03",
            updatedAt: "2025-01-03",
            taluka: "Sanand",
            district: "Ahmedabad",
            nearest_town: "Sanand",
            nearest_road: "NH 47",
            distance_to_nearest_road: 3,
            nearest_school_colleges: ["Sanand Public School"],
            zoning_status: "Residential",
            na_permit: false,
            upcoming_infra: ["Industrial Park"],
            ownership_type: "Freehold",
            rera_registration: "Not registered",
            town_planning_permit: "Not Approved",
            jantri_rate: 500,
          },
        ];

        setProperties(demoProperties);
        toast({
          title: "Guest Mode",
          description: "Showing sample properties. Sign in to view all listings.",
        });
      } else {
        let errorMsg = "Failed to load properties. Please try again.";
        if (err.response?.status === 401) {
          errorMsg = "Authentication required. Please sign in again.";
          setAuthModalOpen(true);
        } else if (err.response?.status === 404) {
          errorMsg = "Properties endpoint not found.";
        }

        setError(errorMsg);
        toast({
          title: "Error",
          description: err.response?.data?.message || errorMsg,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type, min, max, location, primaryPurpose]);

  useEffect(() => {
    updateSearchParams();
  }, [type, min, max, location, primaryPurpose]);

  useEffect(() => {
    if (targetPropertyId && localStorage.getItem("userToken")) {
      navigate(`/property/${targetPropertyId}`);
      setTargetPropertyId(null);
    }
  }, [targetPropertyId, navigate]);

  const filtered = useMemo(() => {
    return properties.filter((p: LandProperty) => {
      if (primaryPurpose !== "any" && p.primary_purpose !== primaryPurpose)
        return false;
      return true;
    });
  }, [properties, primaryPurpose]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Property Listings | EstateHub"
        description="Browse properties by purpose, type, location, price, bedrooms, and bathrooms. Switch grid or list view, or open map view."
        canonicalPath="/listings"
      />
      <header role="banner" aria-label="Property Listings">
        <h1 className="text-3xl font-bold">Property Listings</h1>
        <p className="text-muted-foreground mt-2">
          Browse our curated selection of land properties.
        </p>
      </header>

      {/* Filters section - unchanged */}
      <section className="mt-6 bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3" aria-label="Property filters">
        {/* ... all your filter inputs ... */}
        <div className="col-span-2 md:col-span-1 space-y-2">
          <Label htmlFor="primary-purpose">Primary Purpose</Label>
          <Select
            value={primaryPurpose}
            onValueChange={(v) => setPrimaryPurpose(v as any)}
            disabled={loading}
          >
            <SelectTrigger id="primary-purpose">
              <SelectValue placeholder="Primary Purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Personal Use">Personal Use</SelectItem>
              <SelectItem value="Investment">Investment</SelectItem>
              <SelectItem value="Commercial Use">Commercial Use</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 md:col-span-2 space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min-price">Min Price</Label>
          <Input
            id="min-price"
            placeholder="Min Price"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-price">Max Price</Label>
          <Input
            id="max-price"
            placeholder="Max Price"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-span-2 md:col-span-1 space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)} disabled={loading}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Agricultural">Agricultural</SelectItem>
              <SelectItem value="Non-Agricultural">Non-Agricultural</SelectItem>
              <SelectItem value="Farmhouse">Farmhouse</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            placeholder="Bedrooms"
            type="number"
            value={bed}
            onChange={(e) => setBed(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            placeholder="Bathrooms"
            type="number"
            value={bath}
            onChange={(e) => setBath(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
          <Button
            variant={view === "grid" ? "default" : "secondary"}
            onClick={() => setView("grid")}
            disabled={loading}
          >
            Grid
          </Button>
          <Button
            variant={view === "list" ? "default" : "secondary"}
            onClick={() => setView("list")}
            disabled={loading}
          >
            List
          </Button>
          <Button asChild>
            <Link to="/map">Map view</Link>
          </Button>
        </div>
      </section>

      {/* Property Grid/List */}
      <section className="mt-6">
        <div
          className={
            view === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "grid gap-4"
          }
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              className={
                view === "grid"
                  ? ""
                  : "grid grid-cols-1 sm:grid-cols-3 items-stretch gap-4 p-4 rounded-lg border"
              }
            >
              {view === "grid" ? (
                <PropertyCard
                  property={p}
                  isAuthenticated={isAuthenticated}           
                  setAuthModalOpen={setAuthModalOpen}
                  setTargetPropertyId={setTargetPropertyId}
                />
              ) : (
                <>
                  <img
                    src={`https://staging.chokhizameen.com/${p.images[0]}`}
                    alt={`${p.title}`}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="sm:col-span-2 flex flex-col justify-between">
                    <PropertyCard
                      property={p}
                      isAuthenticated={isAuthenticated}         
                      setAuthModalOpen={setAuthModalOpen}
                      setTargetPropertyId={setTargetPropertyId}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}