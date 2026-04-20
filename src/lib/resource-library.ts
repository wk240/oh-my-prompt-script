/**
 * Resource Library Loader
 * Loads built-in prompt library from local JSON data
 */

import type { ResourcePrompt, ResourceCategory } from '../shared/types'

// Import the parsed JSON data
import resourceData from '../data/resource-library/prompts.json'

export interface ResourceLibraryData {
  version: string
  source: string
  fetchedAt: string
  prompts: ResourcePrompt[]
  categories: ResourceCategory[]
}

/**
 * Get all resource prompts
 */
export function getResourcePrompts(): ResourcePrompt[] {
  return (resourceData as ResourceLibraryData).prompts
}

/**
 * Get all resource categories
 */
export function getResourceCategories(): ResourceCategory[] {
  return (resourceData as ResourceLibraryData).categories
}

/**
 * Get full resource library data
 */
export function getResourceLibraryData(): ResourceLibraryData {
  return resourceData as ResourceLibraryData
}

/**
 * Filter prompts by category
 */
export function filterPromptsByCategory(categoryId: string): ResourcePrompt[] {
  const prompts = getResourcePrompts()
  if (categoryId === 'all') {
    return prompts
  }
  return prompts.filter(p => p.categoryId === categoryId || p.sourceCategory === categoryId)
}

/**
 * Search prompts by query (name + content)
 */
export function searchResourcePrompts(query: string): ResourcePrompt[] {
  const prompts = getResourcePrompts()
  const lowerQuery = query.toLowerCase()
  return prompts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.content.toLowerCase().includes(lowerQuery)
  )
}