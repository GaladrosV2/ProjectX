import "dotenv/config";
import { Pool } from "pg";

// Build the pool from DATABASE_URL if present; otherwise use PG* env vars.
export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST ?? "127.0.0.1",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER ?? "projectx",
        password: process.env.PGPASSWORD ?? "projectx",
        database: process.env.PGDATABASE ?? "projectx",
      }
);

// (optional) debug log — safe during setup, remove later if you want
try {
  const u = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
  console.log(
    `DB → host=${u ? u.hostname : process.env.PGHOST} ` +
      `port=${u ? u.port || "5432" : process.env.PGPORT} ` +
      `db=${u ? u.pathname.slice(1) : process.env.PGDATABASE} ` +
      `user=${u ? u.username : process.env.PGUSER}`
  );
} catch {
  /* ignore */
}

// --- schema & helpers ---

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      ts BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::BIGINT
    );
    CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages (ts);
  `);
}

export type DbMessage = {
  id: string;
  author: string;
  text: string;
  ts: number;
};

export async function insertMessage(author: string, text: string, ts: number) {
  await pool.query(
    "INSERT INTO messages (author, text, ts) VALUES ($1, $2, $3)",
    [author, text, ts]
  );
}

export async function loadRecent(limit = 100): Promise<DbMessage[]> {
  const { rows } = await pool.query(
    "SELECT id, author, text, ts FROM messages ORDER BY ts DESC LIMIT $1",
    [limit]
  );
  return rows.reverse(); // oldest -> newest for UI
}
