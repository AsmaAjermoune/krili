"use client";

import { useState, useEffect, useRef } from "react";

export interface NominatimResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: number;
  lng: number;
}

export function useNominatim(query: string, enabled = true) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Maroc")}&countrycodes=ma&format=json&limit=5`;
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { "Accept-Language": "fr", "User-Agent": "Kreli/1.0" },
        });
        const data = (await res.json()) as Array<{ place_id: number; display_name: string; lat: string; lon: string }>;
        setResults(
          data.map((r) => {
            const shortName = r.display_name.split(",")[0];
            return {
              place_id: r.place_id,
              name: shortName,
              display_name: r.display_name,
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
            };
          })
        );
      } catch {
        // aborted or network error — silently ignore
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [query, enabled]);

  return { results, loading };
}
