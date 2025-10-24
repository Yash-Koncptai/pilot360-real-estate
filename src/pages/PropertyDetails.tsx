
import Seo from "@/components/Seo";
import { Property } from "@/data/landProperties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Droplet, Zap, Flame, AlertTriangle, ArrowLeft } from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("You are signed out. Please sign in.", {
          action: {
            label: "Sign In",
            onClick: () => navigate("/"),
          },
        });
        navigate("/");
        return false;
      }
      return true;
    };

    const fetchProperty = async () => {
      if (!checkAuth()) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          `http://localhost:5050/api/user/property?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          const mappedProperty: Property = {
            ...response.data.property,
            amenities: response.data.property.features || [],
            floorplan: response.data.property.floorplan || "/placeholder.svg",
            aiInsights: response.data.property.aiInsights || {
              matchScore: response.data.property.matchPercentage || 0,
              growthPotential:
                response.data.property.aiInsights?.growthPotential || "Medium",
              expectedROI:
                response.data.property.aiInsights?.expectedROI ||
                "10-12% annually",
              riskLevel: response.data.property.aiInsights?.riskLevel || "Low",
              demandIndicators: {
                viewsThisWeek: response.data.property.views || 0,
                nearbyDevelopments:
                  response.data.property.aiInsights?.demandIndicators
                    ?.nearbyDevelopments || [],
              },
            },
          };
          setProperty(mappedProperty);
        } else {
          throw new Error(response.data.message || "Error fetching property");
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please sign in again.");
          toast.error("Session expired. Please sign in again.", {
            action: {
              label: "Sign In",
              onClick: () => navigate("/"),
            },
          });
          navigate("/");
        } else if (err.response?.status === 404) {
          setError("Property not found");
          toast.error("Property not found");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load property"
          );
          toast.error(
            err.response?.data?.message ||
              "Failed to load property. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleSubmitInquiry = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please sign in to submit an inquiry.", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/"),
        },
      });
      return;
    }

    if (!name || !email || !date || !message) {
      toast.error("Please fill all fields.", { variant: "destructive" });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5050/api/user/inquiry?id=${id}`,
        {
          name,
          email,
          visit_date: date,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Inquiry submitted successfully!");
        setName("");
        setEmail("");
        setDate("");
        setMessage("");
      } else {
        throw new Error(response.data.message || "Failed to submit inquiry");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error("Missing required fields. Please check your input.", {
          variant: "destructive",
        });
      } else if (err.response?.status === 404) {
        toast.error("Property not found.", { variant: "destructive" });
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to submit inquiry. Please try again.",
          { variant: "destructive" }
        );
      }
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <div>Loading property details...</div>;
  }

  if (error || !property) {
    return (
      <div>
        <Seo
          title="Property Not Found | EstateHub"
          description="The property you are looking for does not exist."
          canonicalPath={`/property/${id}`}
        />
        <h1 className="text-2xl font-semibold">Property not found</h1>
        <p className="text-muted-foreground">Please return to the home page.</p>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${window.location.origin}/property/${property.id}`,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Seo
        title={`${property.title} | EstateHub`}
        description={property.description}
        canonicalPath={`/property/${property.id}`}
        structuredData={jsonLd}
      />
      <article>
        {/* <nav className="mb-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav> */}

        <header className="mb-4">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.location}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{property.type}</Badge>
            {property.aiInsights && (
              <Badge variant="secondary">
                {property.aiInsights.riskLevel} Risk
              </Badge>
            )}
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <img
            src={`http://localhost:5050/${property.images[0]}`}
            alt={`${property.title} photo 1`}
            className="w-full h-64 object-cover rounded-md md:col-span-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
              console.error(
                `Failed to load image for ${property.title}: ${target.src}`
              );
            }}
          />
          <div className="grid gap-3">
            {property.images.slice(1, 3).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5050/${img}`}
                alt={`${property.title} photo ${i + 2}`}
                className="w-full h-30 object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                  console.error(
                    `Failed to load image for ${property.title}: ${target.src}`
                  );
                }}
              />
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">
              {property.description || "No description available"}
            </p>

            <h2 className="text-xl font-semibold mt-6">Primary Purpose</h2>
            <p className="text-muted-foreground">
              {property.primary_purpose || "Not specified"}
            </p>

            <h2 className="text-xl font-semibold mt-6">Utilities</h2>
            <ul className="grid grid-cols-2 gap-2 text-muted-foreground list-disc pl-4">
              <li className="flex items-center gap-2">
                <Droplet
                  className={`w-4 h-4 ${
                    property.water_connectivity
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                Water:{" "}
                {property.water_connectivity ? "Available" : "Not Available"}
              </li>
              <li className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    property.electricity_connectivity
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                Electricity:{" "}
                {property.electricity_connectivity
                  ? "Available"
                  : "Not Available"}
              </li>
              <li className="flex items-center gap-2">
                <Flame
                  className={`w-4 h-4 ${
                    property.gas_connectivity
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                />
                Gas: {property.gas_connectivity ? "Available" : "Not Available"}
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">Investment Details</h2>
            <div className="space-y-2">
              {property.investment_gain && (
                <p className="text-muted-foreground">
                  Expected Investment Gain: {property.investment_gain}% per
                  annum
                </p>
              )}
              {property.return_of_investment && (
                <p className="text-muted-foreground">
                  Return on Investment: {property.return_of_investment}% per
                  annum
                </p>
              )}
              <p className="text-muted-foreground">
                Price: {formatPrice(property.price)}
              </p>
            </div>

            <h2 className="text-xl font-semibold mt-6">Risk Assessment</h2>
            <ul className="grid grid-cols-2 gap-2 text-muted-foreground list-disc pl-4">
              <li className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    property.market_risk ? "text-red-500" : "text-gray-400"
                  }`}
                />
                Market Risk: {property.market_risk ? "High" : "Low"}
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    property.regulatory_risk ? "text-red-500" : "text-gray-400"
                  }`}
                />
                Regulatory Risk: {property.regulatory_risk ? "High" : "Low"}
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    property.financial_risk ? "text-red-500" : "text-gray-400"
                  }`}
                />
                Financial Risk: {property.financial_risk ? "High" : "Low"}
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    property.liquidity_risk ? "text-red-500" : "text-gray-400"
                  }`}
                />
                Liquidity Risk: {property.liquidity_risk ? "High" : "Low"}
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    property.physical_risk ? "text-red-500" : "text-gray-400"
                  }`}
                />
                Physical Risk: {property.physical_risk ? "High" : "Low"}
              </li>
              {property.risk_percentage && (
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Overall Risk: {property.risk_percentage}%
                </li>
              )}
            </ul>

            <h2 className="text-xl font-semibold mt-6">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2 text-muted-foreground list-disc pl-4">
              {property.amenities.length > 0 ? (
                property.amenities.map((a, idx) => <li key={idx}>{a}</li>)
              ) : (
                <li>No amenities listed</li>
              )}
            </ul>

            {property.floorplan && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Floor Plan</h2>
                <img
                  src={property.floorplan}
                  alt={`${property.title} floor plan`}
                  className="mt-2 rounded-md border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    console.error(
                      `Failed to load floorplan for ${property.title}: ${target.src}`
                    );
                  }}
                />
              </div>
            )}
          </div>

          <aside className="bg-card p-4 rounded-lg h-fit">
            <h2 className="text-lg font-semibold">
              Contact / Schedule a Visit
            </h2>
            <div className="mt-3 space-y-3">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Preferred date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={handleSubmitInquiry} className="w-full">
                Send
              </Button>
            </div>
          </aside>
        </section>
      </article>
    </>
  );
}
