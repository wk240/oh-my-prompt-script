import type { NetworkPrompt, ProviderCategory, NetworkCacheData, CacheResult } from '@/shared/types'
import { NETWORK_CACHE_KEY, CACHE_TTL_MS } from '@/shared/constants'

/**
 * NetworkCacheManager singleton class for managing network prompt cache
 * Phase 6: Implements 24-hour TTL cache for offline access (NET-04)
 */
export class NetworkCacheManager {
  private static instance: NetworkCacheManager

  /**
   * Get singleton instance of NetworkCacheManager
   */
  static getInstance(): NetworkCacheManager {
    if (!NetworkCacheManager.instance) {
      NetworkCacheManager.instance = new NetworkCacheManager()
    }
    return NetworkCacheManager.instance
  }

  /**
   * D-05: Get cache with TTL validation on read
   * Returns CacheResult with validity flag and optional expired data for fallback
   */
  async getCache(): Promise<CacheResult> {
    try {
      const result = await chrome.storage.local.get(NETWORK_CACHE_KEY)
      const cacheData = result[NETWORK_CACHE_KEY] as NetworkCacheData | undefined

      if (!cacheData) {
        console.log('[Prompt-Script] No network cache found')
        return { valid: false } // No cache exists
      }

      // D-06: Check expiry (24 hours = 86,400,000 ms)
      if (this.isExpired(cacheData.fetchTimestamp)) {
        // D-07: Return expired cache for fallback scenarios
        console.log('[Prompt-Script] Cache expired, returning for fallback use')
        return { valid: false, data: cacheData, isExpired: true }
      }

      console.log('[Prompt-Script] Cache valid:', cacheData.prompts.length, 'prompts')
      return { valid: true, data: cacheData }
    } catch (error) {
      console.error('[Prompt-Script] Cache read error:', error)
      return { valid: false }
    }
  }

  /**
   * D-04, D-06: TTL check - 24 hours = 86,400,000 ms
   * Uses Date.getTime() for numeric comparison (handles timezone correctly)
   */
  private isExpired(fetchTimestamp: string): boolean {
    const fetchTime = new Date(fetchTimestamp).getTime()
    const currentTime = Date.now()
    return (currentTime - fetchTime) > CACHE_TTL_MS
  }

  /**
   * Save cache with current timestamp (D-03: ISO format)
   */
  async saveCache(prompts: NetworkPrompt[], categories: ProviderCategory[]): Promise<void> {
    const cacheData: NetworkCacheData = {
      prompts,
      categories,
      fetchTimestamp: new Date().toISOString() // D-03: ISO 8601 format
    }

    try {
      await chrome.storage.local.set({ [NETWORK_CACHE_KEY]: cacheData })
      console.log('[Prompt-Script] Cache saved:', prompts.length, 'prompts')
    } catch (error) {
      console.error('[Prompt-Script] Cache save error:', error)
      throw error
    }
  }

  /**
   * Clear cache (for Phase 7 manual refresh support)
   */
  async clearCache(): Promise<void> {
    try {
      await chrome.storage.local.remove(NETWORK_CACHE_KEY)
      console.log('[Prompt-Script] Cache cleared')
    } catch (error) {
      console.error('[Prompt-Script] Cache clear error:', error)
    }
  }
}

// Export singleton instance for convenience
export const networkCacheManager = NetworkCacheManager.getInstance()