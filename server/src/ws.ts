import { Server } from "socket.io";
import { query } from "./db.js";

type SendPayload = { channelKey: string; authorId: string; content: string };

export function attachWs(httpServer: any) {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("chat:join", (channelKey: string) => {
      socket.join(channelKey);
      socket.emit("chat:joined", { channelKey });
    });

    socket.on("chat:send", async (payload: SendPayload, ack?: Function) => {
      try {
        const [serverId, channelId] = payload.channelKey.split(":");
        const rows = await query(
          `INSERT INTO message (server_id, channel_id, author_id, content)
           VALUES ($1,$2,$3,$4)
           RETURNING id, server_id, channel_id, author_id, content, created_at`,
          [serverId, channelId, payload.authorId, payload.content]
        );
        const msg = rows[0];
        io.to(payload.channelKey).emit("chat:new", msg);
        ack?.({ ok: true, message: msg });
      } catch (e) {
        ack?.({ ok: false, error: (e as Error).message });
      }
    });
  });

  return io;
}
