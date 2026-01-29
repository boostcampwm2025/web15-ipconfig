import { Routes, Route } from 'react-router';
import WorkSpacePage from '@/pages/workspace/WorkSpacePage';
import LandingPage from '@/pages/landing/LandingPage';
import ErrorPage from '@/pages/error/ErrorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace/:workspaceId" element={<WorkSpacePage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
