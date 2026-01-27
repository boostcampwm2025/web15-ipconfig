import { Routes, Route } from 'react-router';
import WorkSpacePage from './pages/workspace/WorkSpacePage';
import LandingPage from './pages/workspace/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace" element={<WorkSpacePage />} />
    </Routes>
  );
}

export default App;
