const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const Datastore = require("nedb-promises");
const { nanoid } = require("nanoid");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

// --- DB (file-backed, no native deps) ---
const db = Datastore.create({
  filename: "chat.db", // creates a NeDB data file in the folder
  autoload: true,
});

// history endpoint: safest array path (handles nedb-promises variants)
app.get("/history", async (req, res) => {
  try {
    const roomId = req.query.roomId;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    if (!roomId) return res.status(400).json({ error: "roomId required" });

    // Some versions of nedb-promises do not support chainable cursors.
    // Fetch as an array, then sort/slice in JS.
    const all = await db.find({ roomId });
    all.sort((a, b) => a.ts - b.ts); // oldest -> newest
    const rows = all.slice(-limit);

    res.json(rows);
  } catch (e) {
    console.error("history error:", e);
    res.status(500).json({ error: "history failed" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`HTTP + WS server on http://localhost:${PORT}`);
});

// --- WS chat ---
const wss = new WebSocketServer({ server });
const rooms = new Map(); // Map<roomId, Set<ws>>
const members = new Map(); // Map<roomId, Map<ws, {id:string,name:string}>>

function joinRoom(ws, roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add(ws);
  ws._roomId = roomId;
  if (!members.has(roomId)) members.set(roomId, new Map());
}

function leaveRoom(ws) {
  const set = rooms.get(ws._roomId);
  if (set) {
    set.delete(ws);
    if (set.size === 0) rooms.delete(ws._roomId);
  }
  const m = members.get(ws._roomId);
  if (m) {
    m.delete(ws);
    broadcastPresence(ws._roomId);
    if (m.size === 0) members.delete(ws._roomId);
  }
}

function broadcastPresence(roomId) {
  const peers = rooms.get(roomId) || [];
  const m = members.get(roomId) || new Map();
  const list = Array.from(m.values());
  const payload = JSON.stringify({ type: "presence", members: list });
  for (const p of peers) if (p.readyState === p.OPEN) p.send(payload);
}

wss.on("connection", (ws) => {
  console.log("client connected");
  ws.on("message", async (buf) => {
    try {
      const msg = JSON.parse(buf.toString());

      if (msg.type === "join") {
        leaveRoom(ws);
        joinRoom(ws, msg.roomId);
        // track member
        const name = msg.user || "user";
        if (!members.has(msg.roomId)) members.set(msg.roomId, new Map());
        members.get(msg.roomId).set(ws, { id: ws._id || nanoid(), name });
        broadcastPresence(msg.roomId);
        ws.send(
          JSON.stringify({ type: "system", text: `Joined ${msg.roomId}` })
        );
        return;
      }

      if (msg.type === "chat") {
        const m = {
          id: nanoid(),
          roomId: msg.roomId,
          user: msg.user,
          text: msg.text,
          ts: msg.ts || Date.now(),
        };
        await db.insert(m); // persist
        const peers = rooms.get(m.roomId) || [];
        for (const p of peers)
          if (p.readyState === p.OPEN) {
            p.send(JSON.stringify({ type: "chat", ...m }));
          }
      }
    } catch (e) {
      console.error("ws message error:", e);
    }
  });

  ws.on("close", () => leaveRoom(ws));
});
