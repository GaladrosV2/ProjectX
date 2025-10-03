// src/components/ChannelHeader.tsx  (safe version)
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "/src/store/useAuth";
import { useChat } from "/src/store/useChat";

export default function ChannelHeader() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const user = useAuth((s) => s.user);

  const channel = useChat((s) =>
    channelId ? s.channelsById?.[channelId] : undefined
  );
  const server = useChat((s) =>
    channel?.server_id
      ? s.serversById?.[channel.server_id]
      : s.serversById?.[serverId ?? ""]
  );
  const members = useChat((s) =>
    channelId ? s.membersByChannel?.[channelId] ?? [] : []
  );
  const typing = useChat((s) =>
    channelId ? s.typingByChannel?.[channelId] ?? [] : []
  );
  const unread = useChat((s) =>
    channelId ? s.unreadByChannel?.[channelId] ?? 0 : 0
  );

  const sub = useMemo(() => {
    const m = members.length,
      t = typing.length,
      u = unread;
    const parts = [`${m} member${m === 1 ? "" : "s"}`];
    if (t) parts.push(`${t} typing…`);
    if (u) parts.push(`${u} unread`);
    return parts.join(" • ");
  }, [members, typing, unread]);

  if (!channel) {
    return (
      <header className="px-4 py-2 border-b border-zinc-800 flex justify-between">
        <div>
          <div className="text-sm font-semibold">#{channelId ?? "loading"}</div>
          <div className="text-xs opacity-60">loading channel…</div>
        </div>
        <div className="text-xs opacity-70">
          {user?.display_name ?? "Guest"}
        </div>
      </header>
    );
  }

  return (
    <header className="px-4 py-2 border-b border-zinc-800 flex justify-between">
      <div>
        <div className="text-sm font-semibold">#{channel.name}</div>
        <div className="text-xs opacity-60">{sub}</div>
      </div>
      <div className="text-xs opacity-70">{user?.display_name ?? "Guest"}</div>
    </header>
  );
}
