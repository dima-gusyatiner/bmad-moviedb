# Architecture: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Executive Summary

A client-side React SPA that consumes the TMDB REST API. No backend, no SSR, no database. The architecture is a standard component-based SPA with three layers: pages (route-level containers), components (reusable UI), and lib (data fetching + caching).

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Language | TypeScript | ~5.7 | Type safety with strict mode |
| UI Framework | React | 19.x | Component rendering, hooks-based state |
| Build Tool | Vite | 6.3.x | Dev server, HMR, production bundling |
| Styling | Tailwind CSS | 4.1.x | Utility-first CSS, custom theme via `@theme` |
| Routing | React Router DOM | 7.5.x | `createBrowserRouter` with nested routes |
| Hosting | Vercel | N/A | Static SPA deployment |

## Architecture Pattern

**Component-Based SPA with Layered Structure**

```
┌─────────────────────────────────────┐
│           Browser (Client)          │
├─────────────────────────────────────┤
│  React Router (createBrowserRouter) │
│  Routes: /, /search, /movie/:id    │
├─────────────────────────────────────┤
│         Pages Layer                 │
│  HomePage | SearchPage | MovieDetail│
├─────────────────────────────────────┤
│       Components Layer              │
│  MovieCard | MovieGrid | ErrorBanner│
│  LoadingSkeleton | ApiKeyMissing    │
├─────────────────────────────────────┤
│          Lib Layer                  │
│  tmdb.ts (API client)              │
│  cache.ts (localStorage TTL cache) │
├─────────────────────────────────────┤
│      TMDB API v3 (External)        │
└─────────────────────────────────────┘
```

## Routing Architecture

All routing is client-side using React Router's `createBrowserRouter`:

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | `HomePage` | Popular/trending movie grid with tab switcher |
| `/search` | `SearchPage` | Debounced search input with results grid |
| `/movie/:id` | `MovieDetailPage` | Full movie detail with backdrop, cast, metadata |
| `*` | `ErrorPage` | 404 catch-all |

Root layout (`App.tsx`) provides a sticky navbar and `<Outlet />` for child routes. An `errorElement` on the root route catches render-time exceptions.

## Data Architecture

### External API Integration

All data comes from TMDB API v3 (`https://api.themoviedb.org/3`). Authentication is via API key passed as a query parameter.

### Data Models (TypeScript Interfaces)

```typescript
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

interface MovieDetail extends Movie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
  credits?: { cast: CastMember[] };
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
```

### Caching Strategy

- **Storage:** `localStorage`
- **TTL:** 1 hour (configurable via `DEFAULT_TTL_MS`)
- **Key format:** `tmdb:{endpoint}:{params_json}`
- **Stale fallback:** When a fresh fetch fails, `cacheGetStale()` returns expired cached data
- **Eviction:** On `localStorage` quota exceeded, all `tmdb:*` keys are evicted and the write is retried once

### Data Flow

```
Page Component
  → useState/useEffect
    → tmdb.ts API function
      → cacheGet (check localStorage)
        → HIT: return cached data
        → MISS: fetch from TMDB API
          → SUCCESS: cacheSet + return data
          → FAILURE: cacheGetStale fallback or throw error
```

## State Management

No external state library. All state is component-local:

- **`useState`** for UI state (movies list, loading, error, search query)
- **`useRef`** for request ID tracking (race condition prevention)
- **`useEffect`** for data fetching on mount/dependency change
- **`useCallback`** for stable function references in load callbacks
- **Custom debounce** via `setTimeout`/`clearTimeout` in SearchPage (300ms delay)

## Styling Architecture

Tailwind CSS 4 with custom theme tokens defined in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand` | `#6366f1` (indigo) | Primary action color |
| `--color-brand-light` | `#818cf8` | Hover states, links |
| `--color-surface` | `#0f172a` (slate-900) | Page background |
| `--color-surface-raised` | `#1e293b` (slate-800) | Card backgrounds |
| `--color-surface-overlay` | `#334155` (slate-700) | Borders, overlays |
| `--color-rating` | `#f59e0b` (amber) | Star ratings |

Dark theme only. Background set on `<body>` in `index.html`.

## Error Handling

| Scenario | Handling |
|----------|---------|
| Missing API key | `ApiKeyMissing` component with setup instructions |
| API fetch failure | `ErrorBanner` with retry button; stale cache fallback |
| Invalid JSON response | Caught, stale cache fallback or error thrown |
| Invalid movie ID param | Validated before API call, shows error message |
| Route not found | `ErrorPage` with 404 message and home link |
| Render-time exception | `errorElement` on root route catches and displays error |
| Race conditions | `useRef` request ID prevents stale responses from updating state |

## Build & Deployment

- **Build command:** `tsc -b && vite build`
- **Output:** `dist/` directory (static files)
- **Hosting:** Vercel (`.vercel/` directory present)
- **Environment:** `VITE_TMDB_API_KEY` required at build time (baked into client bundle)

## Testing Strategy

No test files or test framework detected. No test scripts in `package.json`.

## Known Limitations & Deferred Work

From `_bmad-output/implementation-artifacts/deferred-work.md`:

1. No `document.title` updates on navigation
2. `vote_average` of 0 is indistinguishable from unrated
3. SPA routing requires server-side fallback config for production (Vercel handles this)
4. No stale-while-revalidate pattern (shows skeleton on cache expiry instead of silent refresh)
