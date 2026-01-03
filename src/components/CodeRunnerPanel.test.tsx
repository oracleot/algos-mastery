// components/CodeRunnerPanel.test.tsx - Tests for CodeRunnerPanel component

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeRunnerPanel } from './CodeRunnerPanel';

describe('CodeRunnerPanel', () => {
  describe('Run button', () => {
    it('shows Run button for JavaScript', () => {
      render(<CodeRunnerPanel code="" language="javascript" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeInTheDocument();
      expect(runButton).not.toBeDisabled();
    });

    it('shows Run button for TypeScript', () => {
      render(<CodeRunnerPanel code="" language="typescript" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeInTheDocument();
      expect(runButton).not.toBeDisabled();
    });

    it('shows disabled Run button for Python', () => {
      render(<CodeRunnerPanel code="" language="python" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeInTheDocument();
      expect(runButton).toBeDisabled();
    });

    it('shows disabled Run button for Java', () => {
      render(<CodeRunnerPanel code="" language="java" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });

    it('shows disabled Run button for C++', () => {
      render(<CodeRunnerPanel code="" language="cpp" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });

    it('shows disabled Run button for Rust', () => {
      render(<CodeRunnerPanel code="" language="rust" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });

    it('shows disabled Run button for Go', () => {
      render(<CodeRunnerPanel code="" language="go" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });

    it('disables Run button when disabled prop is true', () => {
      render(<CodeRunnerPanel code="" language="javascript" disabled />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      expect(runButton).toBeDisabled();
    });
  });

  describe('code execution', () => {
    it('displays output after execution', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='console.log("hello world")'
          language="javascript"
        />
      );
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('hello world')).toBeInTheDocument();
      });
    });

    it('displays errors with red styling', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='throw new Error("test error")'
          language="javascript"
        />
      );
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        const errorText = screen.getByText('test error');
        expect(errorText).toBeInTheDocument();
        expect(errorText.parentElement).toHaveClass('text-red-500');
      });
    });

    it('shows multiple console outputs', async () => {
      const user = userEvent.setup();
      const code = `
        console.log("first");
        console.log("second");
        console.log("third");
      `;
      
      render(<CodeRunnerPanel code={code} language="javascript" />);
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('first')).toBeInTheDocument();
        expect(screen.getByText('second')).toBeInTheDocument();
        expect(screen.getByText('third')).toBeInTheDocument();
      });
    });
  });

  describe('clear button', () => {
    it('shows Clear button after execution', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='console.log("test")'
          language="javascript"
        />
      );
      
      // Initially no Clear button
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
      });
    });

    it('clears output when Clear is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='console.log("test")'
          language="javascript"
        />
      );
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('test')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('test')).not.toBeInTheDocument();
      });
    });
  });

  describe('output styling', () => {
    it('shows warn output with yellow styling', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='console.warn("warning")'
          language="javascript"
        />
      );
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        const warnText = screen.getByText('warning');
        expect(warnText.parentElement).toHaveClass('text-yellow-600');
      });
    });

    it('shows info output with blue styling', async () => {
      const user = userEvent.setup();
      render(
        <CodeRunnerPanel
          code='console.info("info message")'
          language="javascript"
        />
      );
      
      const runButton = screen.getByRole('button', { name: /run/i });
      await user.click(runButton);

      await waitFor(() => {
        const infoText = screen.getByText('info message');
        expect(infoText.parentElement).toHaveClass('text-blue-500');
      });
    });
  });
});
