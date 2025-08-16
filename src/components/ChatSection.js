import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../utils/api';

function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    // Send welcome message
    if (messages.length === 0) {
      addSystemMessage("Hello! I'm Goal AI, your personal JEE/NEET preparation assistant. How can I help you today?");
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await apiRequest('GET', '/api/chats');
      if (response.ok) {
        const chats = await response.json();
        const formattedMessages = chats.flatMap(chat => [
          { type: 'user', content: chat.userMessage, timestamp: chat.timestamp },
          { type: 'ai', content: chat.aiResponse, timestamp: chat.timestamp }
        ]);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const addSystemMessage = (content) => {
    setMessages(prev => [...prev, {
      type: 'ai',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        message: userMessage,
        type: chatType
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          type: 'ai',
          content: data.response,
          timestamp: new Date().toISOString()
        }]);
      } else {
        addSystemMessage("I'm sorry, I'm having trouble responding right now. Please try again.");
      }
    } catch (error) {
      console.error('Chat error:', error);
      addSystemMessage("I'm sorry, I'm having trouble responding right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "Plan my day", action: () => handleQuickAction("Help me plan my study schedule for today") },
    { label: "Track progress", action: () => handleQuickAction("I want to share what I studied today and get feedback") },
    { label: "Motivation", action: () => handleQuickAction("I need some motivation to keep studying") },
    { label: "Study tips", action: () => handleQuickAction("Give me some effective study tips for my exam preparation") }
  ];

  const handleQuickAction = (message) => {
    setInputMessage(message);
  };

  return (
    <div className="chat-section">
      <div className="chat-header">
        <h2>Chat with AI</h2>
        <div className="chat-type-selector">
          <label>
            <input
              type="radio"
              name="chatType"
              value="general"
              checked={chatType === 'general'}
              onChange={(e) => setChatType(e.target.value)}
            />
            General Chat
          </label>
          <label>
            <input
              type="radio"
              name="chatType"
              value="daily-planning"
              checked={chatType === 'daily-planning'}
              onChange={(e) => setChatType(e.target.value)}
            />
            Daily Planning
          </label>
          <label>
            <input
              type="radio"
              name="chatType"
              value="evening-checkin"
              checked={chatType === 'evening-checkin'}
              onChange={(e) => setChatType(e.target.value)}
            />
            Progress Check-in
          </label>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={action.action}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="2"
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className="send-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
