// app-desktop/src/lib/ws.ts
import type { ChatMessage } from "../types";

type ServerEvent = { type: "history"; items: ChatMessage[] } | ChatMessage;

export function createWS(url = "ws://localhost:4000") {
  let ws: WebSocket;
  let queue: string[] = [];
  const listeners = new Set<(ev: ServerEvent) => void>();

  const connect = () => {
    ws = new WebSocket(url);

    ws.onopen = () => {
      for (const m of queue) ws.send(m);
      queue = [];
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as ServerEvent;
        listeners.forEach((fn) => fn(msg));
      } catch {
        // ignore malformed
      }
    };

    ws.onclose = () => setTimeout(connect, 1000);
  };

  connect();

  return {
    send(msg: ChatMessage) {
      const s = JSON.stringify({ ...msg, ts: Date.now() });
      if (ws.readyState === WebSocket.OPEN) ws.send(s);
      else queue.push(s);
    },
    onEvent(fn: (ev: ServerEvent) => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
