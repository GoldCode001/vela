# Railway Node Version Fix

If Railway is still using Node 18, set this environment variable in Railway Dashboard:

**Variable Name**: `NIXPACKS_NODE_VERSION`  
**Value**: `20`

This will force Railway to use Node 20.

## Steps:
1. Go to Railway Dashboard → Your Frontend Service
2. Click **Variables** tab
3. Add new variable:
   - Key: `NIXPACKS_NODE_VERSION`
   - Value: `20`
4. Save and redeploy
