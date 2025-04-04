import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import 'dotenv/config'; // Add dotenv for local environment variables

const { Pool } = pg;

// Create a PostgreSQL connection pool
// If DATABASE_URL is provided, use it; otherwise, use individual connection parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // These settings will only be used if no connectionString is provided
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  database: process.env.PGDATABASE
});

// Log connection attempt
console.log(`Attempting to connect to database: ${process.env.PGDATABASE || 'from connection string'}`);

// Test connection and handle errors
pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
  console.error('Please make sure your database is running and the connection details are correct.');
});

// Create a drizzle instance using the database pool
export const db = drizzle(pool, { schema });