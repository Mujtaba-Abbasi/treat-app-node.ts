import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { pool } from "./db";
import { config } from "./config";
import { useRoutes } from "./routes";
import { auth } from "./middlewares";
import { whitelistRoutes } from "./constants/whitelist-routes";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(async (request, response, next) => {
  if (whitelistRoutes.some((item) => request.path.startsWith(item))) {
    return next();
  }
  return auth(request, response, next);
});

const PORT = config.env.PORT;

const startServer = async () => {
  try {
    console.log(`Connecting to the database`);
    await pool.connect();
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
