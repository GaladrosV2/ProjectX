import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Server = { id: string; name: string };
type Channel = { id: string; name: string };

export default function Servers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>("1");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/servers`);
      const data = await res.json();
      setServers(data.servers);
    })();
  }, []);

  useEffect(() => {
    if (!activeServerId) return;
    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/servers/${activeServerId}/channels`
      );
      const data = await res.json();
      setChannels(data.channels);
    })();
  }, [activeServerId]);

  return (
    <div className="h-full grid grid-cols-[260px_1fr]">
      <div className="border-r border-white/10 p-3">
        <div className="mb-2 text-white/60 text-sm">Servers</div>
        {servers.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveServerId(s.id)}
            className={`w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 ${
              s.id === activeServerId ? "bg-white/5" : ""
            }`}
          >
            {s.name}
          </button>
        ))}

        <div className="mt-6 text-white/60 text-sm">Channels</div>
        {channels.map((c) => (
          <Link
            key={c.id}
            to={`/app/c/${activeServerId}/${c.id}`}
            className="block rounded-lg px-3 py-2 hover:bg-white/5"
          >
            {c.name}
          </Link>
        ))}
      </div>
      <div className="p-4 text-white/60">Pick a channel on the left.</div>
    </div>
  );
}
