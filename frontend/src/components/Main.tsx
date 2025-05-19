import React from 'react';
import { useNavigate } from 'react-router-dom';
import mainImage from '../assets/image.png';
import colors1 from '../assets/colors-1.png';
import colors2 from '../assets/colors-2.png';

const Main: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <img src={colors1} alt="Colors 1" className="corner-image top-left" />
      <img src={colors2} alt="Colors 2" className="corner-image bottom-right" />
      <h1>TOAI</h1>
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
