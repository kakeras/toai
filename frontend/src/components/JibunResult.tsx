import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import type { Message } from '../types/jibun';
import html2pdf from 'html2pdf.js';

const JibunResult: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('jibunChat');
    if (!savedMessages) {
      navigate('/jibun');
    }
  }, [navigate]);

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

  const handleDownload = () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: '自分と向き合う-分析結果.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
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
        <button className="download-button" onClick={handleDownload}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          PDFをダウンロード
        </button>
      </div>
      
      <div className="result-content" ref={contentRef}>
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