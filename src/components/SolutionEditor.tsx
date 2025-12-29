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
}: SolutionEditorProps) {
  const { resolvedTheme } = useTheme();
  
  // Memoize extensions to prevent unnecessary re-renders
  const extensions = useMemo(() => {
    return [...getLanguageExtension(language), EditorView.lineWrapping];
  }, [language]);

  const theme = useMemo(() => {
    // Use resolved theme from context (handles system preference)
    return getEditorTheme(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <div className="rounded-md border overflow-hidden">
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
    </div>
  );
}
