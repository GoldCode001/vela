-- QUICK FIX: Run this if you got the "user_id does not exist" error
-- This will drop and recreate the ai_conversations table correctly

-- Drop the table if it exists (this will also drop any indexes/policies)
DROP TABLE IF EXISTS ai_conversations CASCADE;

-- Recreate the table with correct schema
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create the index
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);

-- Verify the table was created correctly
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ai_conversations'
ORDER BY ordinal_position;
