// lib/resourceUtils.test.ts - Tests for resource utility functions

import { describe, it, expect } from 'vitest';
import { detectResourceSource, getResourceTypeIcon, getResourceTypeColor, getResourceTypeLabel } from './resourceUtils';
import { Play, FileText, BookOpen } from 'lucide-react';

describe('detectResourceSource', () => {
  describe('Video platforms', () => {
    it('should detect YouTube from youtube.com', () => {
      expect(detectResourceSource('https://www.youtube.com/watch?v=abc123')).toBe('YouTube');
    });

    it('should detect YouTube from youtu.be', () => {
      expect(detectResourceSource('https://youtu.be/abc123')).toBe('YouTube');
    });

    it('should detect Vimeo', () => {
      expect(detectResourceSource('https://vimeo.com/123456')).toBe('Vimeo');
    });

    it('should detect NeetCode', () => {
      expect(detectResourceSource('https://neetcode.io/courses/dsa')).toBe('NeetCode');
    });

    it('should detect Udemy', () => {
      expect(detectResourceSource('https://www.udemy.com/course/algorithms')).toBe('Udemy');
    });

    it('should detect Coursera', () => {
      expect(detectResourceSource('https://www.coursera.org/learn/algorithms')).toBe('Coursera');
    });
  });

  describe('Article platforms', () => {
    it('should detect Medium', () => {
      expect(detectResourceSource('https://medium.com/@user/article')).toBe('Medium');
    });

    it('should detect Dev.to', () => {
      expect(detectResourceSource('https://dev.to/user/article')).toBe('Dev.to');
    });

    it('should detect Hashnode from hashnode.dev', () => {
      expect(detectResourceSource('https://blog.hashnode.dev/article')).toBe('Hashnode');
    });

    it('should detect Hashnode from hashnode.com', () => {
      expect(detectResourceSource('https://hashnode.com/n/article')).toBe('Hashnode');
    });

    it('should detect Substack', () => {
      expect(detectResourceSource('https://newsletter.substack.com/p/article')).toBe('Substack');
    });

    it('should detect freeCodeCamp', () => {
      expect(detectResourceSource('https://www.freecodecamp.org/news/article')).toBe('freeCodeCamp');
    });

    it('should detect GeeksforGeeks', () => {
      expect(detectResourceSource('https://www.geeksforgeeks.org/two-sum/')).toBe('GeeksforGeeks');
    });

    it('should detect Towards Data Science', () => {
      expect(detectResourceSource('https://towardsdatascience.com/article')).toBe('Towards Data Science');
    });
  });

  describe('Documentation', () => {
    it('should detect MDN', () => {
      expect(detectResourceSource('https://developer.mozilla.org/en-US/docs/Web/JavaScript')).toBe('MDN');
    });

    it('should detect Python Docs', () => {
      expect(detectResourceSource('https://docs.python.org/3/tutorial')).toBe('Python Docs');
    });

    it('should detect TypeScript Docs', () => {
      expect(detectResourceSource('https://www.typescriptlang.org/docs')).toBe('TypeScript Docs');
    });

    it('should detect React Docs from reactjs.org', () => {
      expect(detectResourceSource('https://reactjs.org/docs')).toBe('React Docs');
    });

    it('should detect React Docs from react.dev', () => {
      expect(detectResourceSource('https://react.dev/learn')).toBe('React Docs');
    });
  });

  describe('Coding platforms', () => {
    it('should detect LeetCode', () => {
      expect(detectResourceSource('https://leetcode.com/problems/two-sum')).toBe('LeetCode');
    });

    it('should detect HackerRank', () => {
      expect(detectResourceSource('https://www.hackerrank.com/challenges/problem')).toBe('HackerRank');
    });

    it('should detect Codewars', () => {
      expect(detectResourceSource('https://www.codewars.com/kata/12345')).toBe('Codewars');
    });
  });

  describe('General platforms', () => {
    it('should detect GitHub', () => {
      expect(detectResourceSource('https://github.com/user/repo')).toBe('GitHub');
    });

    it('should detect Stack Overflow', () => {
      expect(detectResourceSource('https://stackoverflow.com/questions/12345')).toBe('Stack Overflow');
    });
  });

  describe('Edge cases', () => {
    it('should return null for unknown URLs', () => {
      expect(detectResourceSource('https://example.com/article')).toBeNull();
    });

    it('should return null for invalid URLs', () => {
      expect(detectResourceSource('not-a-url')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(detectResourceSource('')).toBeNull();
    });

    it('should handle subdomains correctly', () => {
      expect(detectResourceSource('https://subdomain.medium.com/article')).toBe('Medium');
    });

    it('should be case-insensitive', () => {
      expect(detectResourceSource('https://WWW.YOUTUBE.COM/watch?v=abc')).toBe('YouTube');
    });
  });
});

describe('getResourceTypeIcon', () => {
  it('should return Play icon for video type', () => {
    expect(getResourceTypeIcon('video')).toBe(Play);
  });

  it('should return FileText icon for article type', () => {
    expect(getResourceTypeIcon('article')).toBe(FileText);
  });

  it('should return BookOpen icon for documentation type', () => {
    expect(getResourceTypeIcon('documentation')).toBe(BookOpen);
  });
});

describe('getResourceTypeColor', () => {
  it('should return red color class for video type', () => {
    expect(getResourceTypeColor('video')).toBe('text-red-500');
  });

  it('should return blue color class for article type', () => {
    expect(getResourceTypeColor('article')).toBe('text-blue-500');
  });

  it('should return green color class for documentation type', () => {
    expect(getResourceTypeColor('documentation')).toBe('text-green-500');
  });
});

describe('getResourceTypeLabel', () => {
  it('should return "Video" for video type', () => {
    expect(getResourceTypeLabel('video')).toBe('Video');
  });

  it('should return "Article" for article type', () => {
    expect(getResourceTypeLabel('article')).toBe('Article');
  });

  it('should return "Documentation" for documentation type', () => {
    expect(getResourceTypeLabel('documentation')).toBe('Documentation');
  });
});
