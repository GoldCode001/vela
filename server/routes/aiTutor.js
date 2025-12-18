import express from 'express';
import { chatWithAI, getConversationStarters } from '../services/aiTutor.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get conversation starters
router.get('/starters', (req, res) => {
  const starters = getConversationStarters();
  res.json({ success: true, starters });
});

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { messages, userId, walletAddress } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array required',
      });
    }

    // Get AI response
    const result = await chatWithAI(messages, userId);

    if (!result.success) {
      throw new Error(result.error);
    }

    console.log('🤖 AI Response:', result.message); // DEBUG

    // Parse buttons from response
    const buttonRegex = /\[button:(defi|markets|portfolio|dashboard)\]/gi;
    const buttons = [];
    let match;
    
    while ((match = buttonRegex.exec(result.message)) !== null) {
      buttons.push(match[1].toLowerCase());
      console.log('🔘 Found button:', match[1]); // DEBUG
    }

    // Remove button tags from message
    const cleanMessage = result.message.replace(buttonRegex, '').trim();

    console.log('✅ Clean message:', cleanMessage); // DEBUG
    console.log('🔘 Buttons:', buttons); // DEBUG

    // Save conversation to DB
    if (walletAddress) {
      await supabase.from('ai_conversations').insert({
        wallet_address: walletAddress,
        messages: messages,
        ai_response: cleanMessage,
        buttons: buttons,
        tokens_used: result.usage?.total_tokens || 0,
      });
    }

    res.json({
      success: true,
      message: cleanMessage,
      buttons: buttons,
    });
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;