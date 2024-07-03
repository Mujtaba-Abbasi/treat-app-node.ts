import * as dotenv from "dotenv";

dotenv.config();

const { DB_PASSWORD, DB_NAME, DB_HOST, DB_USER, PORT, DB_PORT, SECRET_KEY } =
  process.env;

const env = {
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PORT,
  PORT,
  SECRET_KEY,
};

const db = {
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PORT,
};

export const config = {
  env,
  db,
};
