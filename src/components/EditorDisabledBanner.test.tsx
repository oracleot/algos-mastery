// components/EditorDisabledBanner.test.tsx - Tests for EditorDisabledBanner component

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditorDisabledBanner } from './EditorDisabledBanner';

describe('EditorDisabledBanner', () => {
  it('renders the provided message', () => {
    render(<EditorDisabledBanner message="Start timer to begin coding" />);
    
    expect(screen.getByText('Start timer to begin coding')).toBeInTheDocument();
  });

  it('displays different messages correctly', () => {
    const { rerender } = render(
      <EditorDisabledBanner message="Start timer to begin coding" />
    );
    
    expect(screen.getByText('Start timer to begin coding')).toBeInTheDocument();
    
    rerender(<EditorDisabledBanner message="Resume timer to continue" />);
    
    expect(screen.getByText('Resume timer to continue')).toBeInTheDocument();
  });

  it('renders with an alert icon', () => {
    render(<EditorDisabledBanner message="Test message" />);
    
    // The AlertCircle icon should be rendered
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('has proper styling for overlay', () => {
    const { container } = render(
      <EditorDisabledBanner message="Test message" />
    );
    
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('absolute', 'inset-0', 'z-10');
  });
});
