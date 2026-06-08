import { MOROCCAN_CITIES, haversineKm, type CityCoord } from "./cities";

export interface SavedLocation {
  lat: number;
  lng: number;
  city: string;
  updatedAt: string;
}

const KEY = "Kreli_location";

export function saveUserLocation(lat: number, lng: number, city: string): void {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ lat, lng, city, updatedAt: new Date().toISOString() })
    );
  } catch {
    // localStorage might be blocked (private browsing, storage quota)
  }
}

export function getUserLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
}

export function clearUserLocation(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

function nearestCity(lat: number, lng: number): CityCoord {
  const pt = { name: "", lat, lng };
  return MOROCCAN_CITIES.reduce<CityCoord>((best, c) => {
    return haversineKm(pt, c) < haversineKm(pt, best) ? c : best;
  }, MOROCCAN_CITIES[0]);
}

/**
 * Requests browser geolocation, finds the nearest Moroccan city,
 * and persists it to localStorage. Fire-and-forget — never throws.
 */
export function requestAndSaveLocation(): void {
  if (typeof navigator === "undefined" || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const city = nearestCity(lat, lng);
      saveUserLocation(lat, lng, city.name);
    },
    () => {
      // Permission denied or unavailable — silently ignore
    },
    { timeout: 10_000, enableHighAccuracy: false, maximumAge: 300_000 }
  );
}
