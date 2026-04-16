import { NavLink, Outlet } from "react-router-dom";
import { hasApiKey } from "./lib/tmdb";
import ApiKeyMissing from "./components/ApiKeyMissing";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-brand/20 text-brand-light"
            : "text-slate-400 hover:text-slate-200"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  if (!hasApiKey()) return <ApiKeyMissing />;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-surface-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-slate-100">
            <span>🎬</span>
            <span>MovieDB</span>
          </NavLink>
          <div className="flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/search">Search</NavItem>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
