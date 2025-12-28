// App.tsx - Main application with React Router

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
