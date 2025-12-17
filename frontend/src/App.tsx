import { Route, Routes } from 'react-router';
import SpacePage from './pages/SpacePage';

function App() {
  return (
    <Routes>
      <Route path="/space" element={<SpacePage />} />
    </Routes>
  );
}

export default App;
