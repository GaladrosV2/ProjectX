import { Pool } from "pg";

export const pool = new Pool({
  host: "127.0.0.1",
  port: 55432,
  user: "appnode",
  password: "appnode",
  database: "appdb",
});

export async function query<T = any>(text: string, params?: any[]) {
  try {
    const res = await pool.query<T>(text, params);
    return res.rows;
  } catch (e: any) {
    console.error("DB QUERY ERROR:", e?.message, e?.code);
    throw e;
  }
}
