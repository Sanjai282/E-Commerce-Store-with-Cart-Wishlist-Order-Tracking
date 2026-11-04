import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import '../styles/SanjaiChatbot.css';

const QUICK_CHIPS = [
  '🎧 Best headphones under ₹2,000',
  '📦 Where is my order?',
  '📍 Delivery to Bengaluru (560001)',
  '🏷️ Active festive discount coupons',
  '💻 Best laptops for coding & work',
  '✨ Handcrafted silk sarees'
];

const INITIAL_MESSAGE = {
  id: 'msg-init',
  sender: 'bot',
  text: `Namaste! 🙏 I am **Sanjai AI Assistant**, your personal shopping guide for **BharatBazaar** 🇮🇳.

I can help you:
• Discover top products across Electronics, Fashion, Home & Groceries
• Check instant PIN code delivery dates and logistics hubs
• Track your Delhivery orders and retrieve your Safe Delivery OTP
• Claim festival discount coupons like \`FESTIVE20\` (20% OFF)!

How can I help your shopping today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  source: 'gemini-3.5-flash-lite'
};

const SanjaiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history for context
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await chatAPI.sendMessage(query, history);

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.data?.reply || 'I am here to help you shop! Please let me know what you need.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.data?.source || 'gemini-3.5-flash-lite'
      };

      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      const errMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I had a momentary connection hiccup. BharatBazaar deliveries, products, and UPI payments are running smoothly. Please ask again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Simple Markdown formatter for bold, lists, and code
  const renderFormattedText = (txt) => {
    const lines = txt.split('\n');
    return lines.map((line, lIdx) => {
      // Format bold **text** and `code`
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>');

      if (line.startsWith('• ') || line.startsWith('* ')) {
        const itemText = formatted.replace(/^[•*]\s+/, '');
        return (
          <div key={lIdx} className="chat-bullet-line" dangerouslySetInnerHTML={{ __html: `• ${itemText}` }} />
        );
      }

      if (line.trim() === '') {
        return <div key={lIdx} className="chat-empty-line" />;
      }

      return (
        <p key={lIdx} className="chat-para-line" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="sanjai-chatbot-root">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className={`sanjai-launcher-btn ${hasUnread ? 'has-unread' : ''}`}
          onClick={() => setIsOpen(true)}
          title="Chat with Sanjai AI Shopping Assistant"
        >
          <div className="launcher-avatar-wrap">
            <span className="launcher-avatar">🤖</span>
            <span className="launcher-online-dot"></span>
          </div>
          <div className="launcher-text-wrap">
            <span className="launcher-title">Sanjai AI</span>
            <small className="launcher-subtitle">Shopping Assistant</small>
          </div>
          {hasUnread && <span className="unread-badge">1</span>}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="sanjai-chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="header-avatar-wrap">
                <span className="header-avatar">🤖</span>
                <span className="header-online-status"></span>
              </div>
              <div>
                <div className="header-name-row">
                  <h3 className="header-name">Sanjai AI Assistant</h3>
                  <span className="header-model-pill">⚡ Gemini 3.5</span>
                </div>
                <p className="header-status-text">BharatBazaar Official AI Shopping Guide</p>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="btn-header-action"
                onClick={handleResetChat}
                title="Restart conversation"
              >
                ↻
              </button>
              <button
                type="button"
                className="btn-header-action"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Chips Carousel */}
          <div className="chat-chips-bar">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="chat-chip-btn"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="chat-messages-container">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message-row ${m.sender === 'user' ? 'from-user' : 'from-bot'}`}>
                {m.sender === 'bot' && (
                  <div className="bot-msg-avatar">
                    <span>🤖</span>
                  </div>
                )}
                <div className="chat-bubble">
                  <div className="bubble-content">{renderFormattedText(m.text)}</div>
                  <div className="bubble-footer">
                    <span className="bubble-time">{m.timestamp}</span>
                    {m.source && <span className="bubble-source">✔ Gemini AI Verified</span>}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row from-bot">
                <div className="bot-msg-avatar">
                  <span>🤖</span>
                </div>
                <div className="chat-bubble typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-label">Sanjai is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="chat-input-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Sanjai: 'Best phone under 25k', 'Track order'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="chat-input-field"
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              title="Send Message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanjaiChatbot;
