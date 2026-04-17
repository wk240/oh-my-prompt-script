/**
 * Shared utility functions for text processing and array operations
 */

import type { Category } from './types'

/**
 * Truncate text to a maximum length with ellipsis suffix
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Sort categories by their order field (immutable - returns new array)
 */
export function sortCategoriesByOrder(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.order - b.order)
}

/**
 * Create an event handler that stops propagation and calls the callback
 */
export function stopPropagationHandler<T extends (...args: unknown[]) => void>(fn: T): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }
}

/**
 * Fallback category order for unknown categories
 */
export const FALLBACK_CATEGORY_ORDER = 99