"use client";

import { useState, useCallback } from "react";

interface GeoState {
  loading: boolean;
  error: string | null;
  lat: number | null;
  lng: number | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ loading: false, error: null, lat: null, lng: null });

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({ ...s, error: "Géolocalisation non supportée." }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({ loading: false, error: null, lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setState({ loading: false, error: err.message, lat: null, lng: null });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  return { ...state, request };
}
