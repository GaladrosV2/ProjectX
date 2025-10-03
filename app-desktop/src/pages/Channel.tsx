import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "/src/store/useChat";

export default function Channel() {
  const { channelId } = useParams<{ channelId: string }>();
  const setCurrentChannel = useChat((s) => s.setCurrentChannel); // store action
  const fetchMessages = useChat((s) => s.fetchMessages); // store action
  const messages = useChat((s) =>
    channelId ? s.messagesByChannel?.[channelId] ?? [] : []
  );

  useEffect(() => {
    if (!channelId) return;
    setCurrentChannel(channelId); // ✅ set state here (not in render)
    fetchMessages(channelId); // ✅ fire once per channel change
  }, [channelId, setCurrentChannel, fetchMessages]);

  // …render messages…
}
