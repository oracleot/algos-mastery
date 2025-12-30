// lib/validation.test.ts - Tests for validation functions

import { describe, it, expect } from 'vitest';
import { validateResource, isResourceValid } from './validation';
import type { LearningResource } from '@/types';

describe('validateResource', () => {
  describe('title validation', () => {
    it('should require a title', () => {
      const errors = validateResource({ url: 'https://example.com', type: 'video' });
      expect(errors.title).toBe('Title is required');
    });

    it('should reject empty title', () => {
      const errors = validateResource({ title: '', url: 'https://example.com', type: 'video' });
      expect(errors.title).toBe('Title is required');
    });

    it('should reject whitespace-only title', () => {
      const errors = validateResource({ title: '   ', url: 'https://example.com', type: 'video' });
      expect(errors.title).toBe('Title is required');
    });

    it('should accept valid title', () => {
      const errors = validateResource({ title: 'Two Sum Solution', url: 'https://example.com', type: 'video' });
      expect(errors.title).toBeUndefined();
    });

    it('should reject title over 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const errors = validateResource({ title: longTitle, url: 'https://example.com', type: 'video' });
      expect(errors.title).toBe('Title must be 200 characters or less');
    });

    it('should accept title exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);
      const errors = validateResource({ title: maxTitle, url: 'https://example.com', type: 'video' });
      expect(errors.title).toBeUndefined();
    });
  });

  describe('URL validation', () => {
    it('should require a URL', () => {
      const errors = validateResource({ title: 'Test', type: 'video' });
      expect(errors.url).toBe('URL is required');
    });

    it('should reject empty URL', () => {
      const errors = validateResource({ title: 'Test', url: '', type: 'video' });
      expect(errors.url).toBe('URL is required');
    });

    it('should reject whitespace-only URL', () => {
      const errors = validateResource({ title: 'Test', url: '   ', type: 'video' });
      expect(errors.url).toBe('URL is required');
    });

    it('should reject invalid URL format', () => {
      const errors = validateResource({ title: 'Test', url: 'not-a-url', type: 'video' });
      expect(errors.url).toBe('Please enter a valid URL');
    });

    it('should accept valid HTTP URL', () => {
      const errors = validateResource({ title: 'Test', url: 'http://example.com', type: 'video' });
      expect(errors.url).toBeUndefined();
    });

    it('should accept valid HTTPS URL', () => {
      const errors = validateResource({ title: 'Test', url: 'https://example.com/path', type: 'video' });
      expect(errors.url).toBeUndefined();
    });

    it('should accept URL with query parameters', () => {
      const errors = validateResource({ title: 'Test', url: 'https://youtube.com/watch?v=abc123', type: 'video' });
      expect(errors.url).toBeUndefined();
    });
  });

  describe('type validation', () => {
    it('should require a type', () => {
      const errors = validateResource({ title: 'Test', url: 'https://example.com' });
      expect(errors.type).toBe('Please select a resource type');
    });

    it('should reject invalid type', () => {
      const errors = validateResource({ 
        title: 'Test', 
        url: 'https://example.com', 
        type: 'invalid' as LearningResource['type'] 
      });
      expect(errors.type).toBe('Please select a resource type');
    });

    it('should accept video type', () => {
      const errors = validateResource({ title: 'Test', url: 'https://example.com', type: 'video' });
      expect(errors.type).toBeUndefined();
    });

    it('should accept article type', () => {
      const errors = validateResource({ title: 'Test', url: 'https://example.com', type: 'article' });
      expect(errors.type).toBeUndefined();
    });

    it('should accept documentation type', () => {
      const errors = validateResource({ title: 'Test', url: 'https://example.com', type: 'documentation' });
      expect(errors.type).toBeUndefined();
    });
  });

  describe('full validation', () => {
    it('should return empty object for valid resource', () => {
      const errors = validateResource({
        title: 'Two Sum Video Explanation',
        url: 'https://www.youtube.com/watch?v=abc123',
        type: 'video',
        source: 'YouTube',
      });
      expect(errors).toEqual({});
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const errors = validateResource({});
      expect(errors.title).toBeDefined();
      expect(errors.url).toBeDefined();
      expect(errors.type).toBeDefined();
    });
  });
});

describe('isResourceValid', () => {
  it('should return true for empty errors object', () => {
    expect(isResourceValid({})).toBe(true);
  });

  it('should return false when errors exist', () => {
    expect(isResourceValid({ title: 'Title is required' })).toBe(false);
  });

  it('should return false when multiple errors exist', () => {
    expect(isResourceValid({ 
      title: 'Title is required', 
      url: 'URL is required' 
    })).toBe(false);
  });
});
