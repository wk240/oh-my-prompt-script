/**
 * 即梦 Platform Config (国内设计平台)
 */

import type { PlatformConfig } from '../base/types'
import { JimengButton } from './JimengButton'

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
    anchorSelector: '.toolbar-settings-content-AqQb52',
    position: 'append',
    customButton: JimengButton,
  },
}