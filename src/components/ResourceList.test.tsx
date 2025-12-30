// components/ResourceList.test.tsx - Tests for ResourceList component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResourceList } from './ResourceList';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { LearningResource } from '@/types';

// Wrapper with TooltipProvider for tests
function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

const mockResources: LearningResource[] = [
  {
    id: 'r1',
    title: 'Two Sum Video Explanation',
    url: 'https://www.youtube.com/watch?v=abc123',
    type: 'video',
    source: 'YouTube',
  },
  {
    id: 'r2',
    title: 'Understanding Hash Maps',
    url: 'https://medium.com/@user/hash-maps',
    type: 'article',
    source: 'Medium',
  },
  {
    id: 'r3',
    title: 'Array Methods Reference',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    type: 'documentation',
    source: 'MDN',
  },
];

describe('ResourceList', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('should render nothing when resources array is empty', () => {
      const { container } = renderWithTooltip(<ResourceList resources={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('displaying resources', () => {
    it('should render all resources', () => {
      renderWithTooltip(<ResourceList resources={mockResources} />);

      expect(screen.getByText('Two Sum Video Explanation')).toBeInTheDocument();
      expect(screen.getByText('Understanding Hash Maps')).toBeInTheDocument();
      expect(screen.getByText('Array Methods Reference')).toBeInTheDocument();
    });

    it('should display source names', () => {
      renderWithTooltip(<ResourceList resources={mockResources} />);

      expect(screen.getByText('YouTube')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('MDN')).toBeInTheDocument();
    });

    it('should render resources as external links', () => {
      renderWithTooltip(<ResourceList resources={mockResources} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);

      expect(links[0]).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc123');
      expect(links[0]).toHaveAttribute('target', '_blank');
      expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render type-specific icons', () => {
      renderWithTooltip(<ResourceList resources={mockResources} />);

      // Check that 3 resource items are rendered (each has an icon)
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });
  });

  describe('remove functionality', () => {
    it('should not show remove buttons when onRemove is not provided', () => {
      renderWithTooltip(<ResourceList resources={mockResources} />);

      const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(0);
    });

    it('should show remove buttons when onRemove is provided', () => {
      renderWithTooltip(<ResourceList resources={mockResources} onRemove={mockOnRemove} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(3);
    });

    it('should call onRemove with resource id when remove button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTooltip(<ResourceList resources={mockResources} onRemove={mockOnRemove} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]!);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith('r1');
    });

    it('should have correct aria-label on remove buttons', () => {
      renderWithTooltip(<ResourceList resources={mockResources} onRemove={mockOnRemove} />);

      expect(screen.getByRole('button', { name: /remove two sum video/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove understanding hash/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove array methods/i })).toBeInTheDocument();
    });
  });

  describe('resource without source', () => {
    it('should not show source when empty', () => {
      const resourceWithoutSource: LearningResource[] = [
        {
          id: 'r1',
          title: 'Test Resource',
          url: 'https://example.com',
          type: 'article',
          source: '',
        },
      ];

      renderWithTooltip(<ResourceList resources={resourceWithoutSource} />);

      expect(screen.getByText('Test Resource')).toBeInTheDocument();
      // The source text element should not exist
      const listItem = screen.getByRole('listitem');
      expect(listItem.querySelector('.text-muted-foreground')).toBeNull();
    });
  });

  describe('type icons and colors', () => {
    it('should render video resources with correct styling', () => {
      const videoResource: LearningResource[] = [
        {
          id: 'v1',
          title: 'Video Resource',
          url: 'https://youtube.com/watch?v=abc',
          type: 'video',
          source: 'YouTube',
        },
      ];

      renderWithTooltip(<ResourceList resources={videoResource} />);

      const listItem = screen.getByRole('listitem');
      expect(listItem.querySelector('.text-red-500')).toBeInTheDocument();
    });

    it('should render article resources with correct styling', () => {
      const articleResource: LearningResource[] = [
        {
          id: 'a1',
          title: 'Article Resource',
          url: 'https://medium.com/article',
          type: 'article',
          source: 'Medium',
        },
      ];

      renderWithTooltip(<ResourceList resources={articleResource} />);

      const listItem = screen.getByRole('listitem');
      expect(listItem.querySelector('.text-blue-500')).toBeInTheDocument();
    });

    it('should render documentation resources with correct styling', () => {
      const docResource: LearningResource[] = [
        {
          id: 'd1',
          title: 'Documentation Resource',
          url: 'https://docs.example.com',
          type: 'documentation',
          source: 'Docs',
        },
      ];

      renderWithTooltip(<ResourceList resources={docResource} />);

      const listItem = screen.getByRole('listitem');
      expect(listItem.querySelector('.text-green-500')).toBeInTheDocument();
    });
  });
});
