-- Step 2: Create user_wallets table (depends on users table)
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  base_address TEXT NOT NULL,
  polygon_address TEXT NOT NULL,
  polygon_private_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
