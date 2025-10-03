// src/pages/Auth.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn); // must be a function in your store
  const loading = useAuth((s) => s.loading);

  useEffect(() => {
    if (user) navigate("/servers/1/channels/general", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen grid place-items-center">
      <button
        onClick={() => signIn()}
        disabled={loading}
        className="px-4 py-2 rounded bg-zinc-800"
      >
        {loading ? "Signing in..." : "Continue (dev)"}
      </button>
    </div>
  );
}
