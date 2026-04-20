export type Category = {
  _id: string;
  nom: string;
  description?: string;
  image?: string;
};

export type Materiel = {
  _id: string;
  nom: string;
  description?: string;
  photos?: { url: string; ordre?: number }[];
  prixParJour: number;
  caution?: number;
  localisation?: string;
  etat?: "neuf" | "bon_etat" | "usage";
  disponible?: boolean;
  featured?: boolean;
  categorieId?: { _id: string; nom: string } | string;
  proprietaireId?: { _id: string; nom: string; photo?: string; telephone?: string } | string;
  createdAt?: string;
};

export type MaterielListResult = {
  data: Materiel[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type AuthUser = {
  _id: string;
  nom: string;
  email: string;
  role: "locataire" | "proprietaire" | "both" | "admin";
  statut: string;
  photo?: string;
  telephone?: string;
  adresse?: string;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ── Categories ────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const result = await fetchJson<{ data: Category[] }>("/categories");
  return result.data;
}

// ── Materiels ─────────────────────────────────────────────
export async function getFeaturedMateriels(limit = 4): Promise<Materiel[]> {
  const result = await fetchJson<{ data: Materiel[] }>(
    `/materiels/featured?limit=${limit}`
  );
  return result.data;
}

export type MaterielFilters = {
  q?: string;
  categorie?: string;
  ville?: string;
  prixMin?: number;
  prixMax?: number;
  disponibilite?: "disponible" | "reservation";
  page?: number;
  limit?: number;
  sort?: "recent" | "price_asc" | "price_desc";
};

export async function getMateriels(filters: MaterielFilters = {}): Promise<MaterielListResult> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categorie) params.set("categorie", filters.categorie);
  if (filters.ville) params.set("ville", filters.ville);
  if (filters.prixMin !== undefined) params.set("prixMin", String(filters.prixMin));
  if (filters.prixMax !== undefined) params.set("prixMax", String(filters.prixMax));
  if (filters.disponibilite) params.set("disponibilite", filters.disponibilite);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sort) params.set("sort", filters.sort);

  const qs = params.toString();
  return fetchJson<MaterielListResult>(`/materiels${qs ? `?${qs}` : ""}`);
}

export async function getMateriel(id: string): Promise<Materiel> {
  const result = await fetchJson<{ data: Materiel }>(`/materiels/${id}`);
  return result.data;
}

export async function getSimilarMateriels(id: string): Promise<Materiel[]> {
  const result = await fetchJson<{ data: Materiel[] }>(`/materiels/${id}/similar`);
  return result.data;
}

// ── Auth (client-side, no cache) ──────────────────────────
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur de connexion");
  return body as AuthResponse;
}

export async function registerUser(data: {
  nom: string;
  email: string;
  password: string;
  role: "locataire" | "proprietaire" | "both";
  telephone?: string;
  adresse?: string;
  photo?: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur d'inscription");
  return body as AuthResponse;
}

// ── Helpers ───────────────────────────────────────────────
export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getMaterielImage(materiel: Materiel): string | null {
  if (materiel.photos && materiel.photos.length > 0) {
    const sorted = [...materiel.photos].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
    const url = sorted[0].url;
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "http://localhost:5000"}/${url}`;
  }
  return null;
}

export function getEtatLabel(etat?: string) {
  switch (etat) {
    case "neuf": return "Neuf";
    case "bon_etat": return "Bon état";
    case "usage": return "Usagé";
    default: return "";
  }
}

// ── Locations ──────────────────────────────────────────────
export type LocationMateriel = {
  _id: string;
  nom: string;
  photos?: { url: string; ordre?: number }[];
  localisation?: string;
  prixParJour: number;
};

export type Location = {
  _id: string;
  materielId: LocationMateriel;
  locataireId: { _id: string; nom: string; email?: string };
  dateDebut: string;
  dateFinPrevue: string;
  dateRetourReelle?: string;
  statut: "en_attente" | "acceptee" | "en_cours" | "terminee" | "en_retard" | "en_litige" | "refusee" | "annulee";
  nbJours: number;
  prixParJour: number;
  montantLocation: number;
  cautionMontant: number;
  createdAt: string;
};

export type LocationListResult = {
  data: Location[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export async function createLocation(data: {
  materielId: string;
  dateDebut: string;
  dateFinPrevue: string;
}): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

export async function getMyLocations(filters?: {
  statut?: string;
  page?: number;
  limit?: number;
}): Promise<LocationListResult> {
  const params = new URLSearchParams();
  if (filters?.statut) params.set("statut", filters.statut);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const response = await fetch(`${API_BASE_URL}/locations?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body;
}

export async function getOwnerLocations(filters?: {
  statut?: string;
  page?: number;
  limit?: number;
}): Promise<LocationListResult> {
  const params = new URLSearchParams();
  if (filters?.statut) params.set("statut", filters.statut);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const response = await fetch(`${API_BASE_URL}/locations/owner?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body;
}

export async function cancelLocation(id: string): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

export async function getLocationStats(): Promise<{
  totalLocationsLocataire: number;
  totalLocationsProprio: number;
  locationsActivesLocataire: number;
  locationsActivesProprio: number;
  totalDepenses: number;
  totalRevenus: number;
}> {
  const response = await fetch(`${API_BASE_URL}/locations/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

// ── Users / Profile ────────────────────────────────────────
export async function getMyProfile(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

export async function updateMyProfile(data: {
  nom?: string;
  telephone?: string;
  adresse?: string;
  photo?: string;
}): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

export async function getLocataireStats(): Promise<{
  locations: { enAttente: number; enCours: number; terminees: number; total: number };
  totalDepenses: number;
}> {
  const response = await fetch(`${API_BASE_URL}/users/stats/locataire`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Erreur");
  return body.data;
}

// ── Helpers ───────────────────────────────────────────────
function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("kreli_token") ?? "";
}

export function getStatutLabel(statut: string) {
  const labels: Record<string, string> = {
    en_attente: "En attente",
    acceptee: "Acceptée",
    en_cours: "En cours",
    terminee: "Terminée",
    en_retard: "En retard",
    en_litige: "En litige",
    refusee: "Refusée",
    annulee: "Annulée",
  };
  return labels[statut] ?? statut;
}

export function getStatutColor(statut: string) {
  const colors: Record<string, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-green-100 text-green-800",
    en_cours: "bg-blue-100 text-blue-800",
    terminee: "bg-gray-100 text-gray-800",
    en_retard: "bg-red-100 text-red-800",
    en_litige: "bg-red-100 text-red-800",
    refusee: "bg-red-100 text-red-800",
    annulee: "bg-gray-100 text-gray-500",
  };
  return colors[statut] ?? "bg-gray-100 text-gray-800";
}
