# Development Guide: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node.js)
- **TMDB API key** -- free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and replace "your_api_key_here" with your TMDB API key

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_TMDB_API_KEY` | Yes | TMDB API v3 key. Get one at [themoviedb.org/signup](https://www.themoviedb.org/signup) |

The `VITE_` prefix is required for Vite to expose the variable to client-side code. The key is baked into the production bundle at build time.

**Type declaration:** `vite-env.d.ts` provides TypeScript types for `import.meta.env.VITE_TMDB_API_KEY`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check with `tsc -b` then build for production with Vite |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
  main.tsx          -- App entry, router config
  App.tsx           -- Root layout (nav, API key gate)
  index.css         -- Tailwind CSS + custom theme tokens
  pages/            -- One component per route
  components/       -- Reusable UI components
  lib/              -- Data fetching (tmdb.ts) and caching (cache.ts)
```

See [Source Tree Analysis](./source-tree-analysis.md) for full annotated structure.

## TypeScript Configuration

- **Target:** ES2020
- **Module:** ESNext with bundler resolution
- **Strict mode:** Enabled (`strict: true`)
- **Additional checks:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- **JSX:** `react-jsx` (automatic runtime)
- **Scope:** `src/` and `vite-env.d.ts`

## Styling

Tailwind CSS 4 with the Vite plugin (`@tailwindcss/vite`). No `tailwind.config.js` -- configuration uses the CSS-native `@theme` directive in `src/index.css`.

Custom theme tokens are available as Tailwind utilities (e.g., `bg-surface`, `text-brand-light`, `text-rating`).

## Adding a New Page

1. Create `src/pages/NewPage.tsx`
2. Add a route in `src/main.tsx` inside the `children` array:
   ```tsx
   { path: "new-path", element: <NewPage /> },
   ```
3. Optionally add a nav link in `src/App.tsx`

## Adding a New TMDB API Call

1. Add the function in `src/lib/tmdb.ts` using `tmdbFetch<T>()`:
   ```tsx
   export async function fetchSomething(): Promise<SomeType> {
     return tmdbFetch<SomeType>("/some/endpoint", { param: "value" });
   }
   ```
2. Caching is automatic via `tmdbFetch`.

## Build & Deployment

### Production Build

```bash
npm run build
```

Output goes to `dist/`. The build runs TypeScript type checking before Vite bundling.

### Vercel Deployment

The project is configured for Vercel deployment (`.vercel/` directory present). Vercel auto-detects the Vite framework and runs `npm run build`.

Set `VITE_TMDB_API_KEY` in Vercel environment variables (Settings > Environment Variables).

## Testing

No test framework is currently configured. No test files exist. The `package.json` has no test script.

**Manual verification:**
- Navigate all three pages, verify routing with browser back/forward
- Search for a movie, verify debounce and results
- Check DevTools Network tab to verify cache hits skip network calls
- Resize browser to verify responsive grid adapts

## Known Issues

See [deferred-work.md](../_bmad-output/implementation-artifacts/deferred-work.md) for known limitations:
- No `document.title` updates on navigation
- `vote_average` 0 indistinguishable from unrated
- SPA routing needs server fallback for non-Vercel hosts
- No stale-while-revalidate pattern
