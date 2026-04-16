# API Contracts: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Overview

All data is fetched client-side from the TMDB REST API v3. There is no backend API. Authentication uses a v3 API key passed as a query parameter.

**Base URL:** `https://api.themoviedb.org/3`
**Image Base URL:** `https://image.tmdb.org/t/p`

## Authentication

- **Method:** API key as query parameter (`api_key=...`)
- **Key source:** `VITE_TMDB_API_KEY` environment variable (baked into client bundle at build time)
- **Validation:** `hasApiKey()` checks key exists and is not the placeholder `"your_api_key_here"`

## Endpoints Used

### GET /movie/popular

Fetches currently popular movies.

- **Called by:** `fetchPopular()` in `src/lib/tmdb.ts:84`
- **Used in:** `HomePage` (Popular tab)
- **Parameters:** None (besides `api_key`)
- **Response type:** `MovieListResponse`

```typescript
{ results: Movie[], total_pages: number, total_results: number }
```

### GET /trending/movie/week

Fetches trending movies for the current week.

- **Called by:** `fetchTrending()` in `src/lib/tmdb.ts:89`
- **Used in:** `HomePage` (Trending tab)
- **Parameters:** None (besides `api_key`)
- **Response type:** `MovieListResponse`

### GET /search/movie

Searches movies by title.

- **Called by:** `searchMovies(query)` in `src/lib/tmdb.ts:94`
- **Used in:** `SearchPage`
- **Parameters:** `query` (string, URL-encoded)
- **Response type:** `MovieListResponse`
- **Guard:** Returns empty array if query is blank

### GET /movie/{movie_id}

Fetches detailed information for a single movie.

- **Called by:** `getMovieDetail(id)` in `src/lib/tmdb.ts:100`
- **Used in:** `MovieDetailPage`
- **Parameters:** `append_to_response=credits` (includes cast data)
- **Response type:** `MovieDetail`

```typescript
{
  id: number, title: string, poster_path: string | null,
  backdrop_path: string | null, overview: string, vote_average: number,
  release_date: string, runtime: number | null,
  genres: { id: number, name: string }[],
  tagline: string,
  credits?: { cast: CastMember[] }
}
```

## Image URLs

Images are constructed via helper functions in `src/lib/tmdb.ts`:

| Function | Size | Usage |
|----------|------|-------|
| `img(path, "w342")` | 342px wide | Movie posters in cards and detail page |
| `img(path, "w500")` | 500px wide (default) | General poster usage |
| `img(path, "w185")` | 185px wide | Cast member profile photos |
| `backdropUrl(path)` | 1280px wide | Movie detail hero backdrop |

Returns `null` when `path` is `null` (no image available).

## Caching Layer

All API calls pass through `tmdbFetch<T>()` which integrates with `src/lib/cache.ts`:

```
Request flow:
  1. Generate cache key: "tmdb:{endpoint}:{params_json}"
  2. Check localStorage via cacheGet()
  3. If fresh cache hit → return cached data (no network call)
  4. If cache miss/expired → fetch from TMDB API
  5. On success → cacheSet() with 1-hour TTL → return data
  6. On failure → try cacheGetStale() for expired data → return stale or throw
```

**Cache configuration:**
- **Storage:** `localStorage`
- **Default TTL:** 1 hour (`60 * 60 * 1000` ms)
- **Eviction:** On quota exceeded, all `tmdb:*` keys are removed and write retried once
- **Stale fallback:** Expired entries are returned when fresh fetch fails (API error or invalid JSON)

## Error Handling

| HTTP Status | Behavior |
|-------------|---------|
| 200 | Parse JSON, cache, return |
| Non-200 | Try stale cache; if unavailable, throw `"TMDB API error: {status}"` |
| Network error | Caught by caller; shows `ErrorBanner` with retry |
| Invalid JSON | Try stale cache; if unavailable, throw `"Invalid response from TMDB API"` |
| No API key | Throws `"TMDB API key not configured"` (prevented by `hasApiKey()` gate in `App.tsx`) |
