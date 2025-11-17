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

    // Add property markers as circles
    map.on("load", () => {
      // Create a GeoJSON source for properties
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: filteredProperties.map((property: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [property.longitude, property.latitude],
          },
          properties: {
            id: property.id,
            title: property.title,
            price: property.price,
            location: property.location,
            type: property.type,
            size: property.size,
            aiMatchScore: property.aiMatchScore,
            growthPotential: property.aiInsights?.growthPotential || "Medium",
            expectedROI: property.aiInsights?.expectedROI || "",
            riskLevel: property.aiInsights?.riskLevel || "",
            viewsThisWeek:
              property.aiInsights?.demandIndicators.viewsThisWeek || 0,
          },
        })),
      };

      // Add source
      map.addSource("properties", {
        type: "geojson",
        data: geojson,
      });

      // Add circle layer
      map.addLayer({
        id: "property-circles",
        type: "circle",
        source: "properties",
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "match",
            ["get", "growthPotential"],
            "High",
            "#10B981", // Green
            "Medium",
            "#F59E0B", // Yellow
            "Low",
            "#EF4444", // Red
            "#3B82F6", // Default blue
          ],
          "circle-opacity": 0.8,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Popup on click
      map.on("click", "property-circles", (e) => {
        const features = e.features;
        if (!features || !features[0]) return;

        const properties = features[0].properties;
        const coordinates = (features[0].geometry as GeoJSON.Point).coordinates.slice();

        const formatPrice = (value: number) => {
          if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)}Cr`;
          }
          return `₹${(value / 100000).toFixed(0)}L`;
        };

        const popupHtml = `
          <div style="max-width:320px;" class="p-3">
            <div class="flex items-start justify-between mb-2">
              <h3 style="font-weight:700;color:hsl(var(--foreground));margin:0;">${properties.title}</h3>
              <div style="display:flex;gap:4px;flex-direction:column;align-items-end;">
                ${
                  properties.growthPotential === "High"
                    ? '<span style="background:linear-gradient(45deg, #fbbf24, #f97316);color:white;font-size:10px;padding:2px 6px;border-radius:8px;">⭐ High Growth</span>'
                    : ""
                }
                <span style="background:hsl(var(--primary));color:white;font-size:10px;padding:2px 6px;border-radius:8px;">${properties.aiMatchScore}% Match</span>
              </div>
            </div>
            <div style="color:hsl(var(--primary));font-weight:600;font-size:16px;margin-bottom:8px;">${formatPrice(properties.price)}</div>
            <div style="color:hsl(var(--muted-foreground));font-size:14px;margin-bottom:8px;">${properties.location}</div>
            <div style="display:flex;gap:6px;margin-bottom:12px;">
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${properties.type}</span>
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${properties.size}</span>
            </div>
            <div style="border-top:1px solid hsl(var(--border));padding-top:8px;">
              <div style="display:flex;justify-content:space-between;align-items-center;margin-bottom:4px;">
                <span style="font-size:12px;color:hsl(var(--muted-foreground));">Expected ROI</span>
                <span style="font-size:12px;color:hsl(var(--foreground));font-weight:600;">${properties.expectedROI}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items-center;margin-bottom:4px;">
                <span style="font-size:12px;color:hsl(var(--muted-foreground));">Growth Potential</span>
                <span style="font-size:12px;color:hsl(var(--foreground));font-weight:600;">${properties.growthPotential}</span>
              </div>
              <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
                <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">👁️ ${properties.viewsThisWeek} views</span>
                <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">🛡️ ${properties.riskLevel} Risk</span>
              </div>
            </div>
            <button onclick="window.location.href='/property/${properties.id}'" style="width:100%;margin-top:12px;background:hsl(var(--primary));color:hsl(var(--primary-foreground));border:none;padding:8px;border-radius:6px;font-size:12px;cursor:pointer;">View Details</button>
          </div>
        `;

        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(popupHtml)
          .addTo(map);
      });

      // Change cursor to pointer on hover
      map.on("mouseenter", "property-circles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "property-circles", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Extend bounds for all properties
    filteredProperties.forEach((property: any) => {
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
  }, [showHeatmap, filteredProperties, loading, error]);

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
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
        {showFilters && (
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
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant={showHeatmap ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  Price Heatmap
                </Button>
              </div>
            </div>

            {/* Results Summary */}
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
          </div>

          {/* Map Controls Info */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                High Potential
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Medium Potential
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Low Potential
              </Badge>
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