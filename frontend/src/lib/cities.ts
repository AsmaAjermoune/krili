export interface CityCoord {
  name: string;
  lat: number;
  lng: number;
}

export const MOROCCAN_CITIES: CityCoord[] = [
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "Tanger", lat: 35.7595, lng: -5.834 },
  { name: "Fès", lat: 34.0181, lng: -5.0078 },
  { name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { name: "Meknès", lat: 33.8935, lng: -5.5473 },
  { name: "Oujda", lat: 34.6814, lng: -1.9086 },
  { name: "Kenitra", lat: 34.261, lng: -6.5802 },
  { name: "Tétouan", lat: 35.5785, lng: -5.3684 },
  { name: "Safi", lat: 32.2994, lng: -9.2372 },
  { name: "El Jadida", lat: 33.2316, lng: -8.5007 },
  { name: "Béni Mellal", lat: 32.3373, lng: -6.3498 },
  { name: "Nador", lat: 35.1681, lng: -2.9335 },
  { name: "Taza", lat: 34.21, lng: -4.01 },
  { name: "Ouarzazate", lat: 30.9335, lng: -6.937 },
  { name: "Errachidia", lat: 31.9314, lng: -4.4244 },
  { name: "Laâyoune", lat: 27.1536, lng: -13.2033 },
  { name: "Dakhla", lat: 23.6848, lng: -15.957 },
  { name: "Essaouira", lat: 31.5085, lng: -9.7595 },
];

export const DEFAULT_RADIUS_KM = 50;
export const MIN_RADIUS_KM = 5;
export const MAX_RADIUS_KM = 500;

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: CityCoord, b: CityCoord): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function findCity(name: string): CityCoord | undefined {
  if (!name) return undefined;
  const target = name.trim().toLowerCase();
  return MOROCCAN_CITIES.find((c) => c.name.toLowerCase() === target);
}

export function citiesWithinRadius(centerName: string, radiusKm: number): string[] {
  const center = findCity(centerName);
  if (!center) return [];
  return MOROCCAN_CITIES.filter((c) => haversineKm(center, c) <= radiusKm).map(
    (c) => c.name
  );
}
