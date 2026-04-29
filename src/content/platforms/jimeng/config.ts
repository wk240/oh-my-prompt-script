/**
 * 即梦 Platform Config (国内设计平台)
 */

import type { PlatformConfig } from '../base/types'

export const jimengConfig: PlatformConfig = {
  id: 'jimeng',
  name: '即梦',

  urlPatterns: [
    { type: 'domain', value: 'jimeng.jianying.com' },
  ],

  inputDetection: {
    selectors: [
      'textarea[placeholder*="描述"]',
      'textarea[placeholder*="提示"]',
      'div[contenteditable="true"]',
    ],
  },

  uiInjection: {
    anchorSelector: '.prompt-input-area',
    position: 'append',
  },
}