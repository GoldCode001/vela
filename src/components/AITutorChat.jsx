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
    setMessages([{
      role: 'assistant',
      content: "hey, i'm goldman. i'm here to help you understand web3, crypto, and how to use vela. what would you like to know?"
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
        content: "something went wrong. mind trying that again?",
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
        className="modal p-0 max-w-xl lg:max-w-2xl mx-4 flex flex-col"
        style={{ height: '80vh', maxHeight: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">goldman</h3>
            <p className="text-gray-500 text-xs sm:text-sm">web3 educator</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl sm:text-2xl w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20'
                    : 'glass-card'
                }`}
              >
                <p className="text-white text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass-card max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starters (show only if no user messages yet) */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className="px-4 sm:px-5 pb-3">
            <p className="text-gray-500 text-xs mb-2">quick starts:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {starters.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStarterClick(starter)}
                  className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition"
                  disabled={loading}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 sm:p-5 border-t border-white/10">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ask me anything about web3..."
              className="input flex-1 text-xs sm:text-sm py-2.5 sm:py-3 px-3 sm:px-4"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="glass-btn px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              {loading ? '...' : 'send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}