import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import "./index.css";

function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="text-6xl mb-4">{is404 ? "🔍" : "💥"}</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          {is404 ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="text-slate-400 mb-6">
          {is404 ? "The page you're looking for doesn't exist." : "An unexpected error occurred."}
        </p>
        <Link to="/" className="text-brand-light hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "movie/:id", element: <MovieDetailPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
