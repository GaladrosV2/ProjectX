import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { registerRoutes } from "./routes";
import { attachWs } from "./ws.js";
import { pool } from "./db.js";

const app = express();
console.log("DB URL =>", process.env.DATABASE_URL);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(cors());
app.use(express.json());

registerRoutes(app);

const server = http.createServer(app);
attachWs(server);

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
  console.log(`HTTP+WS on http://localhost:${PORT}`);
});

(async () => {
  try {
    const r = await pool.query(
      "SELECT current_user, current_database(), inet_server_addr()"
    );
    console.log("DB OK =>", r.rows[0]);
  } catch (e: any) {
    console.error("DB CONNECT FAIL:", e?.message, e?.code);
  }
})();
