/**
 * Prompts.chat API Client
 * All requests go through Service Worker to bypass CORS
 */

import { MessageType } from '../shared/messages'
import type { OnlinePrompt, OnlineCategory, PromptsChatResponse } from '../shared/types'
import type { Prompt } from '../shared/types'
import { truncateText } from '../shared/utils'

// Predefined categories relevant to Lovart AI users
export const PREDEFINED_ONLINE_CATEGORIES: OnlineCategory[] = [
  {
    id: 'cmj1yryrn000vt5als6r4vbgn',
    name: 'Image Generation',
    slug: 'image-generation',
    description: 'AI image prompts',
    order: 1
  },
  {
    id: 'cmju78wpz0004l704nql7qwli',
    name: 'Video Generation',
    slug: 'video-generation',
    description: 'AI video prompts',
    order: 2
  },
  {
    id: 'cmmnlanki0004l204gai1zuii',
    name: 'Design',
    slug: 'design',
    description: 'Design prompts',
    order: 3
  },
  {
    id: 'cmj1yryoz0005t5albvxi3aw8',
    name: 'Coding',
    slug: 'coding',
    description: 'Programming prompts',
    order: 4
  },
  {
    id: 'cmj1yrypb0006t5alt679jsqo',
    name: 'Writing',
    slug: 'writing',
    description: 'Writing prompts',
    order: 5
  }
]

/**
 * Search prompts by keyword
 */
export async function searchOnlinePrompts(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<PromptsChatResponse> {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.FETCH_ONLINE_PROMPTS,
    payload: {
      endpoint: 'search',
      query,
      page,
      perPage
    }
  })

  if (!response?.success) {
    throw new Error(response?.error || 'Failed to search prompts')
  }

  return response.data as PromptsChatResponse
}

/**
 * Get prompts by category ID
 */
export async function getOnlinePromptsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 20
): Promise<PromptsChatResponse> {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.FETCH_ONLINE_PROMPTS,
    payload: {
      endpoint: 'category',
      categoryId,
      page,
      perPage
    }
  })

  if (!response?.success) {
    throw new Error(response?.error || 'Failed to fetch category prompts')
  }

  return response.data as PromptsChatResponse
}

/**
 * Get single prompt by ID
 */
export async function getOnlinePromptById(id: string): Promise<OnlinePrompt> {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.FETCH_ONLINE_PROMPTS,
    payload: {
      endpoint: 'detail',
      promptId: id
    }
  })

  if (!response?.success) {
    throw new Error(response?.error || 'Failed to fetch prompt')
  }

  return response.data as OnlinePrompt
}

/**
 * Convert OnlinePrompt to local Prompt format
 */
export function convertOnlinePromptToLocal(
  online: OnlinePrompt,
  categoryId: string
): Omit<Prompt, 'id'> {
  return {
    name: online.title,
    content: online.content,
    categoryId: categoryId,
    description: online.description || truncateText(online.content, 100),
    order: 0
  }
}