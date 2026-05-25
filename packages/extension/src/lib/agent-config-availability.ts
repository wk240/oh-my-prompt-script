import type { CloudAuthState, ProviderConfig } from '@oh-my-prompt/shared/types'

type SubscriptionQuota = NonNullable<CloudAuthState['subscription']>['officialApiQuota']
  | NonNullable<CloudAuthState['subscription']>['optimizationQuota']

export type AgentConfigAvailability =
  | 'usable'
  | 'login_required'
  | 'config_required'
  | 'free_quota_exhausted'
  | 'quota_exhausted'

export function getOfficialQuota(subscription: CloudAuthState['subscription'] | null | undefined): SubscriptionQuota | undefined {
  return subscription?.officialApiQuota ?? subscription?.optimizationQuota
}

export function getOfficialQuotaRemaining(subscription: CloudAuthState['subscription'] | null | undefined): number | undefined {
  return getOfficialQuota(subscription)?.remaining
}

export function isAgentConfigUsable(
  configs: ProviderConfig[],
  activeConfigId: string | null,
  isLoggedIn: boolean,
  officialQuotaRemaining?: number
): boolean {
  const subscription = officialQuotaRemaining === undefined
    ? undefined
    : {
        planType: 'pro' as const,
        status: 'active' as const,
        officialApiQuota: { kind: 'monthly' as const, used: 0, remaining: officialQuotaRemaining, limit: officialQuotaRemaining, resetsAt: null },
      }

  return getAgentConfigAvailability(configs, activeConfigId, isLoggedIn, subscription) === 'usable'
}

export function getAgentConfigAvailability(
  configs: ProviderConfig[],
  activeConfigId: string | null,
  isLoggedIn: boolean,
  subscription?: CloudAuthState['subscription'] | null
): AgentConfigAvailability {
  const quota = getOfficialQuota(subscription)
  const isOfficialUsable = isLoggedIn && (quota?.remaining === undefined || quota.remaining > 0)
  const activeConfig = activeConfigId
    ? configs.find(config => config.id === activeConfigId)
    : null

  if (activeConfig) {
    if (activeConfig.apiFormat !== 'omp_official') {
      return 'usable'
    }

    if (!isLoggedIn) {
      return 'login_required'
    }

    if (isOfficialUsable) {
      return 'usable'
    }

    return subscription?.planType === 'free' ? 'free_quota_exhausted' : 'quota_exhausted'
  }

  const hasOfficialConfig = configs.some(config => config.apiFormat === 'omp_official')

  if (!hasOfficialConfig) {
    return 'config_required'
  }

  if (!isLoggedIn) {
    return 'login_required'
  }

  if (isOfficialUsable) {
    return 'usable'
  }

  return subscription?.planType === 'free' ? 'free_quota_exhausted' : 'quota_exhausted'
}
