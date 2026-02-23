import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const crumbs: { label: string; path: string }[] = [
    { label: "Home", path: "/" },
    { label: "Exabis Library", path: "/" },
  ];

  if (location.pathname === "/admin") {
    crumbs.push({ label: "Administration", path: "/admin" });
  } else if (location.pathname === "/categories") {
    crumbs.push({ label: "Administration", path: "/admin" });
    crumbs.push({ label: "Categories", path: "/categories" });
  }

  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-breadcrumb mx-1">▶</span>}
          {i < crumbs.length - 1 ? (
            <Link to={crumb.path} className="text-breadcrumb hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-breadcrumb">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
