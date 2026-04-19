import type { NetworkPrompt, ProviderCategory } from './types'

export enum MessageType {
  PING = 'PING',
  GET_STORAGE = 'GET_STORAGE',
  SET_STORAGE = 'SET_STORAGE',
  INSERT_PROMPT = 'INSERT_PROMPT',
  OPEN_SETTINGS = 'OPEN_SETTINGS',
  // Phase 5: Network prompts
  FETCH_NETWORK_PROMPTS = 'FETCH_NETWORK_PROMPTS',
  // Phase 6: Network cache
  GET_NETWORK_CACHE = 'GET_NETWORK_CACHE'
}

export interface Message<T = unknown> {
  type: MessageType
  payload?: T
}

export interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Phase 5: Network prompt request payload
export interface FetchNetworkPromptsPayload {
  providerId?: string // Optional: defaults to 'nano-banana'
}

// Phase 5: Network prompt response payload
export interface NetworkDataResponse {
  prompts: NetworkPrompt[]
  categories: ProviderCategory[]
}

// Phase 6: Cache data response with metadata flags
export interface CacheDataResponse {
  prompts: NetworkPrompt[]
  categories: ProviderCategory[]
  isFromCache: boolean // Always true for GET_NETWORK_CACHE
  isExpired?: boolean   // True if cache TTL exceeded
  fetchTimestamp?: string // ISO timestamp for UI display (Phase 7)
}