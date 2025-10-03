import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { migrate, insertMessage, loadRecent } from "./db.js";

const PORT = Number(process.env.PORT ?? 4000);

type ChatMessage = {
  type: "message";
  author: string;
  text: string;
  ts: number;
};

type ServerEvent = { type: "history"; items: ChatMessage[] } | ChatMessage;

(async () => {
  // ensure table exists
  await migrate();

  const httpServer = createServer();
  const wss = new WebSocketServer({ server: httpServer });

  type Client = WebSocket & { id?: string; isAlive?: boolean };

  wss.on("connection", async (ws: Client) => {
    ws.id = randomUUID();
    ws.isAlive = true;

    // send recent history to the new client
    try {
      const history = await loadRecent(100);
      const payload: ServerEvent = {
        type: "history",
        items: history.map((r) => ({
          type: "message",
          author: r.author,
          text: r.text,
          ts: Number(r.ts),
        })),
      };
      ws.send(JSON.stringify(payload));
    } catch (e) {
      console.error("[history] failed:", e);
    }

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (data) => {
      let msg: ChatMessage | null = null;

      try {
        const parsed = JSON.parse(data.toString());
        if (parsed?.type === "message" && typeof parsed.text === "string") {
          msg = {
            type: "message",
            author: String(parsed.author || "Anon"),
            text: String(parsed.text),
            ts: Number(parsed.ts || Date.now()),
          };
        }
      } catch {
        // ignore malformed
      }
      if (!msg) return;

      // 1) persist
      try {
        await insertMessage(msg.author, msg.text, msg.ts);
        // console.log("[db] inserted", msg.ts, msg.author, msg.text);
      } catch (e) {
        console.error("[db] insert failed:", e);
      }

      // 2) broadcast to all clients
      const out = JSON.stringify(msg satisfies ServerEvent);
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) client.send(out);
      }
    });
  });

  // heartbeat
  setInterval(() => {
    for (const ws of wss.clients) {
      const c = ws as Client;
      if (!c.isAlive) return ws.terminate();
      c.isAlive = false;
      ws.ping();
    }
  }, 30_000);

  httpServer.listen(PORT, () => {
    console.log(`WS server on ws://localhost:${PORT}`);
  });
})();
