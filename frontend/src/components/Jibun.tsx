import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import kamiImage from '../assets/kami.png';
import userImage from '../assets/user.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Jibun: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // TODO: Replace with actual API call to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response || 'Sorry, I could not process your request.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    }
  };

  return (
    <div className="jibun-container">
      <img src={colors1} alt="Colors 1" className="corner-image top-left" />
      <img src={colors2} alt="Colors 2" className="corner-image bottom-right" />
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message-wrapper ${message.role === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
          >
            {message.role === 'assistant' && (
              <img src={kamiImage} alt="Kami" className="message-avatar" />
            )}
            <div 
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <img src={userImage} alt="User" className="message-avatar" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Jibun; 
