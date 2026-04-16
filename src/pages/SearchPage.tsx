import { useState, useEffect, useRef } from "react";
import { searchMovies, type Movie } from "../lib/tmdb";
import MovieGrid from "../components/MovieGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorBanner from "../components/ErrorBanner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSearched(true);

    searchMovies(debouncedQuery)
      .then((data) => {
        if (!cancelled) setMovies(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-raised border border-surface-overlay text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-lg"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={() => setDebouncedQuery(query)} />}

      {loading && <LoadingSkeleton />}

      {!loading && !error && searched && movies.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No movies found for &ldquo;{debouncedQuery}&rdquo;</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}

      {!searched && (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">🎬</div>
          <p>Start typing to search movies</p>
        </div>
      )}
    </div>
  );
}
