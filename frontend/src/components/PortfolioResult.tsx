import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import type { Message } from '../types/portfolio';
import html2pdf from 'html2pdf.js';

// const PHASE_LABELS = {
//   mission: 'Mission（人生の目的）',
//   value: 'Value（大切にしていること）',
//   vision: 'Vision（未来像）',
// };

const PortfolioResult: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('portfolioChat');
    if (!savedMessages) {
      navigate('/portfolio');
      return;
    }
    setMessages(JSON.parse(savedMessages));
  }, [navigate]);

  // Group user answers by phase
  const getAnswersByPhase = () => {
    const answers = {
      mission: [] as string[],
      value: [] as string[],
      vision: [] as string[],
    };
    messages.forEach((msg) => {
      if (msg.role === 'user' && msg.phase) {
        if (msg.phase.includes('Mission')) answers.mission.push(msg.content);
        if (msg.phase.includes('Value')) answers.value.push(msg.content);
        if (msg.phase.includes('Vision')) answers.vision.push(msg.content);
      }
    });
    return answers;
  };

  const answers = getAnswersByPhase();

  const handleDownload = () => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: 'ポートフォリオ-分析結果.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="result-container">
      <img src={colors1} alt="Colors 1" className="corner-image top-left" />
      <img src={colors2} alt="Colors 2" className="corner-image bottom-right" />
      <div className="result-header">
        <button className="back-button" onClick={() => navigate('/portfolio')}>
          ← チャットに戻る
        </button>
        <h1>ポートフォリオ - 分析結果</h1>
        <button className="download-button" onClick={handleDownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PDFをダウンロード
        </button>
      </div>
      <div className="portfolio-venn-wrapper" ref={contentRef}>
        <div className="portfolio-venn">
          {/* Venn Diagram Circles */}
          <div className="circle mission">Mission</div>
          <div className="circle value">Value</div>
          <div className="circle vision">Vision</div>
          {/* Text Boxes */}
          <div className="venn-text mission-text">
            <div className="venn-label">実現したいこと</div>
            <div className="venn-answers">
              {answers.mission.length > 0 ? (
                answers.mission.map((a, i) => <div key={i}>{a}</div>)
              ) : (
                <div>（未入力）</div>
              )}
            </div>
          </div>
          <div className="venn-text value-text">
            <div className="venn-label">大切にしていること</div>
            <div className="venn-answers">
              {answers.value.length > 0 ? answers.value.map((a, i) => <div key={i}>{a}</div>) : <div>（未入力）</div>}
            </div>
          </div>
          <div className="venn-text vision-text">
            <div className="venn-label">時間をかけて取り組みたいこと</div>
            <div className="venn-answers">
              {answers.vision.length > 0 ? answers.vision.map((a, i) => <div key={i}>{a}</div>) : <div>（未入力）</div>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button className="back-button" onClick={() => navigate('/')}>
          TOPページに戻る
        </button>
      </div>
    </div>
  );
};

export default PortfolioResult;
