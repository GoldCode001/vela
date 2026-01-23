# Deployment Guide

## Current Setup
- **Backend**: Railway (https://vela-production-804d.up.railway.app/)
- **Frontend**: Vercel (https://vela-goldman.vercel.app/)

## Deploying Frontend to Railway

### Option 1: Deploy Frontend as Separate Railway Service

1. **Create New Service in Railway**
   - Go to Railway dashboard
   - Click "New Project" or add service to existing project
   - Connect your GitHub repo: `https://github.com/GoldCode001/vela.git`
   - Select the repository

2. **Configure Build Settings**
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve dist -s -l 3000`
   - **Healthcheck Path**: `/`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://vela-production-804d.up.railway.app
   VITE_PRIVY_APP_ID=your_privy_app_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_COINBASE_APP_ID=your_coinbase_app_id
   PORT=3000
   ```

4. **Install serve package** (add to package.json):
   ```json
   "dependencies": {
     "serve": "^14.2.0"
   }
   ```

5. **Deploy** - Railway will auto-deploy on push to main branch

### Option 2: Redeploy on Vercel (Easier - Recommended)

Since your frontend is already on Vercel, just push to GitHub and Vercel will auto-deploy:

1. **Push to GitHub** (already done ✅)
2. **Vercel will auto-deploy** - Check your Vercel dashboard
3. **Or manually trigger**: Go to Vercel dashboard → Your project → Deployments → Redeploy

### Option 3: Redeploy Backend on Railway

If you want to redeploy the backend:

1. Go to Railway dashboard
2. Select your backend service
3. Click "Redeploy" or push new code to trigger auto-deploy
4. Railway auto-deploys on every push to main branch

## Quick Deploy Commands

### Vercel (Frontend)
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

### Railway (Backend)
- Auto-deploys on git push to main
- Or manually trigger in Railway dashboard

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] VITE_API_URL
- [ ] VITE_PRIVY_APP_ID
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_COINBASE_APP_ID

### Backend (Railway)
- [ ] PORT
- [ ] BASE_RPC_URL
- [ ] POLYGON_RPC
- [ ] SOCKET_API_KEY
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] OPENROUTER_API_KEY
