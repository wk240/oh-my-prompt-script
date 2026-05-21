/**
 * Agent message handler module
 * Handles AGENT_GENERATE message type for prompt enhancement
 */

import type { AgentGeneratePayload, AgentGenerateResult } from '@oh-my-prompt/shared/types'
import { MessageResponse } from '@oh-my-prompt/shared/messages'
import { executeAgentApiCall } from '../lib/agent-api'

/**
 * Handle AGENT_GENERATE message from content script or sidepanel
 * @param payload - Agent generation payload with input text and template category
 * @param sendResponse - Response callback for message reply
 * @returns true for async response (required by Chrome message API)
 */
export async function handleAgentGenerate(
  payload: AgentGeneratePayload,
  sendResponse: (response: MessageResponse<AgentGenerateResult>) => void
): Promise<boolean> {
  try {
    const result = await executeAgentApiCall(payload)
    sendResponse({ success: true, data: result })
  } catch (error) {
    console.error('[Oh My Prompt] Agent API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    sendResponse({ success: false, error: errorMessage })
  }
  return true // Async response
}