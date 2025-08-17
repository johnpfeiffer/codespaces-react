# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-SPA (Single Page Application) React project that hosts multiple independent React applications under a single domain. The project uses Vite as the build tool and is deployed to Cloudflare Pages at https://feneky.pages.dev/.

## Architecture

### Multi-App Structure
- **Root application**: Main React app at `/src`
- **Sub-applications**: Independent SPAs in `/apps` directory:
  - `/apps/blog` - Blog SPA
  - `/apps/engineer` - Engineer SPA  
  - `/apps/manager` - Manager SPA

Each sub-app is a standalone React application with its own package.json, dependencies, and build process.

### Routing and Middleware
The Cloudflare Worker middleware (`/functions/_middleware.js`) handles intelligent routing:
- Routes requests like `/blog/*` to the blog app's build files
- Rewrites HTML responses to inject proper base paths
- Handles SPA client-side routing by serving index.html for non-asset paths
- Dynamically rewrites JavaScript to maintain correct API and asset paths

## Common Commands

### Development
```bash
# Start the main app development server on port 3000
npm start

# Start a specific sub-app development server
cd apps/blog && npm run dev
cd apps/engineer && npm run dev  
cd apps/manager && npm run dev
```

### Building
```bash
# Build all applications (main + all sub-apps)
npm run build

# This runs two scripts sequentially:
# 1. build:all - Builds each app in /apps directory
# 2. collect - Copies all dist folders to root /dist
```

### Testing
```bash
# Run tests with Vitest
npm test
```

## Build Process

The build system automatically discovers and builds all apps:

1. `scripts/build-all-apps.js`: Iterates through `/apps` directory, runs `npm install` and `npm run build` for each app
2. `scripts/collect-builds.js`: Collects all built distributions into `/dist`:
   - Copies each app's dist to `/dist/apps/{appname}`
   - Copies `/functions` to `/dist/functions`
   - Creates proper directory structure for Cloudflare deployment

## Adding a New SPA

To add a new sub-application:

1. Create the app structure in `/apps/mynewapp/`:
```
apps/mynewapp/
├── package.json
├── vite.config.js
├── index.html
└── src/
    └── index.jsx
```

2. Configure `vite.config.js` with base path set to `/`
3. Add the app name to the `validApps` array in `/functions/_middleware.js`
4. The build scripts will automatically discover and process the new app

## Key Technical Details

- **React version**: 18.2.0
- **Build tool**: Vite 4.5.5 (root), Vite 5.0.0 (sub-apps)
- **Testing**: Vitest with jsdom environment
- **Routing**: React Router v6 for client-side routing in sub-apps
- **Deployment**: Cloudflare Pages with custom Worker middleware

## Important Files

- `/functions/_middleware.js` - Cloudflare Worker that handles routing and path rewriting
- `/scripts/build-all-apps.js` - Builds all applications in /apps directory
- `/scripts/collect-builds.js` - Collects build outputs into /dist for deployment
- `/vite.config.js` - Root Vite configuration
- `/apps/*/vite.config.js` - Individual app Vite configurations