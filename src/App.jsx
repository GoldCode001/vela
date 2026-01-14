import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Markets from './pages/Markets.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Education from './pages/Education.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/education" element={<Education />} />
    </Routes>
  );
}

export default App;
