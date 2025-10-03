import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../store/useAuth";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, setDisplayName, signOut } = useAuth();
  const nav = [
    { to: "/app", label: "Servers" },
    { to: "/app/go-live", label: "Go Live" },
  ];
  return (
    <div className="p-3">
      <div className="mb-4 flex items-center justify-between gap-2">
        <input
          className="bg-white/5 px-2 py-1 rounded text-sm w-full"
          placeholder="Display name"
          defaultValue={user?.displayName || ""}
          onBlur={(e) => setDisplayName(e.target.value)}
        />
        <button
          className="text-xs px-2 py-1 bg-white/10 rounded"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
      <div className="text-sm text-white/60 mb-2">Navigation</div>
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          className={clsx(
            "block px-3 py-2 rounded-lg hover:bg-white/5",
            pathname === n.to && "bg-white/10"
          )}
        >
          {n.label}
        </Link>
      ))}
    </div>
  );
}
