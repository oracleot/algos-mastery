// lib/utils.test.ts - Tests for utility functions

import { describe, it, expect } from 'vitest';
import { normalizeUrl, generateId, cn } from './utils';

describe('normalizeUrl', () => {
  it('converts URL to lowercase', () => {
    expect(normalizeUrl('https://LeetCode.com/Problems/Two-Sum/')).toBe(
      'https://leetcode.com/problems/two-sum'
    );
  });

  it('removes trailing slashes', () => {
    expect(normalizeUrl('https://leetcode.com/problems/two-sum/')).toBe(
      'https://leetcode.com/problems/two-sum'
    );
    expect(normalizeUrl('https://leetcode.com/problems/two-sum///')).toBe(
      'https://leetcode.com/problems/two-sum'
    );
  });

  it('removes query parameters', () => {
    expect(normalizeUrl('https://leetcode.com/problems/two-sum?ref=neetcode')).toBe(
      'https://leetcode.com/problems/two-sum'
    );
  });

  it('handles URLs without protocol gracefully', () => {
    // Falls back to basic normalization for invalid URLs
    const result = normalizeUrl('leetcode.com/problems/two-sum/');
    expect(result).toBe('leetcode.com/problems/two-sum');
  });

  it('normalizes two different representations of the same URL', () => {
    const url1 = 'https://leetcode.com/problems/two-sum/';
    const url2 = 'https://LeetCode.com/problems/two-sum';
    expect(normalizeUrl(url1)).toBe(normalizeUrl(url2));
  });

  it('handles LeetCode URL variations for duplicate detection', () => {
    const variations = [
      'https://leetcode.com/problems/contains-duplicate/',
      'https://leetcode.com/problems/contains-duplicate',
      'https://LEETCODE.COM/problems/CONTAINS-DUPLICATE/',
      'https://leetcode.com/problems/contains-duplicate?envType=study-plan',
    ];
    
    const normalized = variations.map(normalizeUrl);
    const unique = new Set(normalized);
    
    expect(unique.size).toBe(1);
    expect(normalized[0]).toBe('https://leetcode.com/problems/contains-duplicate');
  });

  it('preserves different problem paths as distinct', () => {
    const url1 = normalizeUrl('https://leetcode.com/problems/two-sum/');
    const url2 = normalizeUrl('https://leetcode.com/problems/three-sum/');
    expect(url1).not.toBe(url2);
  });
});

describe('generateId', () => {
  it('returns a valid UUID v4 format', () => {
    const id = generateId();
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('generates unique IDs on each call', () => {
    const ids = new Set([generateId(), generateId(), generateId(), generateId(), generateId()]);
    expect(ids.size).toBe(5);
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'disabled')).toBe('base active');
  });

  it('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
