// components/ResourceForm.test.tsx - Tests for ResourceForm component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResourceForm } from './ResourceForm';

describe('ResourceForm', () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('collapsed state', () => {
    it('should show "Add Resource" button when collapsed', () => {
      render(<ResourceForm onAdd={mockOnAdd} />);
      expect(screen.getByRole('button', { name: /add resource/i })).toBeInTheDocument();
    });

    it('should not show form fields when collapsed', () => {
      render(<ResourceForm onAdd={mockOnAdd} />);
      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/url/i)).not.toBeInTheDocument();
    });

    it('should expand when "Add Resource" button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    });
  });

  describe('expanded state', () => {
    it('should show all form fields when expanded', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
    });

    it('should show cancel and add buttons when expanded', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^add resource$/i })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should show error when title is empty', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.type(screen.getByLabelText(/url/i), 'https://youtube.com/watch?v=abc');

      // Select type
      await user.click(screen.getByRole('combobox', { name: /type/i }));
      await user.click(screen.getByRole('option', { name: /video/i }));

      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show error when URL is invalid', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      // Expand the form
      await user.click(screen.getByRole('button', { name: /add resource/i }));
      
      // Fill in title and invalid URL
      const titleInput = screen.getByLabelText(/title/i);
      const urlInput = screen.getByLabelText(/url/i);
      await user.type(titleInput, 'Test Resource');
      await user.type(urlInput, 'not-a-valid-url');

      // Select type (to not trigger type validation error)
      await user.click(screen.getByRole('combobox', { name: /type/i }));
      await user.click(screen.getByRole('option', { name: /video/i }));

      // Click the Add Resource button to trigger validation
      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show error when type is not selected', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.type(screen.getByLabelText(/title/i), 'Test Resource');
      await user.type(screen.getByLabelText(/url/i), 'https://youtube.com/watch?v=abc');

      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      expect(await screen.findByText(/please select a resource type/i)).toBeInTheDocument();
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should clear error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

      await user.type(screen.getByLabelText(/title/i), 'T');

      await waitFor(() => {
        expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('source auto-detection', () => {
    it('should auto-detect YouTube source on URL blur', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      const urlInput = screen.getByLabelText(/url/i);
      await user.type(urlInput, 'https://www.youtube.com/watch?v=abc123');
      fireEvent.blur(urlInput);

      await waitFor(() => {
        expect(screen.getByLabelText(/source/i)).toHaveValue('YouTube');
      });
    });

    it('should auto-detect Medium source on URL blur', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      const urlInput = screen.getByLabelText(/url/i);
      await user.type(urlInput, 'https://medium.com/@user/article');
      fireEvent.blur(urlInput);

      await waitFor(() => {
        expect(screen.getByLabelText(/source/i)).toHaveValue('Medium');
      });
    });

    it('should not update source for unknown URLs', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));

      const urlInput = screen.getByLabelText(/url/i);
      await user.type(urlInput, 'https://example.com/article');
      fireEvent.blur(urlInput);

      await waitFor(() => {
        expect(screen.getByLabelText(/source/i)).toHaveValue('');
      });
    });
  });

  describe('successful submission', () => {
    it('should call onAdd with resource data on valid submission', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.type(screen.getByLabelText(/title/i), 'Two Sum Solution');
      await user.type(screen.getByLabelText(/url/i), 'https://youtube.com/watch?v=abc');

      // Select type
      await user.click(screen.getByRole('combobox', { name: /type/i }));
      await user.click(screen.getByRole('option', { name: /video/i }));

      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
      });

      const addedResource = mockOnAdd.mock.calls[0][0];
      expect(addedResource.title).toBe('Two Sum Solution');
      expect(addedResource.url).toBe('https://youtube.com/watch?v=abc');
      expect(addedResource.type).toBe('video');
      expect(addedResource.id).toBeDefined();
    });

    it('should reset form and collapse after successful submission', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.type(screen.getByLabelText(/title/i), 'Test Resource');
      await user.type(screen.getByLabelText(/url/i), 'https://youtube.com/watch?v=abc');

      await user.click(screen.getByRole('combobox', { name: /type/i }));
      await user.click(screen.getByRole('option', { name: /video/i }));

      await user.click(screen.getByRole('button', { name: /^add resource$/i }));

      await waitFor(() => {
        // Form should be collapsed, showing just the Add Resource button
        expect(screen.getByRole('button', { name: /add resource/i })).toBeInTheDocument();
        expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('cancel behavior', () => {
    it('should collapse form when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
      });
    });

    it('should clear form data when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      await user.type(screen.getByLabelText(/title/i), 'Test Resource');

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await user.click(screen.getByRole('button', { name: /add resource/i }));

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
    });

    it('should collapse form when collapse icon is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceForm onAdd={mockOnAdd} />);

      await user.click(screen.getByRole('button', { name: /add resource/i }));
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /collapse form/i }));

      await waitFor(() => {
        expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
      });
    });
  });
});
