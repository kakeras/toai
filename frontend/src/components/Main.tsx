import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1>Welcome</h1>
      <div className="button-container">
        <button 
          className="nav-button jibun-button"
          onClick={() => navigate('/jibun')}
        >
          今のじぶんを知る
        </button>
        <button 
          className="nav-button portfolio-button"
          onClick={() => navigate('/portfolio')}
        >
          Portfolio
        </button>
      </div>
    </div>
  );
};

export default Main; 