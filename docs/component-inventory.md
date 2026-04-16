# Component Inventory: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Overview

13 source files total. 8 React components organized into 3 categories: pages (route containers), components (reusable UI), and a root layout.

## Layout Components

### App (`src/App.tsx`)

Root layout wrapping all routes. Checks for API key presence before rendering content.

- **Props:** None (uses React Router's `<Outlet />`)
- **Behavior:**
  - If no API key: renders `<ApiKeyMissing />`
  - Otherwise: sticky navbar with Home/Search nav links + `<Outlet />`
- **Dependencies:** `NavLink`, `Outlet` from react-router-dom; `hasApiKey` from lib/tmdb

### ErrorPage (`src/main.tsx`, inline)

Route-level error boundary for 404s and render exceptions.

- **Props:** None (uses `useRouteError()`)
- **Behavior:** Shows 404 message or generic error with "Back to Home" link
- **Dependencies:** `useRouteError`, `isRouteErrorResponse`, `Link` from react-router-dom

## Page Components

### HomePage (`src/pages/HomePage.tsx`)

Displays popular or trending movies in a switchable tabbed view.

- **Props:** None
- **State:** `tab` (popular/trending), `movies`, `loading`, `error`
- **Behavior:**
  - Fetches movies on mount and tab change
  - Race condition handling via `useRef` request ID
  - Shows `<LoadingSkeleton />` during load, `<ErrorBanner />` on failure
- **Dependencies:** `fetchPopular`, `fetchTrending`, `MovieGrid`, `LoadingSkeleton`, `ErrorBanner`

### SearchPage (`src/pages/SearchPage.tsx`)

Real-time movie search with debounced input.

- **Props:** None
- **State:** `query`, `debouncedQuery`, `movies`, `loading`, `error`, `searched`
- **Behavior:**
  - Auto-focuses input on mount
  - 300ms debounce before API call
  - Cancellation flag prevents stale results
  - Four states: idle, loading, empty results, results
- **Dependencies:** `searchMovies`, `MovieGrid`, `LoadingSkeleton`, `ErrorBanner`

### MovieDetailPage (`src/pages/MovieDetailPage.tsx`)

Full movie details with hero backdrop, poster, metadata, and cast grid.

- **Props:** None (reads `:id` from URL params)
- **State:** `movie`, `loading`, `error`
- **Behavior:**
  - Validates ID param (must be positive integer)
  - Fetches movie detail with credits appended
  - Race condition handling via `useRef` request ID
  - Displays backdrop hero image, poster, title, year, rating, runtime, genres, overview, cast (top 12)
  - Loading skeleton and error states
- **Dependencies:** `getMovieDetail`, `img`, `backdropUrl`, `ErrorBanner`

## Reusable UI Components

### MovieCard (`src/components/MovieCard.tsx`)

Individual movie poster card for use in grids.

- **Props:** `{ movie: Movie }`
- **Behavior:**
  - Links to `/movie/:id`
  - Shows poster (with SVG fallback), title, year, star rating
  - Hover effects: scale, ring, opacity change
- **Image handling:** Falls back to inline SVG data URI when `poster_path` is null

### MovieGrid (`src/components/MovieGrid.tsx`)

Responsive grid layout for MovieCard components.

- **Props:** `{ movies: Movie[] }`
- **Behavior:** CSS grid, responsive columns (2/3/4/5 based on breakpoint)
- **Dependencies:** `MovieCard`

### ErrorBanner (`src/components/ErrorBanner.tsx`)

Error notification bar with optional retry action.

- **Props:** `{ message: string; onRetry?: () => void }`
- **Behavior:** Red-themed banner with error message and conditional retry button

### LoadingSkeleton (`src/components/LoadingSkeleton.tsx`)

Animated placeholder matching MovieGrid layout during data loading.

- **Props:** `{ count?: number }` (default: 10)
- **Behavior:** Renders `count` pulsing placeholder cards in the same grid layout as MovieGrid

### ApiKeyMissing (`src/components/ApiKeyMissing.tsx`)

Setup instructions displayed when no TMDB API key is configured.

- **Props:** None
- **Behavior:** Step-by-step instructions with links to TMDB signup and API settings pages

## Component Dependency Graph

```
main.tsx
  └── App (layout)
        ├── ApiKeyMissing (if no API key)
        └── Outlet
              ├── HomePage
              │     ├── MovieGrid → MovieCard[]
              │     ├── LoadingSkeleton
              │     └── ErrorBanner
              ├── SearchPage
              │     ├── MovieGrid → MovieCard[]
              │     ├── LoadingSkeleton
              │     └── ErrorBanner
              └── MovieDetailPage
                    └── ErrorBanner
```

## Design System

No formal design system or component library. All components use Tailwind CSS utility classes with custom theme tokens:

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| `brand` | `--color-brand` | `#6366f1` | Buttons, active states |
| `brand-light` | `--color-brand-light` | `#818cf8` | Links, hover states |
| `surface` | `--color-surface` | `#0f172a` | Page background |
| `surface-raised` | `--color-surface-raised` | `#1e293b` | Card backgrounds |
| `surface-overlay` | `--color-surface-overlay` | `#334155` | Borders, overlays |
| `rating` | `--color-rating` | `#f59e0b` | Star rating badge |
