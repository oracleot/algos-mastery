import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a UUID v4 for unique identifiers
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Normalize a URL for comparison.
 * Handles variations in LeetCode URLs for duplicate detection.
 * @param url - The URL to normalize
 * @returns Normalized URL (lowercase, no trailing slash, no query params)
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove trailing slashes and convert to lowercase
    return urlObj.origin.toLowerCase() + urlObj.pathname.toLowerCase().replace(/\/+$/, '');
  } catch {
    // If URL parsing fails, just do basic normalization
    return url.toLowerCase().replace(/\/+$/, '').replace(/\?.*$/, '');
  }
}
