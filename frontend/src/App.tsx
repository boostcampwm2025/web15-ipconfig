import { Routes, Route } from 'react-router';
import WorkSpacePage from './pages/WorkSpacePage';

function App() {
  return (
    <Routes>
      <Route path="/workspace" element={<WorkSpacePage />} />
    </Routes>
  );
}

export default App;
