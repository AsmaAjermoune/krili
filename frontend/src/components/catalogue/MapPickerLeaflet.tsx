"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ORANGE_ICON = L.divIcon({
  html: `<div style="
    width:28px;height:28px;
    background:linear-gradient(135deg,#ff6700,#ff8c38);
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 3px 10px rgba(255,103,0,0.55);
  "></div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

// Forces a tile/size recalc after the Popover finishes its open animation.
// Without this, Leaflet renders a gray blank tile because it measured 0×0
// during the hidden phase.
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 120);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: true, duration: 0.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

function ClickToMove({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function zoomFromRadius(km: number): number {
  if (km >= 400) return 6;
  if (km >= 200) return 7;
  if (km >= 100) return 8;
  if (km >= 50) return 9;
  if (km >= 20) return 10;
  if (km >= 10) return 11;
  return 12;
}

interface MapPickerLeafletProps {
  lat: number;
  lng: number;
  radiusKm: number;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function MapPickerLeaflet({ lat, lng, radiusKm, onPositionChange }: MapPickerLeafletProps) {
  const zoom = zoomFromRadius(radiusKm);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      />

      {/* Recalculate container size once on mount (fixes gray tiles in Popover) */}
      <MapResizer />
      {/* Recenter when coordinates change (city selected / GPS) */}
      <RecenterMap lat={lat} lng={lng} zoom={zoom} />

      {/* Click anywhere on map to move the pin */}
      <ClickToMove onMove={onPositionChange} />

      {/* Radius overlay */}
      <Circle
        center={[lat, lng]}
        radius={radiusKm * 1000}
        pathOptions={{
          color: "#ff6700",
          fillColor: "#ff6700",
          fillOpacity: 0.12,
          weight: 2,
          dashArray: "6 5",
        }}
      />

      {/* Draggable center marker */}
      <Marker
        position={[lat, lng]}
        icon={ORANGE_ICON}
        draggable
        eventHandlers={{
          dragend(e) {
            const pos = (e.target as L.Marker).getLatLng();
            onPositionChange(pos.lat, pos.lng);
          },
        }}
      />
    </MapContainer>
  );
}
