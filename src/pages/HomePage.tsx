import { useEffect, useState, useCallback, useRef } from "react";
import { fetchPopular, fetchTrending, type Movie } from "../lib/tmdb";
import MovieGrid from "../components/MovieGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorBanner from "../components/ErrorBanner";

type Tab = "popular" | "trending";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("popular");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeRequest = useRef(0);

  const load = useCallback(async (which: Tab) => {
    const requestId = ++activeRequest.current;
    setLoading(true);
    setError(null);
    try {
      const data = which === "popular" ? await fetchPopular() : await fetchTrending();
      if (requestId !== activeRequest.current) return;
      setMovies(data);
    } catch (e) {
      if (requestId !== activeRequest.current) return;
      setError(e instanceof Error ? e.message : "Failed to load movies");
    } finally {
      if (requestId === activeRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "popular", label: "Popular" },
    { key: "trending", label: "Trending" },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-brand text-white"
                : "bg-surface-raised text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => load(tab)} />}
      {loading ? <LoadingSkeleton /> : !error && <MovieGrid movies={movies} />}
    </div>
  );
}
