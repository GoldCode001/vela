import { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { API_URL } from '../config/api';

export default function AITutorChat({ onClose }) {
  const { user } = usePrivy();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState([]);
  const messagesEndRef = useRef(null);

  const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  useEffect(() => {
    fetchStarters();
    // Welcome message
    setMessages([{
      role: 'assistant',
      content: "Yo! I'm VelaGPT 🤖 Your personal Web3 tutor. Ask me anything about crypto, DeFi, predictions - whatever you wanna learn! What's on your mind?"
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchStarters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ai-tutor/starters`);
      const data = await response.json();
      if (data.success) {
        setStarters(data.starters);
      }
    } catch (error) {
      console.error('Error fetching starters:', error);
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai-tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          walletAddress: wallet?.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: data.message,
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Yo my bad, something went wrong! Try asking again? 😅",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterClick = (starter) => {
    handleSend(starter);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal p-0 max-w-2xl mx-4 flex flex-col"
        style={{ height: '85vh', maxHeight: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">VelaGPT 🤖</h3>
            <p className="text-gray-500 text-sm">Your Personal Web3 Tutor</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20'
                    : 'glass-card'
                }`}
              >
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass-card max-w-[80%] rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starters (show only if no user messages yet) */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className="px-6 pb-4">
            <p className="text-gray-500 text-xs mb-3">Quick starts:</p>
            <div className="flex flex-wrap gap-2">
              {starters.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStarterClick(starter)}
                  className="glass-btn-sm text-xs"
                  disabled={loading}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about Web3..."
              className="input flex-1"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="glass-btn px-6"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}