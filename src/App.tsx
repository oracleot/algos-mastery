// App.tsx - Main application with React Router

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ShortcutHelp } from '@/components/ShortcutHelp';
import { useShortcuts } from '@/context/ShortcutsContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Problem } from './pages/Problem';
import { Progress } from './pages/Progress';
import { Review } from './pages/Review';
import { Practice } from './pages/Practice';
import { Settings } from './pages/Settings';

function App() {
  const { toggleHelp, closeHelp, isHelpOpen } = useShortcuts();

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    { key: '?', handler: toggleHelp },
    { key: 'Escape', handler: closeHelp, enabled: isHelpOpen, allowInInput: true },
  ]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<Problem />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/review" element={<Review />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ShortcutHelp />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
