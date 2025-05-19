import React from 'react';
import { useNavigate } from 'react-router-dom';
import mainImage from '../assets/image.png';

const Main: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1>Welcome</h1>
      <div className="image-container">
        <img src={mainImage} alt="Welcome" className="main-image" />
      </div>
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
          マインドポートフォリオをつくる
        </button>
      </div>
    </div>
  );
};

export default Main; 
