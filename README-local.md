# Lost and Found Application - Local Setup Guide

This document provides comprehensive instructions for setting up and running the Lost and Found application on your local machine.

## Overview

The Lost and Found application is a web-based platform designed to help people recover lost items. It allows users to:

- Upload photos and details of found items
- Search for lost items
- Contact item finders through a secure contact form
- Mark items as returned once they've been claimed

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or later)
- **Git** (optional, for cloning the repository)

## Installation Steps

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd lost-and-found
```

Or download and extract the ZIP file from the repository.

### 2. Run Setup Script

Run the setup script to create necessary directories and configuration files:

**On Windows:**
```
start-local.bat
```

**On Linux/Mac:**
```
./start-local.sh
```

Or run the setup script directly:
```
node setup-local.js
```

### 3. Database Setup

1. Ensure PostgreSQL is running on your system
2. Create a new database for the application:
   ```
   createdb lost_and_found
   ```
3. If you use different PostgreSQL credentials or configuration, edit the `.env` file in the project root directory to match your setup.

### 4. Install Dependencies

Install all required packages:

```
npm install
```

### 5. Initialize Database

Initialize the database schema:

```
node init-db.js
```

This will set up all required tables in your PostgreSQL database.

### 6. Start the Application

Start the development server:

```
npm run dev
```

The application should now be running at [http://localhost:5000](http://localhost:5000)

## Configuration

The application uses environment variables for configuration. These are stored in the `.env` file in the project root:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lost_and_found
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=lost_and_found

# Server Configuration
PORT=5000
```

Modify these values as needed for your environment.

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared code and database schema
- `dist/public/uploads/` - Directory for uploaded images

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify the database name exists (`lost_and_found` by default)
- Check that your `.env` file contains correct database credentials
- Make sure the PostgreSQL user has appropriate permissions

### Image Upload Issues

- Check that the `dist/public/uploads` directory exists and is writable
- Verify that the server logs don't show any permission errors

### Port Conflicts

If port 5000 is already in use, you can change the port by editing the `PORT` value in the `.env` file.

## Building for Production

To build the application for production:

```
npm run build
```

To run the production build:

```
npm start
```

## License

[License information goes here]

## Support

For issues, questions, or contributions, please [open an issue](issue-link) or contact the repository maintainer.