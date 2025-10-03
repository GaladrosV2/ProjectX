import type { Router } from "express";
import { query } from "./db";

// export a function that takes the app router and attaches routes
export function registerRoutes(app: Router) {
  // list all servers
  app.get("/servers", async (_req, res) => {
    try {
      const servers = await query("SELECT id, name FROM server ORDER BY name");
      res.json({ servers });
    } catch (e: any) {
      console.error("GET /servers failed:", e.message);
      res.status(500).json({ error: "db_error" });
    }
  });

  // dev login: returns demo user
  app.post("/auth/dev", async (_req, res) => {
    try {
      const [user] = await query(
        "SELECT id, email, display_name FROM app_user WHERE id='u-demo'"
      );
      res.json({ user });
    } catch (e: any) {
      console.error("POST /auth/dev failed:", e.message);
      res.status(500).json({ error: "db_error" });
    }
  });

  // channels for a server
  app.get("/servers/:id/channels", async (req, res) => {
    try {
      const channels = await query(
        "SELECT id, name FROM channel WHERE server_id=$1 ORDER BY name",
        [req.params.id]
      );
      res.json({ channels });
    } catch (e: any) {
      console.error("GET /servers/:id/channels failed:", e.message);
      res.status(500).json({ error: "db_error" });
    }
  });

  // last 50 messages for a channel
  app.get("/channels/:id/messages", async (req, res) => {
    try {
      const messages = await query(
        `SELECT m.id, m.content, m.created_at,
                u.id as author_id, u.display_name as author_name
           FROM message m
           JOIN app_user u ON u.id = m.author_id
          WHERE m.channel_id=$1
          ORDER BY m.created_at DESC
          LIMIT 50`,
        [req.params.id]
      );
      res.json({ messages: messages.reverse() });
    } catch (e: any) {
      console.error("GET /channels/:id/messages failed:", e.message);
      res.status(500).json({ error: "db_error" });
    }
  });

  // post a message
  app.post("/channels/:id/messages", async (req, res) => {
    try {
      const { author_id, content, server_id } = req.body;
      const [row] = await query(
        `INSERT INTO message (server_id, channel_id, author_id, content)
         VALUES ($1,$2,$3,$4)
         RETURNING id, content, created_at`,
        [server_id, req.params.id, author_id, content]
      );
      res.status(201).json({ message: row });
    } catch (e: any) {
      console.error("POST /channels/:id/messages failed:", e.message);
      res.status(500).json({ error: "db_error" });
    }
  });
}
