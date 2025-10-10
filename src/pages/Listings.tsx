// import Seo from "@/components/Seo";
// import { properties, Property } from "@/data/properties";
// import PropertyCard from "@/components/PropertyCard";
// import { useMemo, useState } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { useSearchParams, Link } from "react-router-dom";

// export default function Listings() {
//   const [params] = useSearchParams();
//   const [location, setLocation] = useState(params.get("location") || "");
//   const [forType, setForType] = useState<"buy" | "rent">(
//     (params.get("for") as any) || "buy"
//   );
//   const [type, setType] = useState<"Apartment" | "House" | "Villa" | "any">(
//     (params.get("type") as any) || "any"
//   );
//   const [min, setMin] = useState(params.get("min") || "");
//   const [max, setMax] = useState(params.get("max") || "");
//   const [bed, setBed] = useState("");
//   const [bath, setBath] = useState("");
//   const [view, setView] = useState<"grid" | "list">("grid");

//   const filtered = useMemo(() => {
//     return properties.filter((p: Property) => {
//       if (p.for !== forType) return false;
//       if (
//         location &&
//         !p.location.toLowerCase().includes(location.toLowerCase())
//       )
//         return false;
//       if (type !== "any" && p.type !== type) return false;
//       if (min && p.price < Number(min)) return false;
//       if (max && p.price > Number(max)) return false;
//       if (bed && p.bedrooms < Number(bed)) return false;
//       if (bath && p.bathrooms < Number(bath)) return false;
//       return true;
//     });
//   }, [forType, location, type, min, max, bed, bath]);

//   return (
//     <>
//       <Seo
//         title="Property Listings | EstateHub"
//         description="Browse properties for sale and rent. Filter by location, price, type, bedrooms and bathrooms. Switch grid or list view, or open map view."
//         canonicalPath="/listings"
//       />
//       <h1 className="sr-only">Property Listings</h1>

