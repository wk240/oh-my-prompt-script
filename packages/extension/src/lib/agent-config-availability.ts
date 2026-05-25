import type { CloudAuthState, ProviderConfig } from '@oh-my-prompt/shared/types'

type SubscriptionQuota = NonNullable<CloudAuthState['subscription']>['officialApiQuota']
  | NonNullable<CloudAuthState['subscription']>['optimizationQuota']

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
  const isOfficialUsable = isLoggedIn && (officialQuotaRemaining === undefined || officialQuotaRemaining > 0)
  const activeConfig = activeConfigId
    ? configs.find(config => config.id === activeConfigId)
    : null

  if (activeConfig) {
    return activeConfig.apiFormat === 'omp_official' ? isOfficialUsable : true
  }

  return configs.some(config => config.apiFormat === 'omp_official') && isOfficialUsable
}
