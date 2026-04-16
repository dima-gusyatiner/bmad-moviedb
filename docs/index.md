# bmad-moviedb — Project Documentation Index

**Generated:** 2026-04-16 | **Scan Level:** Exhaustive | **Scan Mode:** Initial

## Project Overview

- **Type:** Monolith (single cohesive codebase)
- **Primary Language:** TypeScript
- **Architecture:** Component-based SPA with page-level routing
- **Framework:** React 19 + Vite 6.3 + Tailwind CSS 4

## Quick Reference

- **Tech Stack:** React 19, TypeScript 5.7, Vite 6.3, Tailwind CSS 4, React Router DOM 7
- **Entry Point:** `src/main.tsx` → `index.html`
- **Architecture Pattern:** Client-side SPA consuming TMDB REST API
- **Data Source:** TMDB API v3 (external, no backend)
- **Caching:** localStorage with 1-hour TTL
- **Hosting:** Vercel

## Generated Documentation

- [Project Overview](./project-overview.md) — Executive summary, tech stack, design decisions
- [Architecture](./architecture.md) — Architecture patterns, data flow, routing, styling, error handling
- [Source Tree Analysis](./source-tree-analysis.md) — Full annotated directory structure
- [Component Inventory](./component-inventory.md) — All React components with props, behavior, dependencies
- [API Contracts](./api-contracts.md) — TMDB API endpoints, caching, image URLs, error handling
- [Development Guide](./development-guide.md) — Setup, scripts, deployment, adding pages/API calls

## Existing Project Artifacts

- [Feature Spec](../_bmad-output/implementation-artifacts/spec-tmdb-movie-browser.md) — Original implementation spec (completed)
- [Deferred Work](../_bmad-output/implementation-artifacts/deferred-work.md) — Known issues from code review

## Getting Started

```bash
npm install
cp .env.example .env    # Add your TMDB API key
npm run dev             # http://localhost:5173
```

Requires a free TMDB API key from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
