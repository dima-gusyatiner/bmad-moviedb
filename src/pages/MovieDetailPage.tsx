import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetail, img, backdropUrl, type MovieDetail } from "../lib/tmdb";
import ErrorBanner from "../components/ErrorBanner";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef(0);

  const load = useCallback(() => {
    if (!id) return;
    const numId = Number(id);
    if (!Number.isFinite(numId) || numId <= 0 || !Number.isInteger(numId)) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }
    const requestId = ++activeRequest.current;
    setLoading(true);
    setError(null);
    getMovieDetail(numId)
      .then((data) => { if (requestId === activeRequest.current) setMovie(data); })
      .catch((e) => { if (requestId === activeRequest.current) setError(e instanceof Error ? e.message : "Failed to load movie"); })
      .finally(() => { if (requestId === activeRequest.current) setLoading(false); });
  }, [id]);

  useEffect(load, [load]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-72 sm:h-96 bg-surface-raised rounded-xl" />
        <div className="h-8 bg-surface-raised rounded w-1/2" />
        <div className="h-4 bg-surface-raised rounded w-3/4" />
        <div className="h-32 bg-surface-raised rounded" />
      </div>
    );
  }

  if (error) return <ErrorBanner message={error} onRetry={load} />;

  if (!movie) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-xl text-slate-300">Movie not found</h2>
        <Link to="/" className="text-brand-light hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const year = movie.release_date?.split("-")[0] ?? "";
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const backdrop = backdropUrl(movie.backdrop_path);
  const cast = movie.credits?.cast.slice(0, 12) ?? [];

  return (
    <div>
      {backdrop && (
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8">
          <img src={backdrop} alt="" className="w-full h-72 sm:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>
      )}

      <div className={backdrop ? "-mt-32 relative z-10" : ""}>
        <div className="flex flex-col sm:flex-row gap-6">
          {movie.poster_path && (
            <img
              src={img(movie.poster_path, "w342")!}
              alt={movie.title}
              className="w-48 rounded-xl shadow-2xl shrink-0 hidden sm:block"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
              {movie.title}
              {year && <span className="text-slate-500 font-normal ml-3 text-2xl">({year})</span>}
            </h1>

            {movie.tagline && (
              <p className="text-slate-400 italic mt-2">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-rating font-semibold text-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
              {runtime && <span className="text-slate-400">|&ensp;{runtime}</span>}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2.5 py-0.5 rounded-full bg-surface-overlay text-slate-300 text-xs"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Overview</h2>
          <p className="text-slate-300 leading-relaxed">{movie.overview || "No overview available."}</p>
        </section>

        {cast.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Cast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {cast.map((person) => (
                <div key={person.id} className="text-center">
                  {person.profile_path ? (
                    <img
                      src={img(person.profile_path, "w185")!}
                      alt={person.name}
                      loading="lazy"
                      className="w-full aspect-[2/3] object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] rounded-lg bg-surface-overlay flex items-center justify-center text-2xl text-slate-600">
                      👤
                    </div>
                  )}
                  <p className="text-xs font-medium text-slate-200 mt-1.5 truncate">{person.name}</p>
                  <p className="text-xs text-slate-500 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
