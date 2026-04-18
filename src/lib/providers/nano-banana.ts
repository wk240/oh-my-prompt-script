/**
 * NanoBananaProvider
 * Implementation for Nano Banana Prompts GitHub data source (Phase 5)
 *
 * Data source: https://github.com/devanshug2307/Awesome-Nano-Banana-Prompts
 * Contains 900+ image generation prompts across 17 categories
 *
 * Design decisions:
 * - D-04: GitHub Raw URL direct request (no API key)
 * - D-05: URL = https://raw.githubusercontent.com/devanshug2307/Awesome-Nano-Banana-Prompts/main/README.md
 * - D-07: No extra headers, use browser default behavior
 */

import type { NetworkPrompt, ProviderCategory } from '@/shared/types'
import type { DataSourceProvider } from './base'

const NANO_BANANA_URL = 'https://raw.githubusercontent.com/devanshug2307/Awesome-Nano-Banana-Prompts/main/README.md'

/**
 * NanoBananaProvider implementation
 */
export class NanoBananaProvider implements DataSourceProvider {
  readonly id = 'nano-banana'
  readonly name = 'Nano Banana Prompts'
  readonly dataUrl = NANO_BANANA_URL

  /**
   * Fetch raw markdown from GitHub Raw URL (D-04, D-05, D-07)
   * Note: Network timeout handled by service worker (Plan 03)
   */
  async fetch(): Promise<string> {
    const response = await fetch(this.dataUrl)
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }

  /**
   * Parse README markdown into NetworkPrompt array
   * Implementation in Task 2
   */
  parse(rawData: string): NetworkPrompt[] {
    // TODO: Implement in Task 2
    return []
  }

  /**
   * Get predefined categories from Nano Banana source
   * Implementation in Task 3
   */
  getCategories(): ProviderCategory[] {
    // TODO: Implement in Task 3
    return []
  }
}