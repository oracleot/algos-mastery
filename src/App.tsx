// App.tsx - Main application with React Router

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ShortcutHelp } from '@/components/ShortcutHelp';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ServiceWorkerUpdate } from '@/components/ServiceWorkerUpdate';
import { useShortcuts } from '@/context/ShortcutsContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePWA } from '@/hooks/usePWA';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Problem } from './pages/Problem';
import { Progress } from './pages/Progress';
import { Review } from './pages/Review';
import { Practice } from './pages/Practice';
import { Settings } from './pages/Settings';

function App() {
  const { toggleHelp, closeHelp, isHelpOpen } = useShortcuts();
  const { isInstallable, isDismissed, isUpdateAvailable, install, dismissInstall, update } = usePWA();

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
      
      {/* PWA Install Prompt */}
      {isInstallable && !isDismissed && (
        <InstallPrompt onInstall={install} onDismiss={dismissInstall} />
      )}
      
      {/* Service Worker Update Notification */}
      <ServiceWorkerUpdate isUpdateAvailable={isUpdateAvailable} onUpdate={update} />
      
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
