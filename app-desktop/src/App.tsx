// app-desktop/src/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { createWS } from "./lib/ws";
import type { ChatMessage } from "./types";

export default function App() {
  const ws = useMemo(() => createWS(), []);
  const [author, setAuthor] = useState("You");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return ws.onEvent((ev) => {
      if (ev.type === "history") {
        setMessages(ev.items); // load from DB
      } else if (ev.type === "message") {
        setMessages((prev) => [...prev, ev]); // append new
      }
    });
  }, [ws]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    ws.send({ type: "message", author, text: t, ts: Date.now() });
    setText("");
  };

  return (
    <div className="h-dvh grid grid-rows-[auto,1fr,auto] gap-2 p-4">
      <header className="text-lg font-semibold">ProjectX — Chat</header>

      <div
        ref={listRef}
        className="rounded-2xl bg-zinc-800/60 border border-zinc-700/50 p-3 overflow-y-auto space-y-2"
      >
        {messages.length === 0 ? (
          <div className="text-zinc-400 text-sm">No messages yet.</div>
        ) : (
          messages.map((m, i) => (
            <div key={`${m.ts}-${i}`} className="text-sm">
              <span className="text-zinc-300">{m.author}</span>
              <span className="mx-2 text-zinc-500">›</span>
              <span className="text-zinc-100 break-words">{m.text}</span>
            </div>
          ))
        )}
      </div>

      <form
        className="grid grid-cols-[160px,1fr,auto] gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 outline-none"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Name"
        />
        <input
          className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="rounded-xl bg-zinc-200 text-zinc-900 font-medium px-4 py-2 hover:opacity-90"
        >
          Send
        </button>
      </form>
    </div>
  );
}
