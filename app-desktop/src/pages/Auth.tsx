// src/pages/Auth.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/src/store/useAuth";

export default function Auth() {
  const navigate = useNavigate();

  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn);
  const loading = useAuth((s) => s.loading);

  // When sign-in completes (user set), go to your default channel
  useEffect(() => {
    if (user) {
      // pick whatever default makes sense for you:
      navigate("/servers/1/channels/general", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen grid place-items-center">
      <button
        onClick={() => signIn()}
        disabled={loading}
        className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Continue (dev)"}
      </button>
    </div>
  );
}
