// editor.ts - CodeMirror configuration utilities and language extensions

import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import type { Extension } from '@codemirror/state';
import type { SupportedLanguage } from '../types';

/**
 * Get CodeMirror language extension for syntax highlighting
 * @param language - The programming language to get extension for
 * @returns CodeMirror language extension or empty array for plaintext
 */
export function getLanguageExtension(language: SupportedLanguage): Extension[] {
  switch (language) {
    case 'javascript':
      return [javascript()];
    case 'typescript':
      return [javascript({ typescript: true })];
    case 'python':
      return [python()];
    case 'java':
      return [java()];
    case 'cpp':
      return [cpp()];
    case 'rust':
      return [rust()];
    case 'go':
      return [go()];
    case 'plaintext':
    default:
      return [];
  }
}

/**
 * Get CodeMirror theme based on color scheme preference
 * @param isDark - Whether to use dark theme
 * @returns CodeMirror theme extension
 */
export function getEditorTheme(isDark: boolean = false): Extension {
  return isDark ? githubDark : githubLight;
}

/**
 * Display name mapping for supported languages
 */
export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  rust: 'Rust',
  go: 'Go',
  plaintext: 'Plain Text',
};

/**
 * File extension mapping for supported languages
 */
export const LANGUAGE_FILE_EXTENSIONS: Record<SupportedLanguage, string> = {
  javascript: '.js',
  typescript: '.ts',
  python: '.py',
  java: '.java',
  cpp: '.cpp',
  rust: '.rs',
  go: '.go',
  plaintext: '.txt',
};

/**
 * Default editor configuration options
 */
export const DEFAULT_EDITOR_CONFIG = {
  height: '300px',
  minHeight: '150px',
  maxHeight: '600px',
  placeholder: 'Write your solution here...',
  basicSetup: {
    lineNumbers: true,
    highlightActiveLineGutter: true,
    highlightActiveLine: true,
    foldGutter: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: true,
    rectangularSelection: true,
    crosshairCursor: false,
    highlightSelectionMatches: true,
    closeBracketsKeymap: true,
    searchKeymap: true,
    foldKeymap: true,
    completionKeymap: true,
    lintKeymap: true,
  },
} as const;
