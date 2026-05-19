import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const primaryPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Primary client for all write operations
export const dbPrimary = drizzle(primaryPool, { schema });
