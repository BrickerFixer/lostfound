/**
 * Database Initialization Script
 * 
 * This script loads environment variables from .env and runs database migrations.
 */

// Load environment variables from .env file
require('dotenv').config();

// Make sure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set!");
  console.error("Please make sure your .env file exists and contains DATABASE_URL.");
  process.exit(1);
}

console.log("====================================================");
console.log("Database Initialization");
console.log("====================================================");
console.log("\nDatabase URL detected, running drizzle migrations...");
console.log("\nRunning the following command:");
console.log("npx drizzle-kit push");

// Use child_process to execute the drizzle-kit push command
const { spawn } = require('child_process');
const child = spawn('npx', ['drizzle-kit', 'push']);

child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log("\n✅ Database schema successfully initialized!");
    console.log("\nYou can now start the application with:");
    console.log("npm run dev");
  } else {
    console.error(`\n❌ Database initialization failed with exit code ${code}`);
    console.error("Please check error messages above and ensure your database is running.");
  }
});