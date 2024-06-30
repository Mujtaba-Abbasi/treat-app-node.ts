import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { pool } from "./index.js"; // Adjust this import as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const initDatabase = async () => {
  try {
    const sqlScript = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");
    const statements = sqlScript
      .split(";")
      .filter((stmt) => stmt.trim() !== "");

    for (let statement of statements) {
      statement = statement.trim();
      if (statement.toLowerCase().startsWith("create table")) {
        const tableNameMatch = statement.match(
          /create table if not exists [\"]?(\w+)[\"]?/i
        );
        if (!tableNameMatch) {
          console.error(
            "Could not parse table name from statement:",
            statement
          );
          continue;
        }
        const tableName = tableNameMatch[1];
        await createOrUpdateTable(tableName, statement);
      } else {
        await pool.query(statement);
      }
    }

    console.log("Database initialized and updated successfully");
  } catch (error) {
    console.error("Error initializing/updating database:", error);
    console.error("Error details:", error.stack);
  }
};

const createOrUpdateTable = async (tableName, createStatement) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if table exists
    const tableExists = await client.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      )
    `,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      // If table doesn't exist, create it
      await client.query(createStatement);
    } else {
      // If table exists, update its structure
      await updateTableStructure(client, tableName, createStatement);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(
      `Error in createOrUpdateTable for table ${tableName}:`,
      error
    );
    throw error;
  } finally {
    client.release();
  }
};

const updateTableStructure = async (client, tableName, createStatement) => {
  // Parse the CREATE TABLE statement to extract column definitions
  const columnDefsMatch = createStatement.match(/\(([^)]+)\)/);
  if (!columnDefsMatch) {
    console.error(
      "Could not parse column definitions from statement:",
      createStatement
    );
    return;
  }
  const columnDefs = columnDefsMatch[1].split(",");

  for (let columnDef of columnDefs) {
    columnDef = columnDef.trim();
    if (
      columnDef.toLowerCase().startsWith("primary key") ||
      columnDef.toLowerCase().startsWith("foreign key")
    ) {
      continue; // Skip primary key and foreign key constraints for now
    }

    const columnNameMatch = columnDef.match(/^(\w+)/);
    if (!columnNameMatch) {
      console.error("Could not parse column name from definition:", columnDef);
      continue;
    }
    const columnName = columnNameMatch[1];
    const dataType = columnDef.substring(columnName.length).trim();

    // Check if column exists
    const columnExists = await client.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      )
    `,
      [tableName, columnName]
    );

    if (!columnExists.rows[0].exists) {
      // If column doesn't exist, add it
      await client.query(`ALTER TABLE "${tableName}" ADD COLUMN ${columnDef}`);
    } else {
      // If column exists, alter its type and constraints
      await client.query(
        `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE ${dataType}`
      );
    }
  }

  // Handle primary key and foreign key constraints
  const constraints = createStatement.match(/CONSTRAINT.*?(?=,|$)/gi);
  if (constraints) {
    for (let constraint of constraints) {
      try {
        await client.query(`ALTER TABLE "${tableName}" ADD ${constraint}`);
      } catch (error) {
        // Constraint might already exist, so we'll ignore the error
        console.log(`Note: Constraint might already exist: ${error.message}`);
      }
    }
  }
};

export default initDatabase;
