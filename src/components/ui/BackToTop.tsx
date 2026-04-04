import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const THRESHOLD = 300;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check immediately on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 z-50
        w-10 h-10
        flex items-center justify-center
        rounded-lg
        bg-secondary border border-border
        text-secondary-foreground
        shadow-md
        transition-all duration-200 ease-out
        hover:bg-muted-foreground/20 hover:scale-105
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        cursor-pointer
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
