// lib/resourceUtils.ts - Learning resource utilities (source detection, type helpers)

import { Play, FileText, BookOpen, type LucideIcon } from 'lucide-react';
import type { ResourceType } from '@/types';

/**
 * URL patterns for auto-detecting resource sources
 * Matches hostname patterns to human-readable source names
 */
const SOURCE_PATTERNS: [RegExp, string][] = [
  // Video platforms
  [/youtube\.com|youtu\.be/, 'YouTube'],
  [/vimeo\.com/, 'Vimeo'],
  [/neetcode\.io/, 'NeetCode'],
  [/udemy\.com/, 'Udemy'],
  [/coursera\.org/, 'Coursera'],
  // Article platforms
  [/medium\.com/, 'Medium'],
  [/dev\.to/, 'Dev.to'],
  [/hashnode\.dev|hashnode\.com/, 'Hashnode'],
  [/substack\.com/, 'Substack'],
  [/freecodecamp\.org/, 'freeCodeCamp'],
  [/geeksforgeeks\.org/, 'GeeksforGeeks'],
  [/towardsdatascience\.com/, 'Towards Data Science'],
  // Documentation
  [/developer\.mozilla\.org/, 'MDN'],
  [/docs\.python\.org/, 'Python Docs'],
  [/typescriptlang\.org/, 'TypeScript Docs'],
  [/reactjs\.org|react\.dev/, 'React Docs'],
  // Coding platforms
  [/leetcode\.com/, 'LeetCode'],
  [/hackerrank\.com/, 'HackerRank'],
  [/codewars\.com/, 'Codewars'],
  // General
  [/github\.com/, 'GitHub'],
  [/stackoverflow\.com/, 'Stack Overflow'],
];

/**
 * Auto-detect the source name from a URL
 * @param url - URL to analyze
 * @returns Source name if detected, null otherwise
 */
export function detectResourceSource(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const [pattern, source] of SOURCE_PATTERNS) {
      if (pattern.test(hostname)) {
        return source;
      }
    }
    return null;
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Icon mapping for resource types
 */
const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  video: Play,
  article: FileText,
  documentation: BookOpen,
};

/**
 * Color class mapping for resource types
 */
const TYPE_COLORS: Record<ResourceType, string> = {
  video: 'text-red-500',
  article: 'text-blue-500',
  documentation: 'text-green-500',
};

/**
 * Get the Lucide icon component for a resource type
 * @param type - Resource type
 * @returns Lucide icon component
 */
export function getResourceTypeIcon(type: ResourceType): LucideIcon {
  return TYPE_ICONS[type];
}

/**
 * Get the color class for a resource type icon
 * @param type - Resource type
 * @returns Tailwind color class
 */
export function getResourceTypeColor(type: ResourceType): string {
  return TYPE_COLORS[type];
}

/**
 * Human-readable labels for resource types
 */
const TYPE_LABELS: Record<ResourceType, string> = {
  video: 'Video',
  article: 'Article',
  documentation: 'Documentation',
};

/**
 * Get the human-readable label for a resource type
 * @param type - Resource type
 * @returns Label string
 */
export function getResourceTypeLabel(type: ResourceType): string {
  return TYPE_LABELS[type];
}
