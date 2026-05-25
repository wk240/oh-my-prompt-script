import { describe, expect, it } from 'vitest'
import type { ProviderConfig } from '@oh-my-prompt/shared/types'
import { getAgentConfigAvailability, getOfficialQuota, getOfficialQuotaRemaining, isAgentConfigUsable } from '../agent-config-availability'

const officialConfig: ProviderConfig = {
  id: 'omp-official-default',
  providerId: 'omp_official',
  providerName: 'Oh My Prompt 官方服务',
  apiKey: '',
  apiEndpoint: '',
  apiFormat: 'omp_official',
  selectedModel: 'auto',
  configuredAt: 1,
  isCustom: false,
}

const thirdPartyConfig: ProviderConfig = {
  id: 'third-party',
  providerId: 'custom',
  providerName: 'Custom',
  apiKey: 'sk-test',
  apiEndpoint: 'https://api.example.com',
  apiFormat: 'chat_completions',
  selectedModel: 'test-model',
  configuredAt: 1,
  isCustom: true,
}

describe('isAgentConfigUsable', () => {
  it('treats official API as unavailable when logged out', () => {
    expect(isAgentConfigUsable([officialConfig], 'omp-official-default', false)).toBe(false)
  })

  it('treats official API as usable when logged in with quota remaining', () => {
    expect(isAgentConfigUsable([officialConfig], 'omp-official-default', true, 12)).toBe(true)
  })

  it('treats official API as unavailable when quota is exhausted', () => {
    expect(isAgentConfigUsable([officialConfig], 'omp-official-default', true, 0)).toBe(false)
  })

  it('keeps third-party API usable without official quota', () => {
    expect(isAgentConfigUsable([thirdPartyConfig], 'third-party', false, 0)).toBe(true)
  })
})

describe('getAgentConfigAvailability', () => {
  it('identifies exhausted FREE official quota as an upgrade state', () => {
    const subscription = {
      planType: 'free' as const,
      status: 'active' as const,
      officialApiQuota: { kind: 'trial' as const, used: 50, remaining: 0, limit: 50, resetsAt: null },
    }

    expect(getAgentConfigAvailability([officialConfig], 'omp-official-default', true, subscription)).toBe('free_quota_exhausted')
  })

  it('keeps exhausted paid official quota as a quota state instead of an upgrade-only state', () => {
    const subscription = {
      planType: 'pro' as const,
      status: 'active' as const,
      officialApiQuota: { kind: 'monthly' as const, used: 200, remaining: 0, limit: 200, resetsAt: '2026-06-01T00:00:00.000Z' },
    }

    expect(getAgentConfigAvailability([officialConfig], 'omp-official-default', true, subscription)).toBe('quota_exhausted')
  })

  it('keeps third-party API usable even when FREE official quota is exhausted', () => {
    const subscription = {
      planType: 'free' as const,
      status: 'active' as const,
      officialApiQuota: { kind: 'trial' as const, used: 50, remaining: 0, limit: 50, resetsAt: null },
    }

    expect(getAgentConfigAvailability([officialConfig, thirdPartyConfig], 'third-party', true, subscription)).toBe('usable')
  })
})

describe('official quota selection', () => {
  it('prefers official API quota over legacy optimization quota', () => {
    const subscription = {
      planType: 'free' as const,
      status: 'active' as const,
      officialApiQuota: { kind: 'trial' as const, used: 40, remaining: 10, limit: 50, resetsAt: null },
      optimizationQuota: { used: 0, remaining: 0, limit: 50 },
    }

    expect(getOfficialQuota(subscription)).toBe(subscription.officialApiQuota)
    expect(getOfficialQuotaRemaining(subscription)).toBe(10)
  })

  it('falls back to legacy optimization quota when official API quota is absent', () => {
    const subscription = {
      planType: 'free' as const,
      status: 'active' as const,
      optimizationQuota: { used: 50, remaining: 0, limit: 50 },
    }

    expect(getOfficialQuota(subscription)).toBe(subscription.optimizationQuota)
    expect(getOfficialQuotaRemaining(subscription)).toBe(0)
  })

  it('keeps missing quota unknown instead of fabricating exhaustion', () => {
    const subscription = {
      planType: 'free' as const,
      status: 'active' as const,
    }

    expect(getOfficialQuota(subscription)).toBeUndefined()
    expect(getOfficialQuotaRemaining(subscription)).toBeUndefined()
  })
})
