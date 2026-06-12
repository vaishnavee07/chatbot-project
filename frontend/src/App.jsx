import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import { ChatProvider } from './context/ChatContext';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import StatisticsPage from './pages/StatisticsPage';

export default function App() {
  return (
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </ChatProvider>
    </Router>
  );
}
