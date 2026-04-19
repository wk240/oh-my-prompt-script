// Phase 2: Prompt types
export interface Prompt {
  id: string
  name: string
  content: string
  categoryId: string
  description?: string // Optional description for display in selection UI
  order: number // 分类内排序顺序
}

// Phase 3: Category types
export interface Category {
  id: string
  name: string
  order: number
}

// Phase 3: Storage schema
export interface StorageSchema {
  prompts: Prompt[]
  categories: Category[]
  version: string
}

// Phase 5: Network prompt types (D-08, D-09)
export interface NetworkPrompt extends Prompt {
  sourceProvider?: string // e.g., 'nano-banana'
  sourceCategory?: string // Original category from source
  previewImage?: string // Preview image URL (D-10: display logic deferred to Phase 7)
  sourceUrl?: string // Source attribution link
}

// Phase 5: Provider category metadata
export interface ProviderCategory {
  id: string // e.g., '3d-miniatures'
  name: string // e.g., '3D Miniatures & Dioramas'
  order: number // Display order (1-17)
  count: number // Number of prompts in category
}

// Phase 6: Network cache data structure (D-02, D-03)
export interface NetworkCacheData {
  prompts: NetworkPrompt[]
  categories: ProviderCategory[]
  fetchTimestamp: string // D-03: ISO 8601 format (e.g., '2026-04-19T12:00:00Z')
}

// Phase 6: Cache result with validity flag for TTL check
export interface CacheResult {
  valid: boolean
  data?: NetworkCacheData
  isExpired?: boolean // For UI indication and fallback scenarios
}