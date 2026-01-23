# Railway Frontend Deployment Setup

## Problem
Railway is running the backend server because `railway.json` has `startCommand: "npm run server"`.

## Solution: Configure Railway for Frontend

### Option 1: Use Railway Dashboard (Recommended)

1. **Go to Railway Dashboard** → Your Frontend Service
2. **Settings** → **Deploy**
3. **Override these settings:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve dist -s -l $PORT`
   - **Root Directory**: `/` (leave empty)
4. **Save** and Railway will redeploy

### Option 2: Rename Config File

If Railway auto-detects `railway.json`, you can:

1. **Rename current file**: `railway.json` → `railway-backend.json`
2. **Rename frontend config**: `railway-frontend.json` → `railway.json`
3. **Push to GitHub** - Railway will use the new config

### Option 3: Use Environment Variable

In Railway dashboard, set:
- **RAILWAY_START_COMMAND**: `npx serve dist -s -l $PORT`
- **RAILWAY_BUILD_COMMAND**: `npm run build`

## Quick Fix (Right Now)

1. Go to Railway Dashboard
2. Select your frontend service
3. Go to **Settings** → **Deploy**
4. Change **Start Command** from `npm run server` to:
   ```
   npx serve dist -s -l $PORT
   ```
5. Change **Build Command** to:
   ```
   npm run build
   ```
6. Click **Save** - Railway will redeploy automatically

## Verify

After deployment, your frontend should be accessible at your Railway URL and serve the React app (not the API).
