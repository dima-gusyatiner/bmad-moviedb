# Project Overview: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Executive Summary

bmad-moviedb is a frontend-only movie browsing single-page application powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API. Users can browse popular and trending movies, search by title with debounced input, and view detailed movie information including cast, ratings, genres, and backdrops.

The app is built with React 19, TypeScript, Vite, and Tailwind CSS 4, using client-side routing via React Router DOM 7. All data is fetched directly from TMDB's public API v3 with a localStorage-based caching layer (1-hour TTL). There is no backend, database, or server-side rendering.

## Tech Stack Summary

| Category | Technology | Version |
|----------|-----------|---------|
| Language | TypeScript | ~5.7 |
| UI Framework | React | ^19.0.0 |
| Build Tool | Vite | ^6.3.0 |
| Styling | Tailwind CSS | ^4.1.0 |
| Routing | React Router DOM | ^7.5.0 |
| External API | TMDB API v3 | N/A |
| Hosting | Vercel | N/A |

## Architecture Classification

- **Repository Type:** Monolith (single cohesive codebase)
- **Project Type:** Web SPA
- **Architecture Pattern:** Component-based SPA with page-level routing
- **State Management:** Component-local (React hooks) + localStorage cache
- **Data Source:** External REST API (TMDB)

## Key Design Decisions

1. **No backend** -- All TMDB API calls happen directly from the browser. The API key is exposed client-side via `VITE_TMDB_API_KEY`.
2. **localStorage caching** -- API responses are cached with a 1-hour TTL to reduce repeat API calls and improve perceived performance. Stale data is used as fallback when fresh fetches fail.
3. **Dark theme** -- Custom Tailwind CSS theme tokens define a slate/indigo dark palette.
4. **Race condition handling** -- Request IDs via `useRef` prevent stale responses from overwriting fresh state on tab switches and navigation.
5. **Graceful degradation** -- Missing API key shows setup instructions; network errors show retry banners; missing images use SVG fallbacks.

## Links to Detailed Documentation

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [API Contracts](./api-contracts.md)
- [Development Guide](./development-guide.md)
