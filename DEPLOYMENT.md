# Vercel Deployment Guide

This application can now be deployed to Vercel. Here's what has been configured:

## Files Added/Modified:

1. **vercel.json** - Vercel deployment configuration
2. **api/index.ts** - Serverless function handler for API routes
3. **.gitignore** - Excludes build artifacts and dependencies
4. **.env.example** - Environment variable template
5. **package.json** - Added @vercel/node dependency
6. **tsconfig.json** - Added api directory to TypeScript compilation

## Deployment Steps:

### 1. Database Setup
- Set up a PostgreSQL database (recommended: Neon Database)
- Get the connection string (DATABASE_URL)
- Run database migrations: `npm run db:push` (after setting DATABASE_URL locally)

### 2. Environment Variables
Set these environment variables in Vercel:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NODE_ENV` - Set to "production"

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## How It Works:

- **Frontend**: React app built with Vite, served as static files from `dist/public`
- **Backend**: Express.js API routes handled by `api/index.ts` as a serverless function
- **Database**: PostgreSQL with Drizzle ORM (configure DATABASE_URL)
- **Routing**: All `/api/*` requests go to the serverless function, all others serve the React app

## Local Development:

```bash
npm install
npm run dev
```

## Build:

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend bundle (for reference)
- `api/index.ts` - Serverless function for Vercel

## Troubleshooting:

1. **Database Connection Issues**: Ensure DATABASE_URL is set correctly in Vercel environment variables
2. **API Routes Not Working**: Check that `/api/*` requests are being routed correctly 
3. **Build Failures**: Ensure all dependencies are listed in package.json (not just devDependencies)