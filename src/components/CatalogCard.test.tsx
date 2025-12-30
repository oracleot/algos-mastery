// components/CatalogCard.test.tsx - Tests for CatalogCard component

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogCard } from './CatalogCard';
import type { CatalogProblem } from '@/types';

const mockProblem: CatalogProblem = {
  id: 'two-sum',
  title: 'Two Sum',
  url: 'https://leetcode.com/problems/two-sum/',
  topic: 'arrays-hashing',
  difficulty: 'easy',
  source: 'blind-75',
  order: 1,
  leetcodeNumber: 1,
};

describe('CatalogCard', () => {
  it('renders problem title', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByText('Two Sum')).toBeInTheDocument();
  });

  it('renders LeetCode number when provided', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('does not render LeetCode number when not provided', () => {
    const problemWithoutNumber = { ...mockProblem, leetcodeNumber: undefined };
    render(<CatalogCard problem={problemWithoutNumber} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.queryByText('#')).not.toBeInTheDocument();
  });

  it('renders difficulty badge', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders topic badge', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
  });

  it('renders source badge', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByText('Blind 75')).toBeInTheDocument();
  });

  it('renders external link to LeetCode', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    const link = screen.getByRole('link', { name: /open two sum on leetcode/i });
    expect(link).toHaveAttribute('href', mockProblem.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders "Add to My Problems" button when not added', () => {
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={vi.fn()} />);

    expect(screen.getByRole('button', { name: /add to my problems/i })).toBeInTheDocument();
  });

  it('calls onAdd when "Add to My Problems" button is clicked', () => {
    const handleAdd = vi.fn();
    render(<CatalogCard problem={mockProblem} isAdded={false} onAdd={handleAdd} />);

    fireEvent.click(screen.getByRole('button', { name: /add to my problems/i }));

    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('renders "Already Added" button when problem is added', () => {
    render(<CatalogCard problem={mockProblem} isAdded={true} onAdd={vi.fn()} />);

    expect(screen.getByRole('button', { name: /already added/i })).toBeInTheDocument();
  });

  it('disables "Already Added" button', () => {
    render(<CatalogCard problem={mockProblem} isAdded={true} onAdd={vi.fn()} />);

    expect(screen.getByRole('button', { name: /already added/i })).toBeDisabled();
  });

  it('does not show "Add to My Problems" button when already added', () => {
    render(<CatalogCard problem={mockProblem} isAdded={true} onAdd={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /add to my problems/i })).not.toBeInTheDocument();
  });
});
