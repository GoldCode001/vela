// Privy client for JWT verification (lazy loaded)
let PrivyClient = null;
let privyClient = null;
let privyLoadAttempted = false;

async function loadPrivyClient() {
  if (privyLoadAttempted) return;
  privyLoadAttempted = true;

  try {
    const module = await import('@privy-io/node');
    PrivyClient = module.PrivyClient;
    console.log('Privy client loaded successfully');
  } catch (error) {
    console.warn('Failed to load @privy-io/node:', error.message);
  }
}

async function getPrivyClient() {
  await loadPrivyClient();

  const privyAppId = process.env.VITE_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;

  if (!privyClient && PrivyClient && privyAppId && privyAppSecret) {
    privyClient = new PrivyClient(privyAppId, privyAppSecret);
  }
  return privyClient;
}

// Middleware to verify Privy access token
export async function verifyPrivyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const client = await getPrivyClient();

    if (!client) {
      console.warn('Privy client not configured - skipping auth verification');
      // Allow request to proceed if Privy is not configured (for development)
      return next();
    }

    // Verify the access token
    const verifiedClaims = await client.verifyAuthToken(token);

    // Attach user info to request
    req.privyUserId = verifiedClaims.userId;
    req.privyUser = verifiedClaims;

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default verifyPrivyToken;
