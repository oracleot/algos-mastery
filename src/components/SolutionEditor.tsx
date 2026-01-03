// components/SolutionEditor.tsx - CodeMirror wrapper for solution editing

import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import type { SupportedLanguage } from '@/types';
import {
  getLanguageExtension,
  getEditorTheme,
  DEFAULT_EDITOR_CONFIG,
} from '@/lib/editor';
import { useTheme } from '@/hooks/useTheme';
import { EditorDisabledBanner } from '@/components/EditorDisabledBanner';
import { CodeRunnerPanel } from '@/components/CodeRunnerPanel';

interface SolutionEditorProps {
  /** Current code value */
  value: string;
  /** Current language for syntax highlighting */
  language: SupportedLanguage;
  /** Called when code changes */
  onChange: (value: string) => void;
  /** Whether editor is read-only */
  readOnly?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Editor height */
  height?: string;
  /** Show the Run Code button and output panel (default: false) */
  showRunButton?: boolean;
  /** Message to display when editor is disabled */
  disabledMessage?: string;
  /** Remove border styling (for fullscreen mode) */
  borderless?: boolean;
}

/**
 * CodeMirror-based code editor with syntax highlighting
 * Supports multiple programming languages and themes
 */
export function SolutionEditor({
  value,
  language,
  onChange,
  readOnly = false,
  placeholder = DEFAULT_EDITOR_CONFIG.placeholder,
  height = DEFAULT_EDITOR_CONFIG.height,
  showRunButton = false,
  disabledMessage,
  borderless = false,
}: SolutionEditorProps) {
  const { resolvedTheme } = useTheme();
  
  // Memoize extensions to prevent unnecessary re-renders
  const extensions = useMemo(() => {
    const baseExtensions = [...getLanguageExtension(language), EditorView.lineWrapping];
    
    // Add borderless styling if needed
    if (borderless) {
      baseExtensions.push(
        EditorView.theme({
          '&': { border: 'none' },
          '&.cm-focused': { outline: 'none' },
          '.cm-gutters': { border: 'none' },
          '.cm-gutter': { border: 'none' },
        })
      );
    }
    
    return baseExtensions;
  }, [language, borderless]);

  const theme = useMemo(() => {
    // Use resolved theme from context (handles system preference)
    return getEditorTheme(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <div className={borderless ? '' : 'space-y-2'}>
      <div className={`relative overflow-hidden ${borderless ? '' : 'rounded-md border'}`}>
        <CodeMirror
          value={value}
          height={height}
          extensions={extensions}
          theme={theme}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          basicSetup={DEFAULT_EDITOR_CONFIG.basicSetup}
          className="text-sm"
        />
        {disabledMessage && (
          <EditorDisabledBanner message={disabledMessage} />
        )}
      </div>
      {showRunButton && (
        <CodeRunnerPanel
          code={value}
          language={language}
          disabled={readOnly}
        />
      )}
    </div>
  );
}
