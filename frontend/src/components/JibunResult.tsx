import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import type { Message } from '../types/jibun';

const JibunResult: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMessages = localStorage.getItem('jibunChat');
    if (!savedMessages) {
      navigate('/jibun');
      return;
    }
    setMessages(JSON.parse(savedMessages));
  }, [navigate]);

  const groupMessagesByPhase = () => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      if (message.phase) {
        if (!grouped[message.phase]) {
          grouped[message.phase] = [];
        }
        grouped[message.phase].push(message);
      }
    });
    return grouped;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="result-container">
      <img src={colors1} alt="Colors 1" className="corner-image top-left" />
      <img src={colors2} alt="Colors 2" className="corner-image bottom-right" />
      <div className="result-header">
        <button className="back-button" onClick={() => navigate('/jibun')}>
          ← チャットに戻る
        </button>
        <h1>自分と向き合う - 分析結果</h1>
      </div>
      
      <div className="result-content">
        {Object.entries(groupMessagesByPhase()).map(([phase, phaseMessages]) => (
          <div key={phase} className="phase-section">
            <h2 className="phase-title">{phase}</h2>
            <div className="messages-grid">
              {phaseMessages.map((message, index) => (
                message.role === 'user' && (
                  <div key={index} className="message-card">
                    <div className="message-header">
                      <span className="message-role">あなた</span>
                      <span className="message-time">{formatDate(message.timestamp)}</span>
                    </div>
                    <div className="message-content">
                      {message.content}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JibunResult; 