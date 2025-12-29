// App.tsx - Main application with React Router

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Problem } from './pages/Problem';
import { Progress } from './pages/Progress';
import { Review } from './pages/Review';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<Problem />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/review" element={<Review />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
