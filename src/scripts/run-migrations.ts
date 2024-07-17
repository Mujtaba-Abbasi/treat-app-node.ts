import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { pool } from "../db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
  try {
    console.log("Starting the db migrations script");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS migration (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

    const pendingMigrationsDir = path.join(__dirname, "..", "migrations");

    const { rows } = await pool.query("SELECT name FROM migration");
    const appliedMigrations = new Set(rows.map((row) => row.name));

    const files = await fs.readdir(pendingMigrationsDir);

    for (const file of files) {
      if (appliedMigrations.has(file)) {
        console.log(`Migration already applied: ${file}`);
        continue;
      }

      const migrationPath = path.join(pendingMigrationsDir, file);
      const sql = await fs.readFile(migrationPath, "utf-8");

      await pool.query("BEGIN");

      try {
        await pool.query(sql);
        await pool.query("INSERT INTO migration (name) VALUES ($1)", [file]);
        await pool.query("COMMIT");

        console.log(`Applied migration: ${file}`);
      } catch (error) {
        await pool.query("ROLLBACK");
        console.error(`Error applying migration ${file}:`, error);
        break;
      }
    }

    console.log("Migrations Ran successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

runMigrations();
