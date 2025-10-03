import { useState } from "react";
import { useChat } from "../store/useChat";

export default function ChatInput({ channelId }: { channelId: string }) {
  const [text, setText] = useState("");
  const send = useChat((s) => s.send);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        send(t);
        setText("");
      }}
      className="p-3 border-t border-white/10"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Message ${channelId}`}
        className="w-full px-4 py-2 rounded-xl bg-white/5 outline-none"
      />
    </form>
  );
}
