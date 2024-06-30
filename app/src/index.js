import express from "express";
import { pool } from "./db/index.js";
import { config } from "./config.js";
import { useRoutes } from "./routes/index.js";
import initDatabase from "./db/init-db.js";

const app = express();

app.use(express.json());

const PORT = config.env.PORT;

const startServer = async () => {
  try {
    console.log(`Connecting to the database`);
    await pool.connect();

    await initDatabase();
    console.log("Connected to PostgreSQL database");
    console.log("Importing Routes");
    useRoutes(app);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to PostgreSQL", err);
    process.exit(1);
  }
};

startServer();

export default app;
