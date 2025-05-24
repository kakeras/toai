import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';
import kamiImage from '../assets/kami.png';
import userImage from '../assets/user.png';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import jibunData from '../scripts/jibun.json';
import type { Message, JibunData } from '../types/jibun';
import '../styles/VoiceButton.css';
import { characterSettings, makePrompt } from '../gptRequest/output';
import { callOpenAI, openaiHost } from '../hosts/openai';

const Jibun: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnalysisButton, setShowAnalysisButton] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to handle message submission
  const handleMessageSubmission = async (content: string) => {
    console.log(currentQuestionIndex);

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
      phase: (jibunData as JibunData).conversation[currentQuestionIndex].phase,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

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
        phase: nextQuestion.phase,
      };

      const messagesWithQuestion = [...updatedMessages, assistantMessage];
      setMessages(messagesWithQuestion);
      setCurrentQuestionIndex(nextQuestionIndex);

      localStorage.setItem('jibunChat', JSON.stringify(messagesWithQuestion));
    } else {
      // If this was the last question, enable the analysis button
      setShowAnalysisButton(true);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('jibunChat');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(parsedMessages);
      // Find the last assistant message to determine current question
      const lastAssistantIndex = [...parsedMessages].reverse().findIndex((msg) => msg.role === 'assistant');
      if (lastAssistantIndex !== -1) {
        const lastMessage = parsedMessages[parsedMessages.length - 1 - lastAssistantIndex];
        const questionIndex = (jibunData as JibunData).conversation.findIndex(
          (item) => item.question === lastMessage.content,
        );

        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex + 1);
          // Check if this was the last question
          if (questionIndex === (jibunData as JibunData).conversation.length - 1) {
            // Check if there's a user response to the last question
            const hasUserResponse = parsedMessages.some(
              (msg: Message, idx: number) =>
                idx > parsedMessages.length - 1 - lastAssistantIndex && msg.role === 'user',
            );
            setShowAnalysisButton(hasUserResponse);
          }
        }
      }
    } else {
      // Start with the first question if no saved messages
      const initialMessage: Message = {
        role: 'assistant',
        content: (jibunData as JibunData).conversation[0].question,
        timestamp: Date.now(),
        phase: (jibunData as JibunData).conversation[0].phase,
      };
      setMessages([initialMessage]);
      localStorage.setItem('jibunChat', JSON.stringify([initialMessage]));
    }
  }, []);

  const startListening = async () => {
    setIsRecording(true);
    resetTranscript();
    await SpeechRecognition.startListening({ continuous: true, language: 'ja-JP' });
  };

  const stopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  const handleVoiceSubmit = () => {
    const finalInput = transcript.trim();
    if (finalInput) {
      handleMessageSubmission(finalInput);
      resetTranscript();
    }
    stopListening();
  };

  // Handle recording state
  useEffect(() => {
    if (!listening) {
      setIsRecording(false);
    }
  }, [listening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleMessageSubmission(input);
    setInput('');
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
      phase: (jibunData as JibunData).conversation[0].phase,
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
          ← 戻る
        </button>
        <h1>今のじぶんを知る</h1>
        <div className="header-buttons">
          <button
            className={`analysis-button ${!showAnalysisButton ? 'disabled' : ''}`}
            onClick={handleAnalysis}
            disabled={!showAnalysisButton}
          >
            レポートを作成
          </button>
          <button className="clear-button" onClick={clearChat}>
            チャットをクリア
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.role === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
          >
            {message.role === 'assistant' && <img src={kamiImage} alt="Kami" className="message-avatar" />}
            <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              {message.phase && message.role === 'assistant' && <div className="phase-title">{message.phase}</div>}
              {message.content}
            </div>
            {message.role === 'user' && <img src={userImage} alt="User" className="message-avatar" />}
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
        <button
          type="button"
          onClick={isRecording ? handleVoiceSubmit : startListening}
          className={`voice-button ${isRecording ? 'recording' : ''}`}
          style={{ width: '140px' }}
        >
          <span className="button-content">
            🎤 {isRecording ? (transcript.trim() ? '録音中... 送信' : '録音中...') : '録音開始'}
          </span>
          {isRecording && <span className="recording-pulse"></span>}
        </button>
      </form>

      <style>{`
        .voice-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .button-content {
          position: relative;
          z-index: 1;
        }

        .recording-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 0, 0, 0.3);
          border-radius: inherit;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        .voice-button.recording {
          background-color: #ff3333;
          color: white;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Jibun;
