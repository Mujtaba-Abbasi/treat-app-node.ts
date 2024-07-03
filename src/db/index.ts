import pg from "pg";
import { config } from "../config";
const { Pool } = pg;

export const pool = new Pool({
  user: config.db.DB_USER,
  host: config.db.DB_HOST,
  password: config.db.DB_PASSWORD,
  database: config.db.DB_NAME,
  port: Number(config.db.DB_PORT) ?? 5432,
});
