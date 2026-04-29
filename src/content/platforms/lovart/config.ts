/**
 * Lovart Platform Config
 */

import type { PlatformConfig } from '../base/types'
import { LovartInserter } from './strategies'

export const lovartConfig: PlatformConfig = {
  id: 'lovart',
  name: 'Lovart',

  urlPatterns: [
    { type: 'domain', value: 'lovart.ai' },
  ],

  inputDetection: {
    selectors: [
      '[data-testid="agent-message-input"]',
      '[data-lexical-editor="true"]',
      'div[contenteditable="true"][role="textbox"]',
    ],
    debounceMs: 100,
  },

  uiInjection: {
    anchorSelector: '[data-testid="agent-input-bottom-more-button"]',
    position: 'before',
  },

  strategies: {
    inserter: new LovartInserter(),
  },
}