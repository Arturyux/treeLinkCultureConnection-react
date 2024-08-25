import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admincc" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;