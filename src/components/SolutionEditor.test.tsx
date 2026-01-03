// components/SolutionEditor.test.tsx - Tests for SolutionEditor component

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SolutionEditor } from './SolutionEditor';

// Mock CodeMirror since it requires DOM and doesn't work well in jsdom
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, readOnly, placeholder }: { value: string; readOnly?: boolean; placeholder?: string }) => (
    <div 
      data-testid="mock-codemirror"
      data-readonly={readOnly ? 'true' : 'false'}
      data-placeholder={placeholder}
    >
      {value}
    </div>
  ),
}));

// Mock theme hook
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

describe('SolutionEditor', () => {
  describe('readOnly behavior', () => {
    it('passes readOnly prop to CodeMirror when true', () => {
      render(
        <SolutionEditor
          value="const x = 1;"
          language="javascript"
          onChange={() => {}}
          readOnly={true}
        />
      );

      const editor = screen.getByTestId('mock-codemirror');
      expect(editor).toHaveAttribute('data-readonly', 'true');
    });

    it('passes readOnly as false when not provided', () => {
      render(
        <SolutionEditor
          value="const x = 1;"
          language="javascript"
          onChange={() => {}}
        />
      );

      const editor = screen.getByTestId('mock-codemirror');
      expect(editor).toHaveAttribute('data-readonly', 'false');
    });
  });

  describe('disabledMessage', () => {
    it('shows EditorDisabledBanner when disabledMessage is provided', () => {
      render(
        <SolutionEditor
          value=""
          language="javascript"
          onChange={() => {}}
          readOnly={true}
          disabledMessage="Start timer to begin coding"
        />
      );

      expect(screen.getByText('Start timer to begin coding')).toBeInTheDocument();
    });

    it('does not show EditorDisabledBanner when disabledMessage is not provided', () => {
      render(
        <SolutionEditor
          value=""
          language="javascript"
          onChange={() => {}}
          readOnly={true}
        />
      );

      expect(screen.queryByText('Start timer to begin coding')).not.toBeInTheDocument();
    });

    it('shows correct message when timer is paused', () => {
      render(
        <SolutionEditor
          value=""
          language="javascript"
          onChange={() => {}}
          readOnly={true}
          disabledMessage="Resume timer to continue"
        />
      );

      expect(screen.getByText('Resume timer to continue')).toBeInTheDocument();
    });
  });

  describe('showRunButton', () => {
    it('does not show CodeRunnerPanel by default', () => {
      render(
        <SolutionEditor
          value="console.log('test')"
          language="javascript"
          onChange={() => {}}
        />
      );

      expect(screen.queryByRole('button', { name: /run/i })).not.toBeInTheDocument();
    });

    it('shows CodeRunnerPanel when showRunButton is true', () => {
      render(
        <SolutionEditor
          value="console.log('test')"
          language="javascript"
          onChange={() => {}}
          showRunButton={true}
        />
      );

      expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
    });

    it('disables Run button when editor is readOnly', () => {
      render(
        <SolutionEditor
          value="console.log('test')"
          language="javascript"
          onChange={() => {}}
          showRunButton={true}
          readOnly={true}
        />
      );

      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });
  });
});
