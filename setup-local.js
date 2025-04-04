/**
 * Local Environment Setup Script
 * 
 * This script helps set up a local development environment for the Lost and Found application.
 * It configures the database and prepares the application for local use.
 */

console.log("====================================================");
console.log("Lost and Found Application - Local Setup Assistant");
console.log("====================================================");

const fs = require('fs');
const path = require('path');

// Check if .env file exists, create if not
if (!fs.existsSync('.env')) {
  console.log("\n📝 Creating .env file with default settings...");
  
  const envContent = `# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lost_and_found
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=lost_and_found

# Server Configuration
PORT=5000
`;

  fs.writeFileSync('.env', envContent);
  console.log("✅ Created .env file with default settings.");
  console.log("   Please modify the credentials if necessary.");
} else {
  console.log("\n✅ .env file already exists.");
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'dist', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log("\n📁 Creating uploads directory...");
  
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✅ Created uploads directory at: ${uploadsDir}`);
} else {
  console.log("\n✅ Uploads directory already exists.");
}

// Show setup completion message
console.log("\n====================================================");
console.log("🎉 Setup completed!");
console.log("====================================================");
console.log("\n📋 Next steps:");
console.log("1. Make sure PostgreSQL is installed and running");
console.log("2. Create a database named 'lost_and_found':");
console.log("   createdb lost_and_found");
console.log("3. If using different database credentials, update your .env file");
console.log("4. Initialize the database by running:");
console.log("   node init-db.js");
console.log("5. Start the application:");
console.log("   npm run dev");
console.log("\n🌐 The application will be available at: http://localhost:5000");
console.log("====================================================");