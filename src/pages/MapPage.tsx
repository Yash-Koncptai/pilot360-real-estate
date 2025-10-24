
import Seo from "@/components/Seo";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useMemo } from "react";
import { landHeatmapData } from "@/data/landProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Filter,
} from "lucide-react";
import PropertyFilters, {
  PropertyFilters as FiltersType,
} from "@/components/PropertyFilters";
import axios from "axios";

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<"properties" | "landmarks">(
    "properties"
  );
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FiltersType>({
    purpose: "buy",
    propertyTypes: [],
    budgetRange: [0, 50000000],
    location: "",
    size: "any",
    sqftRange: [0, 5000],
    commute: "",
    amenities: [],
    aiSearch: "",
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendations from backend
  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Please sign in to view map recommendations.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5050/api/user/recommendations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          setError(response.data.message || "Failed to fetch recommendations");
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("Please set your preferences first.");
        } else {
          setError("Failed to fetch recommendations. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Calculate AI match scores and filter properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((property: any) => {
      // Budget filter
      if (
        property.price < filters.budgetRange[0] ||
        property.price > filters.budgetRange[1]
      )
        return false;

      // Location filter
      if (
        filters.location &&
        !property.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      )
        return false;

      // Property type filter
      if (filters.propertyTypes.length > 0) {
        const propertyTypeMatches = filters.propertyTypes.some((type) =>
          property.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!propertyTypeMatches) return false;
      }

      // AI Search filter
      if (filters.aiSearch) {
        const searchLower = filters.aiSearch.toLowerCase();
        const searchable =
          `${property.title} ${property.location} ${property.type}`.toLowerCase();
        if (!searchable.includes(searchLower)) return false;
      }

      return true;
    });

    // Calculate AI match scores
    return filtered
      .map((property: any) => {
        let matchScore = property.aiInsights?.matchScore || 50;

        // Boost score based on filters
        if (
          filters.location &&
          property.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        )
          matchScore += 15;
        if (property.aiInsights?.growthPotential === "High") matchScore += 25;

        return {
          ...property,
          aiMatchScore: Math.min(matchScore, 99),
        };
      })
      .sort((a: any, b: any) => b.aiMatchScore - a.aiMatchScore);
  }, [filters, properties]);

  // Top 3 suggestions
  const topSuggestions = useMemo(() => {
    return filteredProperties.slice(0, 3).map((property: any) => ({
      id: property.id,
      title: property.title,
      matchScore: property.aiMatchScore,
      badge:
        property.aiInsights?.growthPotential === "High"
          ? "High Growth"
          : property.aiMatchScore > 80
          ? "Great Match"
          : "Good Match",
    }));
  }, [filteredProperties]);

  useEffect(() => {
    if (!mapContainer.current || loading || error) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoieWFzaDA1MDUiLCJhIjoiY21lOGpuMXkxMGgwcDJrc2hjMHlsYzE3eiJ9.Ls9B6ZRxBFqnWpoG4dAJPA";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [72.5714, 23.03],
      zoom: 11.2,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    const bounds = new mapboxgl.LngLatBounds();

    if (viewMode === "properties") {
      // Add property markers
      filteredProperties.forEach((property: any) => {
        const formatPrice = (value: number) => {
          if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)}Cr`;
          }
          return `₹${(value / 100000).toFixed(0)}L`;
        };

        const popupHtml = `
          <div style="max-width:320px;" class="p-3">
            <div class="flex items-start justify-between mb-2">
              <h3 style="font-weight:700;color:hsl(var(--foreground));margin:0;">${
                property.title
              }</h3>
              <div style="display:flex;gap:4px;flex-direction:column;align-items:end;">
                ${
                  property.aiInsights?.growthPotential === "High"
                    ? '<span style="background:linear-gradient(45deg, #fbbf24, #f97316);color:white;font-size:10px;padding:2px 6px;border-radius:8px;">⭐ High Growth</span>'
                    : ""
                }
                <span style="background:hsl(var(--primary));color:white;font-size:10px;padding:2px 6px;border-radius:8px;">${
                  property.aiMatchScore
                }% Match</span>
              </div>
            </div>
            <div style="color:hsl(var(--primary));font-weight:600;font-size:16px;margin-bottom:8px;">${formatPrice(
              property.price
            )}</div>
            <div style="color:hsl(var(--muted-foreground));font-size:14px;margin-bottom:8px;">${
              property.location
            }</div>
            <div style="display:flex;gap:6px;margin-bottom:12px;">
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${
                property.type
              }</span>
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${
                property.size
              }</span>
            </div>
            ${
              property.aiInsights
                ? `
              <div style="border-top:1px solid hsl(var(--border));padding-top:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-size:12px;color:hsl(var(--muted-foreground));">Expected ROI</span>
                  <span style="font-size:12px;color:hsl(var(--foreground));font-weight:600;">${property.aiInsights.expectedROI}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-size:12px;color:hsl(var(--muted-foreground));">Growth Potential</span>
                  <span style="font-size:12px;color:hsl(var(--foreground));font-weight:600;">${property.aiInsights.growthPotential}</span>
                </div>
                <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
                  <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">👁️ ${property.aiInsights.demandIndicators.viewsThisWeek} views</span>
                  <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">🛡️ ${property.aiInsights.riskLevel} Risk</span>
                </div>
              </div>
            `
                : ""
            }
            <button onclick="window.location.href='/property/${
              property.id
            }'" style="width:100%;margin-top:12px;background:hsl(var(--primary));color:hsl(var(--primary-foreground));border:none;padding:8px;border-radius:6px;font-size:12px;cursor:pointer;">View Details</button>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 15,
          maxWidth: "320px",
        }).setHTML(popupHtml);

        // Custom marker color based on property type and AI insights
        let markerColor = "#3B82F6"; // Default blue
        if (property.aiInsights?.growthPotential === "High")
          markerColor = "#F59E0B"; // Gold for high growth
        else if (property.type === "Agricultural")
          markerColor = "#10B981"; // Green for agricultural
        else if (property.type === "Industrial") markerColor = "#8B5CF6"; // Purple for industrial

        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([property.longitude, property.latitude])
          .setPopup(popup)
          .addTo(map);

        bounds.extend([property.longitude, property.latitude]);
      });

      // Add heatmap if enabled
      if (showHeatmap) {
        map.on("load", () => {
          landHeatmapData.forEach((zone, index) => {
            map.addSource(`heatmap-${index}`, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [zone.zone[1], zone.zone[0]],
                },
                properties: {
                  avgPricePerSqFt: zone.avgPricePerSqFt,
                },
              },
            });

            map.addLayer({
              id: `heatmap-${index}`,
              type: "circle",
              source: `heatmap-${index}`,
              paint: {
                "circle-radius": zone.radius / 50,
                "circle-color":
                  zone.avgPricePerSqFt > 5500
                    ? "#EF4444"
                    : zone.avgPricePerSqFt > 4000
                    ? "#F59E0B"
                    : "#10B981",
                "circle-opacity": 0.3,
                "circle-stroke-color":
                  zone.avgPricePerSqFt > 5500
                    ? "#DC2626"
                    : zone.avgPricePerSqFt > 4000
                    ? "#D97706"
                    : "#059669",
                "circle-stroke-width": 2,
              },
            });
          });
        });
      }
    } else {
      // Ahmedabad famous places (landmarks)
      const places = [
        {
          name: "Sabarmati Ashram",
          desc: "Historic residence of Mahatma Gandhi and a major site of India's independence movement.",
          coords: [72.5802, 23.0608] as [number, number],
        },
        {
          name: "Kankaria Lake",
          desc: "A large, scenic lake with gardens, a zoo, toy train, and entertainment for families.",
          coords: [72.602, 23.0063] as [number, number],
        },
        {
          name: "Sidi Saiyyed Mosque",
          desc: "Famous for its intricate stone lattice work, especially the 'Tree of Life' window.",
          coords: [72.5714, 23.0307] as [number, number],
        },
        {
          name: "Law Garden",
          desc: "A lively night market for handicrafts and street food, surrounded by greenery.",
          coords: [72.571, 23.022] as [number, number],
        },
        {
          name: "Science City",
          desc: "An interactive science park with exhibits, an IMAX theatre, and a planetarium.",
          coords: [72.4935, 23.0796] as [number, number],
        },
      ];

      places.forEach((place) => {
        const popupHtml = `
          <div style="max-width:260px;">
            <div style="font-weight:700;margin-bottom:6px;color:hsl(var(--foreground));">${place.name}</div>
            <div style="font-size:14px;line-height:1.5;color:hsl(var(--muted-foreground));">${place.desc}</div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(popupHtml);
        new mapboxgl.Marker({ color: "#1E90FF" })
          .setLngLat(place.coords)
          .setPopup(popup)
          .addTo(map);

        bounds.extend(place.coords);
      });
    }

    // Fit map to show all markers
    map.on("load", () => {
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [viewMode, showHeatmap, filteredProperties, loading, error]);

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      purpose: "buy",
      propertyTypes: [],
      budgetRange: [0, 50000000],
      location: '',
      size: 'any',
      sqftRange: [0, 5000],
      commute: '',
      amenities: [],
      aiSearch: ''
    });
  };

  if (loading) return <div>Loading map data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Seo
        title="AI-Powered Land Investment Map | Premium Land Portal"
        description="Explore curated land opportunities in Ahmedabad with AI insights. Interactive map showing land prices, growth potential, and investment recommendations."
        canonicalPath="/map"
      />

      <div className="flex h-screen bg-background">
        {/* Sidebar Filters */}
        {viewMode === "properties" && showFilters && (
          <div className="w-80 flex-shrink-0">
            <PropertyFilters
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
              topSuggestions={topSuggestions}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">
                AI-Powered Land Investment Map
              </h1>
              <div className="flex gap-2">
                {viewMode === "properties" && (
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
                <Button
                  variant={viewMode === "properties" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("properties")}
                >
                  Properties
                </Button>
                <Button
                  variant={viewMode === "landmarks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("landmarks")}
                >
                  Landmarks
                </Button>
                {viewMode === "properties" && (
                  <Button
                    variant={showHeatmap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    Price Heatmap
                  </Button>
                )}
              </div>
            </div>

            {/* Results Summary */}
            {viewMode === "properties" && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {filteredProperties.length} land opportunities found
                </span>
                {filters.aiSearch && (
                  <Badge variant="secondary" className="text-xs">
                    AI Search: "{filters.aiSearch}"
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Map Controls Info */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2 text-sm">
              {viewMode === "properties" ? (
                <>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    AI Best Match
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    For Rent
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    For Sale
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Premium Villa
                  </Badge>
                </>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Famous Landmarks
                </Badge>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        </div>
      </div>
    </>
  );
}
