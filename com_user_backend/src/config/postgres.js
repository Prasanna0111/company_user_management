import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  options: `-c search_path=${process.env.PG_SCHEMA || "public"}`,
});

export const closePool = () => pool.end();
