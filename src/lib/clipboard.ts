// lib/clipboard.ts - Clipboard utility functions

/**
 * Copy text to clipboard using the modern Clipboard API
 * Falls back to a textarea-based approach for older browsers
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy is successful
 * @throws Error if copy fails
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Try the modern Clipboard API first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to fallback method
    }
  }

  // Fallback for older browsers or when Clipboard API fails
  return fallbackCopy(text);
}

/**
 * Fallback copy method using a temporary textarea element
 * @param text - The text to copy
 */
function fallbackCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Make the textarea invisible but keep it in the DOM
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      
      const successful = document.execCommand('copy');
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('Failed to copy text to clipboard'));
      }
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Failed to copy text to clipboard'));
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

/**
 * Check if clipboard API is available
 * @returns true if clipboard write is supported
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function');
}