//       <section className="bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3">
//         <Select value={forType} onValueChange={(v) => setForType(v as any)}>
//           <SelectTrigger className="col-span-2 md:col-span-1">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="buy">Buy</SelectItem>
//             <SelectItem value="rent">Rent</SelectItem>
//           </SelectContent>
//         </Select>
//         <Input
//           placeholder="Location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="col-span-2 md:col-span-2"
//         />
//         <Input
//           placeholder="Min"
//           type="number"
//           value={min}
//           onChange={(e) => setMin(e.target.value)}
//         />
//         <Input
//           placeholder="Max"
//           type="number"
//           value={max}
//           onChange={(e) => setMax(e.target.value)}
//         />
//         <Select value={type} onValueChange={(v) => setType(v as any)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="any">Any</SelectItem>
//             <SelectItem value="Apartment">Apartment</SelectItem>
//             <SelectItem value="House">House</SelectItem>
//             <SelectItem value="Villa">Villa</SelectItem>
//           </SelectContent>
//         </Select>
//         <Input
//           placeholder="Bedrooms"
//           type="number"
//           value={bed}
//           onChange={(e) => setBed(e.target.value)}
//         />
//         <Input
//           placeholder="Bathrooms"
//           type="number"
//           value={bath}
//           onChange={(e) => setBath(e.target.value)}
//         />
//         <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
//           <Button
//             variant={view === "grid" ? "default" : "secondary"}
//             onClick={() => setView("grid")}
//           >
//             Grid
//           </Button>
//           <Button
//             variant={view === "list" ? "default" : "secondary"}
//             onClick={() => setView("list")}
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
//                 <PropertyCard property={p} />
//               ) : (
//                 <>
//                   <img
//                     src={p.images[0]}
//                     alt={`${p.title}`}
//                     className="w-full h-40 object-cover rounded-md"
//                   />
//                   <div className="sm:col-span-2 flex flex-col justify-between">
//                     <PropertyCard property={p} />
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }
import Seo from "@/components/Seo";
import { Property } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function Listings() {
  const [params] = useSearchParams();
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Please sign in to view properties.");
        setLoading(false);
        toast.error("Please sign in to continue.", {
          action: {
            label: "Sign In",
            onClick: () => navigate("/signin"),
          },
        });
        return;
      }

      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (type !== "any") queryParams.append("type", type);
        if (min) queryParams.append("min", min);
        if (max) queryParams.append("max", max);
        if (location) queryParams.append("location", location);
        if (primaryPurpose !== "any")
          queryParams.append("primary_purpose", primaryPurpose);

        const response = await axios.get(
          `http://localhost:5000/api/user/properties?${queryParams.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const mappedProperties: Property[] = response.data.properties.map(
            (p: any) => ({
              ...p,
              primary_purpose: p.primary_purpose, // Map API's snake_case field
              bedrooms: 2, // Placeholder
              bathrooms: 2, // Placeholder
              floorplan: "/placeholder.svg",
              pros: ["Great location", "Well-maintained"],
              amenities: p.features || ["Basic amenities"],
              aiInsights: {
                neighborhood: {
                  schools: 5,
                  hospitals: 3,
                  malls: 2,
                  crimeRate: "Low",
                  commuteTime: "15 min to city center",
                },
                priceAnalysis: "Competitive pricing for the area.",
                investmentRating: 4.0,
              },
            })
          );
          setProperties(mappedProperties);
        } else {
          throw new Error(response.data.message || "Error fetching properties");
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please sign in again.");
          toast.error("Session expired. Please sign in again.", {
            action: {
              label: "Sign In",
              onClick: () => navigate("/signin"),
            },
          });
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load properties"
          );
          toast.error(
            err.response?.data?.message ||
              "Failed to load properties. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [navigate, type, min, max, location, primaryPurpose]);

  const filtered = useMemo(() => {
    return properties.filter((p: Property) => {
      if (primaryPurpose !== "any" && p.primary_purpose !== primaryPurpose)
        return false;
      if (bed && p.bedrooms! < Number(bed)) return false;
      if (bath && p.bathrooms! < Number(bath)) return false;
      return true;
    });
  }, [properties, primaryPurpose, bed, bath]);

  if (loading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Seo
        title="Property Listings | EstateHub"
        description="Browse properties by purpose, type, location, price, bedrooms, and bathrooms. Switch grid or list view, or open map view."
        canonicalPath="/listings"
      />
      <h1 className="sr-only">Property Listings</h1>

      <section className="bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3">
        <Select
          value={primaryPurpose}
          onValueChange={(v) => setPrimaryPurpose(v as any)}
        >
          <SelectTrigger className="col-span-2 md:col-span-1">
            <SelectValue placeholder="Primary Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Primary-Purpose</SelectItem>
            <SelectItem value="Personal Use">Personal Use</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
            <SelectItem value="Commercial Use">Commercial Use</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="col-span-2 md:col-span-2"
        />
        <Input
          placeholder="Min"
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <Input
          placeholder="Max"
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <Select value={type} onValueChange={(v) => setType(v as any)}>
          <SelectTrigger>
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
        <Input
          placeholder="Bedrooms"
          type="number"
          value={bed}
          onChange={(e) => setBed(e.target.value)}
        />
        <Input
          placeholder="Bathrooms"
          type="number"
          value={bath}
          onChange={(e) => setBath(e.target.value)}
        />
        <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
          <Button
            variant={view === "grid" ? "default" : "secondary"}
            onClick={() => setView("grid")}
          >
            Grid
          </Button>
          <Button
            variant={view === "list" ? "default" : "secondary"}
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button asChild>
            <Link to="/map">Map view</Link>
          </Button>
        </div>
      </section>

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
                <PropertyCard property={p} />
              ) : (
                <>
                  <img
                    src={`http://localhost:5000/${p.images[0]}`}
                    alt={`${p.title}`}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                      console.error(
                        `Failed to load image for ${p.title}: ${target.src}`
                      );
                    }}
                  />
                  <div className="sm:col-span-2 flex flex-col justify-between">
                    <PropertyCard property={p} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
