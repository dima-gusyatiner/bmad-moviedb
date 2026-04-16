import { Link } from "react-router-dom";
import { img, type Movie } from "../lib/tmdb";

const FALLBACK_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' fill='%231e293b'%3E%3Crect width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='48'%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

export default function MovieCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] ?? "";
  const rating = movie.vote_average.toFixed(1);
  const poster = img(movie.poster_path, "w342") ?? FALLBACK_POSTER;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block rounded-xl overflow-hidden bg-surface-raised hover:ring-2 hover:ring-brand transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-slate-100 group-hover:text-brand-light transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>{year}</span>
          <span className="flex items-center gap-1 text-rating font-medium">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
