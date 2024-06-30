import pg from "pg";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { config } from "../config.js";
const { Pool } = pg;

export const pool = new Pool({
  user: config.db.DB_USER,
  host: config.db.DB_HOST,
  password: config.db.DB_PASSWORD,
  database: config.db.DB_NAME,
  port: config.db.DB_PORT,
});

const adapter = new NodePostgresAdapter(pool, {
  user: "auth_user",
  session: "user_session",
});
