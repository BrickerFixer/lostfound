# Lost and Found Application

A mobile-first web application designed to help connect people who have found items with those who have lost them. This application allows users to upload photos and details of found items, search for lost items, claim them through a verification process, and confirm returns.

## Features

- Mobile-responsive design optimized for all devices
- Image upload for found items
- Search functionality to find lost items
- Detailed item view with claim process
- Contact information sharing with privacy protection
- Confirmation system for returned items
- Russian language interface

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v7 or later)
- [PostgreSQL](https://www.postgresql.org/) (v12 or later)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd lost-and-found-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database for the application:

```bash
createdb lost_and_found
```

### 4. Configure environment variables

Create a `.env` file in the root directory with the following content (customize as needed):

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

### 5. Run the setup script

This script will create necessary directories and set up the database schema:

```bash
node setup-local.js
```

### 6. Start the application

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000).

## Application Structure

- **Client**: React.js frontend with TypeScript
  - `/client/src/pages`: Main application pages
  - `/client/src/components`: Reusable UI components
  - `/client/src/lib`: Utility functions and API client

- **Server**: Express.js backend
  - `/server/routes.ts`: API endpoints
  - `/server/storage.ts`: Database interface
  - `/server/db.ts`: Database connection

- **Shared**: Code shared between client and server
  - `/shared/schema.ts`: Database schema definitions

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- **items**: Stores information about found items including images and finder's contact details
- **users**: Reserved for future authentication features (not currently used)

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Make sure PostgreSQL is running
2. Check that the database exists: `psql -l` should list your database
3. Verify your credentials in the `.env` file
4. Ensure the database user has proper permissions

### Image Upload Problems

If images aren't uploading correctly:

1. Check that the `dist/public/uploads` directory exists and is writable
2. Verify that the form is submitting multipart/form-data
3. Check the server logs for any file processing errors

## Development Notes

- The application uses Drizzle ORM for database interactions
- For schema changes, modify `/shared/schema.ts` and run `npx drizzle-kit push:pg`
- Frontend uses TanStack Query for data fetching and caching
- UI components are built with shadcn/ui and Tailwind CSS