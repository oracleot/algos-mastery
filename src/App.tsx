// App.tsx - Main application with React Router

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Problem } from './pages/Problem';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<Problem />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
