# Deferred Work

## Deferred from: code review of spec-tmdb-movie-browser (2026-04-16)

- No `document.title` update on page navigation — every page shows static "MovieDB Browser" in the browser tab. Movie detail page should set title to movie name for accessibility and tab identification.
- `movie.vote_average` of 0 is indistinguishable from unrated — movies with no votes display "0.0" with a star, which looks like a zero rating rather than "unrated."
- SPA routing requires server-side fallback configuration for production — `createBrowserRouter` uses History API; direct navigation to `/movie/123` will 404 on static hosts without rewrite rules.
- Stale-while-revalidate pattern — spec says "re-fetch silently, update cache" but current implementation shows loading skeleton on expired cache. Current behavior is functional but not "silent." Requires rework of `tmdbFetch` and page components to show stale data while refreshing in background.
