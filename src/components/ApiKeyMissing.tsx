export default function ApiKeyMissing() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="text-6xl mb-6">🔑</div>
      <h2 className="text-2xl font-bold text-slate-100 mb-4">API Key Required</h2>
      <p className="text-slate-400 mb-6">
        This app needs a TMDB API key to fetch movie data.
      </p>
      <ol className="text-left text-slate-300 space-y-3 mb-8">
        <li className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-brand text-white text-sm flex items-center justify-center font-medium">1</span>
          <span>
            Sign up at{" "}
            <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer" className="text-brand-light hover:underline">
              themoviedb.org
            </a>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-brand text-white text-sm flex items-center justify-center font-medium">2</span>
          <span>
            Go to{" "}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-brand-light hover:underline">
              Settings &rarr; API
            </a>{" "}
            and copy your API key (v3 auth)
          </span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-brand text-white text-sm flex items-center justify-center font-medium">3</span>
          <span>
            Create a <code className="text-brand-light bg-surface-raised px-1.5 py-0.5 rounded text-sm">.env</code> file in the project root:
          </span>
        </li>
      </ol>
      <pre className="bg-surface-raised rounded-lg p-4 text-left text-sm text-slate-300 font-mono">
        VITE_TMDB_API_KEY=your_key_here
      </pre>
      <p className="text-slate-500 text-sm mt-4">Then restart the dev server.</p>
    </div>
  );
}
