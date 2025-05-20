import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import kamiImage from '../assets/kami.png';
import userImage from '../assets/user.png';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import jibunData from '../scripts/jibun.json';
import type { Message, JibunData } from '../types/jibun';

const Jibun: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnalysisButton, setShowAnalysisButton] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if we're at the end of the conversation
  useEffect(() => {
    if (currentQuestionIndex === (jibunData as JibunData).conversation.length - 1) {
      setShowAnalysisButton(true);
    }
  }, [currentQuestionIndex]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('jibunChat');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      // Find the last assistant message to determine current question
      const lastAssistantIndex = [...JSON.parse(savedMessages)]
        .reverse()
        .findIndex(msg => msg.role === 'assistant');
      if (lastAssistantIndex !== -1) {
        const lastMessage = JSON.parse(savedMessages)[JSON.parse(savedMessages).length - 1 - lastAssistantIndex];
        const questionIndex = (jibunData as JibunData).conversation.findIndex(
          item => item.question === lastMessage.content
        );
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex + 1);
        }
      }
    } else {
      // Start with the first question if no saved messages
      const initialMessage: Message = {
        role: 'assistant',
        content: (jibunData as JibunData).conversation[0].question,
        timestamp: Date.now(),
        phase: (jibunData as JibunData).conversation[0].phase
      };
      setMessages([initialMessage]);
      localStorage.setItem('jibunChat', JSON.stringify([initialMessage]));
    }
  }, []);

  useEffect(() => {
    if (!listening && transcript.trim()) {
      const userMessage: Message = { 
        role: 'user', 
        content: transcript, 
        timestamp: Date.now(),
        phase: (jibunData as JibunData).conversation[currentQuestionIndex].phase
      };
      setMessages((prev) => [...prev, userMessage]);
      resetTranscript();
    }
  }, [listening]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false, language: 'ja-JP' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      phase: (jibunData as JibunData).conversation[currentQuestionIndex].phase
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    // Save to localStorage
    localStorage.setItem('jibunChat', JSON.stringify(updatedMessages));

    // Add next AI question if available
    if (currentQuestionIndex < (jibunData as JibunData).conversation.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextQuestion = (jibunData as JibunData).conversation[nextQuestionIndex];
      const assistantMessage: Message = {
        role: 'assistant',
        content: nextQuestion.question,
        timestamp: Date.now(),
        phase: nextQuestion.phase
      };
      
      const messagesWithQuestion = [...updatedMessages, assistantMessage];
      setMessages(messagesWithQuestion);
      setCurrentQuestionIndex(nextQuestionIndex);
      localStorage.setItem('jibunChat', JSON.stringify(messagesWithQuestion));
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setShowAnalysisButton(false);
    localStorage.removeItem('jibunChat');
    // Add initial question
    const initialMessage: Message = {
      role: 'assistant',
      content: (jibunData as JibunData).conversation[0].question,
      timestamp: Date.now(),
      phase: (jibunData as JibunData).conversation[0].phase
    };
    setMessages([initialMessage]);
    localStorage.setItem('jibunChat', JSON.stringify([initialMessage]));
  };

  const handleAnalysis = () => {
    navigate('/jibun-result');
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>このブラウザでは音声認識がサポートされていません。</p>;
  }

  return (
    <div className="jibun-container">
      <img src={colors1} alt="Colors 1" className="corner-image top-left" />
      <img src={colors2} alt="Colors 2" className="corner-image bottom-right" />
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Jibun Chat</h1>
        <div className="header-buttons">
          <button 
            className={`analysis-button ${!showAnalysisButton ? 'disabled' : ''}`} 
            onClick={handleAnalysis}
            disabled={!showAnalysisButton}
          >
            Get Analysis
          </button>
          <button className="clear-button" onClick={clearChat}>
            Clear Chat
          </button>
        </div>
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
              {message.phase && message.role === 'assistant' && (
                <div className="phase-title">{message.phase}</div>
              )}
              {message.content}
            </div>
            {message.role === 'user' && (
              <img src={userImage} alt="User" className="message-avatar" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
        <button onClick={startListening} disabled={listening}>
          🎤 {listening ? '話してください...' : '録音開始'}
        </button>
      </form>
    </div>
  );
};

export default Jibun;
