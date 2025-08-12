import Seo from "@/components/Seo";
import { properties } from "@/data/properties";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 2.5,
      center: [-20, 20],
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.scrollZoom.disable();

    map.on('style.load', () => {
      map.setFog({ 'horizon-blend': 0.2 });
    });

    // Add markers
    properties.forEach(p => {
      const html = `
        <div style="width:240px;">
          <img src="${p.images[0]}" alt="${p.title}" style="width:100%;height:120px;object-fit:cover;border-radius:8px" />
          <div style="margin-top:8px;font-weight:600;color:hsl(var(--foreground))">${p.title}</div>
          <div style="color:hsl(var(--primary))">${p.for === 'rent' ? '$' + p.price + ' / mo' : '$' + p.price}</div>
          <ul style="margin:8px 0;padding-left:18px;font-size:12px;color:hsl(var(--muted-foreground))">
            ${p.pros.slice(0,5).map(x => `<li>${x}</li>`).join('')}
          </ul>
          <a href="/property/${p.id}" style="display:inline-block;margin-top:6px;color:white;background:hsl(var(--primary));padding:8px 12px;border-radius:6px;text-decoration:none">View Details</a>
        </div>`;

      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(html);
      new mapboxgl.Marker({ color: '#1E90FF' })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    }
  }, [token]);

  return (
    <>
      <Seo
        title="Interactive Property Map | EstateHub"
        description="Explore properties on an interactive map. Click markers to view photos, price, and pros, then open full details."
        canonicalPath="/map"
      />
      <h1 className="sr-only">Interactive Map of Properties</h1>

      <div className="mb-4 bg-card p-4 rounded-lg flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Mapbox public token</label>
        <input
          type="text"
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Enter your Mapbox public token to load the map"
          value={token}
          onChange={(e)=>setToken(e.target.value)}
        />
      </div>

      <div ref={mapContainer} className="w-full h-[70vh] rounded-lg shadow" />

      <p className="mt-3 text-sm text-muted-foreground">
        Tip: Add your Mapbox public token via Supabase Edge Function secrets for production use.
      </p>
    </>
  );
}
