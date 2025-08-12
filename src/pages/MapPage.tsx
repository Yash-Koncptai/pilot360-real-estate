import Seo from "@/components/Seo";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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

    // Ahmedabad famous places
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

    // Add markers with popups
    const bounds = new mapboxgl.LngLatBounds();
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
  }, []);

  return (
    <>
      <Seo
        title="Famous Places in Ahmedabad | Interactive Map"
        description="Explore 5 famous landmarks in Ahmedabad on an interactive map. Click markers to learn about Sabarmati Ashram, Kankaria Lake, and more."
        canonicalPath="/map"
      />
      <h1 className="sr-only">Famous Places in Ahmedabad - Interactive Map</h1>

      <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow" />

      <p className="mt-3 text-sm text-muted-foreground">
        Explore 5 famous landmarks in Ahmedabad. Click on any marker to learn more about each location.
      </p>
    </>
  );
}
