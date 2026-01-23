-- Step 4: Create ai_conversations table (FIXED VERSION)
-- If table exists incorrectly, drop it first
DROP TABLE IF EXISTS ai_conversations CASCADE;

-- Create ai_conversations table (depends on users table)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index after table is created
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
