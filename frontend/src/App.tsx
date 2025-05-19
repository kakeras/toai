import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Jibun from './components/Jibun';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/jibun">Jibun</Link>
            </li>
            <li>
              <Link to="/portfolio">Portfolio</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/jibun" element={<Jibun />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/" element={<Jibun />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
