import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Jibun from './components/Jibun';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/jibun" element={<Jibun />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
