import { Routes, Route } from 'react-router';
import WorkSpacePage from './pages/workspace/WorkSpacePage';
import LandingPage from './pages/workspace/LandingPage';
import MakeWorkspacePage from './pages/workspace/MakeWorkspacePage';
import JoinWorkspacePage from './pages/workspace/JoinWorkspacePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace/make" element={<MakeWorkspacePage />} />
      <Route
        path="/workspace/join/:workspaceId"
        element={<JoinWorkspacePage />}
      />
      <Route path="/workspace/:workspaceId" element={<WorkSpacePage />} />
    </Routes>
  );
}

export default App;
