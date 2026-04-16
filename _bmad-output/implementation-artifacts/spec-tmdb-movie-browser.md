---
title: 'TMDB Movie Browser'
type: 'feature'
created: '2026-04-16'
status: 'done'
baseline_commit: '9aaa34f'
context: []
---

<frozen-after-approval reason="human-owned intent -- do not modify unless human renegotiates">

## Intent

**Problem:** No app exists yet. The user wants a polished, frontend-only multi-page movie browser powered by TMDB's public API, with local caching for snappy repeat visits.

**Approach:** React 19 + Vite + React Router v7 for routing, Tailwind CSS v4 for visual design, TMDB API v3 for data. All state and caching via localStorage with TTL. API key loaded from env var.

## Boundaries & Constraints

**Always:** FE-only (no backend/BFF). All TMDB calls from the browser. Cache responses in localStorage with a 1-hour TTL. Responsive design (mobile-first). Graceful handling of missing posters/images. API key via `VITE_TMDB_API_KEY` env var.

**Ask First:** Adding any backend proxy, SSR, or third-party auth.

**Never:** No backend. No paid APIs. No server-side rendering. No database.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Popular movies load | App opens, cache empty | Fetch trending/popular from TMDB, render grid with posters, titles, ratings | Show error banner with retry button |
| Cached data | App opens, cache fresh | Render from localStorage, no network call | N/A |
| Search | User types query (debounced 300ms) | Filtered results from TMDB search endpoint | Empty state: "No movies found" |
| Movie detail | Click movie card | Navigate to detail page with backdrop, overview, cast, rating | 404-style fallback if movie not found |
| No API key | Env var missing | App shows setup instructions instead of crashing | Prominent message with link to TMDB signup |
| Stale cache | TTL expired | Re-fetch silently, update cache | Fall back to stale data if fetch fails |

</frozen-after-approval>

## Code Map

- `package.json` -- project deps: react, react-router, tailwindcss, vite
- `vite.config.ts` -- Vite config with React plugin
- `src/main.tsx` -- App entry, router setup
- `src/App.tsx` -- Root layout with nav bar
- `src/pages/HomePage.tsx` -- Trending/popular movie grid
- `src/pages/SearchPage.tsx` -- Search input + results grid
- `src/pages/MovieDetailPage.tsx` -- Full movie detail view
- `src/components/MovieCard.tsx` -- Reusable poster card (image, title, rating)
- `src/components/MovieGrid.tsx` -- Responsive grid layout for cards
- `src/components/ErrorBanner.tsx` -- Error display with retry
- `src/lib/tmdb.ts` -- TMDB API client (fetch wrappers, URL builders)
- `src/lib/cache.ts` -- localStorage cache with TTL logic
- `src/index.css` -- Tailwind imports + custom theme tokens
- `index.html` -- HTML shell
- `.env.example` -- Documents VITE_TMDB_API_KEY

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- Initialize with Vite React-TS template, add react-router-dom, tailwindcss, @tailwindcss/vite
- [x] `vite.config.ts` -- Configure Vite with React + Tailwind plugins
- [x] `index.html` -- HTML shell with viewport meta, app root div
- [x] `src/index.css` -- Tailwind v4 import, dark color palette tokens (slate/indigo theme)
- [x] `src/lib/cache.ts` -- Create get/set with JSON serialization and TTL expiry check
- [x] `src/lib/tmdb.ts` -- Create fetchPopular, searchMovies, getMovieDetail with cache integration
- [x] `src/components/MovieCard.tsx` -- Poster image with fallback, title, year, star rating badge
- [x] `src/components/MovieGrid.tsx` -- CSS grid wrapper, responsive 2/3/4/5 columns
- [x] `src/components/ErrorBanner.tsx` -- Error message with retry callback
- [x] `src/pages/HomePage.tsx` -- Fetch popular on mount, render MovieGrid, loading skeleton
- [x] `src/pages/SearchPage.tsx` -- Controlled input with 300ms debounce, search results grid, empty state
- [x] `src/pages/MovieDetailPage.tsx` -- Fetch by ID, backdrop hero, metadata, overview, cast list
- [x] `src/App.tsx` -- Root layout with sticky nav (Home, Search links), Outlet for pages
- [x] `src/main.tsx` -- createBrowserRouter with routes, render to root
- [x] `.env.example` -- Document VITE_TMDB_API_KEY with signup URL comment

**Acceptance Criteria:**
- Given no API key, when app loads, then setup instructions are displayed (not a crash)
- Given a valid API key, when app loads, then popular movies render in a responsive grid
- Given a search query, when user stops typing for 300ms, then results update without full page reload
- Given a movie card click, when navigating to detail, then the URL changes and detail page renders with backdrop
- Given a previously loaded page, when revisiting within 1 hour, then data loads from cache (no network request)
- Given a network error, when any fetch fails, then an error banner appears with a retry button

### Review Findings

- [x] [Review][Defer] Stale cache shows loading skeleton instead of silent re-fetch — spec says "Re-fetch silently, update cache" implying stale-while-revalidate pattern; deferred to future iteration
- [x] [Review][Patch] cacheGet deletes expired entries, breaking cacheGetStale fallback — stale data is removed before fetch, so fallback always returns null [src/lib/cache.ts:14]
- [x] [Review][Patch] No input validation on movie ID URL param — Number(id) on non-numeric strings yields NaN sent to API [src/pages/MovieDetailPage.tsx:16]
- [x] [Review][Patch] Race condition in MovieDetailPage — no cancellation of in-flight fetch on unmount or id change [src/pages/MovieDetailPage.tsx:12-19]
- [x] [Review][Patch] No 404/catch-all route — unknown paths render empty Outlet with no user feedback [src/main.tsx:10-20]
- [x] [Review][Patch] No errorElement on routes — render-time exceptions crash the entire app to blank page [src/main.tsx:10-20]
- [x] [Review][Patch] HomePage renders MovieGrid alongside ErrorBanner on error — grid should be hidden when error is displayed [src/pages/HomePage.tsx:55-56]
- [x] [Review][Patch] hasApiKey treats .env.example placeholder "your_api_key_here" as valid — bypasses ApiKeyMissing screen [src/lib/tmdb.ts]
- [x] [Review][Patch] localStorage cache grows unbounded — no eviction strategy, expired entries only removed on re-read [src/lib/cache.ts]
- [x] [Review][Patch] res.json() on non-JSON response body throws unhelpful SyntaxError — no try/catch around JSON parsing [src/lib/tmdb.ts:38]
- [x] [Review][Patch] Race condition in HomePage — no request cancellation when switching tabs, stale response can overwrite fresh state [src/pages/HomePage.tsx]
- [x] [Review][Defer] No document.title update on page navigation [src/pages/*] — deferred, pre-existing
- [x] [Review][Defer] movie.vote_average 0 indistinguishable from unrated [src/components/MovieCard.tsx:9] — deferred, pre-existing
- [x] [Review][Defer] SPA routing requires server-side fallback config for production deployment [vite.config.ts] — deferred, pre-existing

## Verification

**Commands:**
- `npm run dev` -- expected: Vite dev server starts, app renders at localhost
- `npm run build` -- expected: Production build succeeds with zero errors

**Manual checks:**
- Navigate all three pages, verify routing works with browser back/forward
- Search for a movie, verify debounce behavior and results
- Open DevTools Network tab, verify cache hits skip network calls
- Resize browser, verify responsive grid adapts from mobile to desktop
