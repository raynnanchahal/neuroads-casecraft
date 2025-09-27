/**
 * Utility functions for text processing and cleaning
 */

/**
 * Removes HTML tags from text and converts to clean paragraphs
 */
export function cleanHtmlText(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags but preserve line breaks
  let cleaned = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Clean up extra whitespace and line breaks
  cleaned = cleaned
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .trim();
  
  return cleaned;
}

/**
 * Converts cleaned text to React-friendly paragraphs
 */
export function textToParagraphs(text: string): string[] {
  if (!text) return [];
  
  return text
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}