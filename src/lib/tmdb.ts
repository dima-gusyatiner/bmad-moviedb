import { cacheGet, cacheSet, cacheGetStale } from "./cache";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const img = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path: string | null) => img(path, "w1280");

function apiKey(): string {
  return import.meta.env.VITE_TMDB_API_KEY ?? "";
}

export function hasApiKey(): boolean {
  const key = apiKey();
  return key.length > 0 && key !== "your_api_key_here";
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const key = apiKey();
  if (!key) throw new Error("TMDB API key not configured");

  const cacheKey = `tmdb:${endpoint}:${JSON.stringify(params)}`;
  const cached = cacheGet<T>(cacheKey);
  if (cached) return cached;

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const stale = cacheGetStale<T>(cacheKey);
    if (stale) return stale;
    throw new Error(`TMDB API error: ${res.status}`);
  }

  let data: T;
  try {
    data = await res.json();
  } catch {
    const stale = cacheGetStale<T>(cacheKey);
    if (stale) return stale;
    throw new Error("Invalid response from TMDB API");
  }
  cacheSet(cacheKey, data);
  return data;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

interface MovieListResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
  credits?: {
    cast: CastMember[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export async function fetchPopular(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieListResponse>("/movie/popular");
  return data.results;
}

export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieListResponse>("/trending/movie/week");
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<MovieListResponse>("/search/movie", { query });
  return data.results;
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${id}`, { append_to_response: "credits" });
}
