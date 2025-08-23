import Seo from "@/components/Seo";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { properties, priceHeatmapData } from '@/data/properties';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, TrendingUp, Users, Shield } from "lucide-react";

// Force rebuild to clear any cached references

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'properties' | 'landmarks'>('properties');

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoieWFzaDA1MDUiLCJhIjoiY21lOGpuMXkxMGgwcDJrc2hjMHlsYzE3eiJ9.Ls9B6ZRxBFqnWpoG4dAJPA';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [72.5714, 23.03],
      zoom: 11.2,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    const bounds = new mapboxgl.LngLatBounds();
    
    if (viewMode === 'properties') {
      // Add property markers
      properties.forEach((property) => {
        const formatPrice = (value: number, forType: 'buy' | 'rent') => {
          const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
          return forType === 'rent' ? `${inr}/mo` : inr;
        };

        const popupHtml = `
          <div style="max-width:300px;" class="p-3">
            <div class="flex items-start justify-between mb-2">
              <h3 style="font-weight:700;color:hsl(var(--foreground));margin:0;">${property.title}</h3>
              ${property.aiInsights?.bestMatch ? '<span style="background:linear-gradient(45deg, #fbbf24, #f97316);color:white;font-size:10px;padding:2px 6px;border-radius:8px;">⭐ AI Best Match</span>' : ''}
            </div>
            <div style="color:hsl(var(--primary));font-weight:600;font-size:16px;margin-bottom:8px;">${formatPrice(property.price, property.for)}</div>
            <div style="color:hsl(var(--muted-foreground));font-size:14px;margin-bottom:8px;">${property.location}</div>
            <div style="display:flex;gap:6px;margin-bottom:12px;">
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${property.type}</span>
              ${property.bedrooms > 0 ? `<span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${property.bedrooms} Bed</span>` : ''}
              <span style="background:hsl(var(--secondary));color:hsl(var(--foreground));font-size:11px;padding:2px 8px;border-radius:12px;">${property.bathrooms} Bath</span>
            </div>
            ${property.aiInsights ? `
              <div style="border-top:1px solid hsl(var(--border));padding-top:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-size:12px;color:hsl(var(--muted-foreground));">Investment Rating</span>
                  <span style="font-size:12px;color:hsl(var(--foreground));font-weight:600;">⭐ ${property.aiInsights.investmentRating}/5</span>
                </div>
                ${property.aiInsights.neighborhood.commuteTime ? `<div style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:4px;">🕒 ${property.aiInsights.neighborhood.commuteTime}</div>` : ''}
                <div style="font-size:11px;color:hsl(var(--muted-foreground));line-height:1.4;">${property.aiInsights.priceAnalysis}</div>
                <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
                  <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">🏫 ${property.aiInsights.neighborhood.schools} Schools</span>
                  <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">🏥 ${property.aiInsights.neighborhood.hospitals} Hospitals</span>
                  <span style="font-size:10px;background:hsl(var(--secondary));color:hsl(var(--foreground));padding:1px 4px;border-radius:4px;">🛡️ ${property.aiInsights.neighborhood.crimeRate} Crime</span>
                </div>
              </div>
            ` : ''}
            <button onclick="window.location.href='/property/${property.id}'" style="width:100%;margin-top:12px;background:hsl(var(--primary));color:hsl(var(--primary-foreground));border:none;padding:8px;border-radius:6px;font-size:12px;cursor:pointer;">View Details</button>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 15, maxWidth: '320px' }).setHTML(popupHtml);
        
        // Custom marker color based on property type and AI insights
        let markerColor = '#3B82F6'; // Default blue
        if (property.aiInsights?.bestMatch) markerColor = '#F59E0B'; // Gold for best match
        else if (property.for === 'rent') markerColor = '#10B981'; // Green for rent
        else if (property.type === 'Villa') markerColor = '#8B5CF6'; // Purple for villa

        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([property.lng, property.lat])
          .setPopup(popup)
          .addTo(map);

        bounds.extend([property.lng, property.lat]);
      });

      // Add heatmap if enabled
      if (showHeatmap) {
        map.on('load', () => {
          priceHeatmapData.forEach((zone, index) => {
            map.addSource(`heatmap-${index}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [zone.zone[1], zone.zone[0]]
                },
                properties: {
                  avgPrice: zone.avgPrice
                }
              }
            });

            map.addLayer({
              id: `heatmap-${index}`,
              type: 'circle',
              source: `heatmap-${index}`,
              paint: {
                'circle-radius': zone.radius / 50,
                'circle-color': zone.avgPrice > 5500 ? '#EF4444' : zone.avgPrice > 4000 ? '#F59E0B' : '#10B981',
                'circle-opacity': 0.3,
                'circle-stroke-color': zone.avgPrice > 5500 ? '#DC2626' : zone.avgPrice > 4000 ? '#D97706' : '#059669',
                'circle-stroke-width': 2
              }
            });
          });
        });
      }
    } else {
      // Ahmedabad famous places (landmarks)
      const places = [
        {
          name: 'Sabarmati Ashram',
          desc: "Historic residence of Mahatma Gandhi and a major site of India's independence movement.",
          coords: [72.5802, 23.0608] as [number, number]
        },
        {
          name: 'Kankaria Lake',
          desc: 'A large, scenic lake with gardens, a zoo, toy train, and entertainment for families.',
          coords: [72.6020, 23.0063] as [number, number]
        },
        {
          name: 'Sidi Saiyyed Mosque',
          desc: "Famous for its intricate stone lattice work, especially the 'Tree of Life' window.",
          coords: [72.5714, 23.0307] as [number, number]
        },
        {
          name: 'Law Garden',
          desc: 'A lively night market for handicrafts and street food, surrounded by greenery.',
          coords: [72.5710, 23.0220] as [number, number]
        },
        {
          name: 'Science City',
          desc: 'An interactive science park with exhibits, an IMAX theatre, and a planetarium.',
          coords: [72.4935, 23.0796] as [number, number]
        }
      ];

      places.forEach((place) => {
        const popupHtml = `
          <div style="max-width:260px;">
            <div style="font-weight:700;margin-bottom:6px;color:hsl(var(--foreground));">${place.name}</div>
            <div style="font-size:14px;line-height:1.5;color:hsl(var(--muted-foreground));">${place.desc}</div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(popupHtml);
        new mapboxgl.Marker({ color: '#1E90FF' })
          .setLngLat(place.coords)
          .setPopup(popup)
          .addTo(map);

        bounds.extend(place.coords);
      });
    }

    // Fit map to show all markers
    map.on('load', () => {
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    }
  }, [viewMode, showHeatmap]);

  return (
    <>
      <Seo
        title="AI-Powered Real Estate Map | Ahmedabad Properties"
        description="Discover properties in Ahmedabad with AI insights. Interactive map showing prices, neighborhoods, and personalized property recommendations."
        canonicalPath="/map"
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI-Powered Property Map</h1>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'properties' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('properties')}
            >
              Properties
            </Button>
            <Button 
              variant={viewMode === 'landmarks' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('landmarks')}
            >
              Landmarks
            </Button>
            {viewMode === 'properties' && (
              <Button 
                variant={showHeatmap ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                Price Heatmap
              </Button>
            )}
          </div>
        </div>

        {/* Map Controls Info */}
        <div className="flex flex-wrap gap-2 text-sm">
          {viewMode === 'properties' ? (
            <>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                AI Best Match
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                For Rent
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                For Sale
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
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

        <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow border" />

        {viewMode === 'properties' ? (
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium">AI Price Analysis</span>
              </div>
              <p className="text-muted-foreground">Properties shown with real-time market analysis and investment potential ratings.</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Neighborhood Insights</span>
              </div>
              <p className="text-muted-foreground">Schools, hospitals, crime rates, and commute times for each property location.</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Personalized Matches</span>
              </div>
              <p className="text-muted-foreground">AI identifies best properties based on your budget, preferences, and requirements.</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Explore 5 famous landmarks in Ahmedabad. Click on any marker to learn more about each location.
          </p>
        )}
      </div>
    </>
  );
}
