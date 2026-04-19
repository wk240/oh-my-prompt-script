import { MessageType, MessageResponse, NetworkDataResponse, CacheDataResponse } from '../shared/messages'
import type { StorageSchema } from '../shared/types'
import { StorageManager } from '../lib/storage'
import { NanoBananaProvider } from '../lib/providers/nano-banana'
import { NetworkCacheManager } from '../lib/cache/network-cache'
import { NETWORK_TIMEOUT } from '../shared/constants'

console.log('[Prompt-Script] Service Worker started')

const storageManager = StorageManager.getInstance()
const nanoBananaProvider = new NanoBananaProvider()
const networkCacheManager = NetworkCacheManager.getInstance()

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    console.log('[Prompt-Script] Received message:', message.type)

    switch (message.type) {
      case MessageType.PING:
        sendResponse({ success: true, data: 'pong' } as MessageResponse<string>)
        break

      case MessageType.GET_STORAGE:
        storageManager.getData()
          .then(data => sendResponse({ success: true, data } as MessageResponse<StorageSchema>))
          .catch(error => {
            console.error('[Prompt-Script] GET_STORAGE error:', error)
            sendResponse({ success: false, error: 'Storage retrieval failed' })
          })
        return true // Required for async response

      case MessageType.SET_STORAGE:
        console.log('[Prompt-Script] SET_STORAGE payload:', message.payload)
        if (!message.payload) {
          console.error('[Prompt-Script] SET_STORAGE: No payload provided')
          sendResponse({ success: false, error: 'No payload provided' })
          return true
        }
        storageManager.saveData(message.payload as StorageSchema)
          .then(() => {
            console.log('[Prompt-Script] SET_STORAGE: Save successful')
            sendResponse({ success: true } as MessageResponse)
          })
          .catch(error => {
            console.error('[Prompt-Script] SET_STORAGE error:', error)
            sendResponse({ success: false, error: 'Storage save failed' })
          })
        return true // Required for async response

      case MessageType.INSERT_PROMPT:
        // Phase 2: Return success for content script acknowledgment
        // Phase 3 will add storage retrieval
        sendResponse({ success: true, data: message.payload } as MessageResponse)
        break

      case MessageType.OPEN_SETTINGS:
        // Open settings page in a new tab (bypasses ad blockers)
        chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/settings.html') })
          .then(() => sendResponse({ success: true } as MessageResponse))
          .catch(error => {
            console.error('[Prompt-Script] OPEN_SETTINGS error:', error)
            sendResponse({ success: false, error: 'Failed to open settings' })
          })
        return true // Required for async response

      case MessageType.FETCH_NETWORK_PROMPTS:
        // D-06: 10 second timeout with AbortController
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT)

        nanoBananaProvider.fetch(controller.signal)
          .then(rawData => {
            clearTimeout(timeoutId)
            const prompts = nanoBananaProvider.parse(rawData)
            const categories = nanoBananaProvider.getCategories()

            // D-07: Save to cache on network success
            networkCacheManager.saveCache(prompts, categories)
              .catch(err => console.error('[Prompt-Script] Cache save error:', err))

            console.log('[Prompt-Script] FETCH_NETWORK_PROMPTS: parsed', prompts.length, 'prompts')

            sendResponse({
              success: true,
              data: { prompts, categories, isFromCache: false }
            } as MessageResponse<NetworkDataResponse>)
          })
          .catch(async (error) => {
            clearTimeout(timeoutId)
            const errorMsg = error instanceof Error
              ? (error.name === 'AbortError' ? 'Request timeout' : error.message)
              : 'Network fetch failed'

            console.warn('[Prompt-Script] Network fetch failed:', errorMsg, '- checking cache')

            // D-08: Don't use navigator.onLine, rely on fetch failure
            // D-07: Fallback to cache
            const cacheResult = await networkCacheManager.getCache()

            if (cacheResult.data) {
              // Cache available (may be expired or valid)
              console.log('[Prompt-Script] Using cached data:', cacheResult.data.prompts.length, 'prompts',
                cacheResult.isExpired ? '(expired)' : '(valid)')

              sendResponse({
                success: true,
                data: {
                  prompts: cacheResult.data.prompts,
                  categories: cacheResult.data.categories,
                  isFromCache: true,
                  isExpired: cacheResult.isExpired || false
                }
              } as MessageResponse<NetworkDataResponse>)
            } else {
              // D-09: Cache empty and network failed - return error
              console.error('[Prompt-Script] No cache available, offline mode')
              sendResponse({
                success: false,
                error: 'Network unavailable and no cached data. Please try again when online.'
              })
            }
          })
        return true // Required for async response

      case MessageType.GET_NETWORK_CACHE:
        networkCacheManager.getCache()
          .then(cacheResult => {
            if (cacheResult.data) {
              // Cache exists (may be expired or valid)
              console.log('[Prompt-Script] GET_NETWORK_CACHE: returning', cacheResult.data.prompts.length, 'prompts',
                cacheResult.isExpired ? '(expired)' : '(valid)')
              sendResponse({
                success: true,
                data: {
                  prompts: cacheResult.data.prompts,
                  categories: cacheResult.data.categories,
                  isFromCache: true,
                  isExpired: cacheResult.isExpired || false,
                  fetchTimestamp: cacheResult.data.fetchTimestamp
                }
              } as MessageResponse<CacheDataResponse>)
            } else {
              // No cache available
              console.log('[Prompt-Script] GET_NETWORK_CACHE: no cached data')
              sendResponse({ success: false, error: 'No cached data available' })
            }
          })
          .catch(error => {
            console.error('[Prompt-Script] GET_NETWORK_CACHE error:', error)
            sendResponse({ success: false, error: 'Cache retrieval failed' })
          })
        return true // Required for async response

      default:
        sendResponse({ success: false, error: `Unknown message type: ${message.type}` })
    }

    return true // Required for async sendResponse
  }
)