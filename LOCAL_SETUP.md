# Local Setup Instructions

Follow these steps to set up and run the Lost and Found application on your local machine.

## Prerequisites

1. Node.js (v16 or later)
2. PostgreSQL (v12 or later)
3. Basic knowledge of terminal/command line

## Setup Steps

### 1. Database Setup

Create a PostgreSQL database for the application:

```
createdb lost_and_found
```

If you have a different username/password for PostgreSQL, you'll need to update the environment variables in the next step.

### 2. Environment Variables

Create a file named `.env` in the root project directory with the following content:

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

Update the database credentials as needed for your PostgreSQL installation.

### 3. Dependencies Installation

In the project directory, install all required dependencies:

```
npm install
```

### 4. Create Uploads Directory

Create a directory for storing uploaded images:

```
mkdir -p dist/public/uploads
```

### 5. Database Initialization

Initialize the database schema:

```
npx drizzle-kit push
```

### 6. Start the Application

Start the development server:

```
npm run dev
```

The application should now be running at http://localhost:5000

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify the database name exists
- Check that your .env file has correct credentials
- Make sure the PostgreSQL user has appropriate permissions

### Common Issues

1. **Port already in use**: Change the PORT in .env file
2. **Database schema errors**: Run migrations again with `npx drizzle-kit push`
3. **Image upload issues**: Check that the uploads directory exists and is writable