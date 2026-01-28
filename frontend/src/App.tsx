import { Routes, Route } from 'react-router';
import WorkSpacePage from '@/pages/workspace/WorkSpacePage';
import LandingPage from '@/pages/landing/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace/:workspaceId" element={<WorkSpacePage />} />
    </Routes>
  );
}

export default App;
