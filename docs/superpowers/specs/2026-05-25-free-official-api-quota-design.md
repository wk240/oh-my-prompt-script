# FREE Official API Trial Quota Design

## Summary

Logged-in FREE users receive a one-time official API trial quota. They do not receive cloud sync. The goal is to let users experience the official API without turning FREE into a recurring cost center or weakening the Pro upgrade path.

Final product rule:

> 首次注册即赠送 50 次官方 API 体验额度，用完即止。

## Goals

- Let newly registered FREE users try the official Oh My Prompt API without configuring an API key.
- Keep cloud sync as a Pro/Team feature.
- Use one consistent quota model across extension popup, sidepanel, web dashboard, and API routes.
- Remove hardcoded frontend quota assumptions where backend status can provide the value.
- Preserve existing third-party API configuration behavior.

## Non-Goals

- Do not add new pricing sections or extra promotional blocks.
- Do not make FREE official API quota renew monthly.
- Do not grant cloud sync to FREE users.
- Do not merge leftover FREE trial quota into Pro/Team monthly quota after upgrade.

## Product Rules

### Anonymous User

- Can use local prompt management, resource library, import/export, and third-party API configuration.
- Cannot use official API.
- Cannot use cloud sync.

### Logged-In FREE User

- Receives 50 official API trial calls on first registration.
- Trial quota is one-time and does not renew.
- Trial quota is shared by official image-to-prompt and Prompt Agent features.
- Cloud sync remains unavailable.

### Pro User

- Receives monthly official API quota.
- Recommended quota: 200 calls per month.
- Supports cloud sync.
- Official image-to-prompt and Prompt Agent share the same monthly quota pool.

### Team User

- Receives monthly official API quota.
- Recommended quota: 1000 calls per month.
- Supports cloud sync and team features.
- Official image-to-prompt and Prompt Agent share the same monthly quota pool.

### Upgrade And Expiration

- When a FREE user upgrades, the UI switches to the paid monthly quota pool.
- Remaining FREE trial quota is not displayed or added on top of Pro/Team quota.
- When Pro/Team expires, the user falls back to FREE behavior:
  - Cloud sync is disabled.
  - Official API access depends only on remaining one-time trial quota.

## UI Design

Scope is limited to the existing API configuration switching area. Do not add new pricing cards, comparison blocks, or standalone quota explanation sections.

### Official API Config Card States

#### Not Logged In

- Badge/status: `需要登录`
- Description: `专业视觉模型，无需配置 API Key`
- Primary action: `登录后使用`

#### FREE With Trial Quota Remaining

- Quota text: `剩余 37/50 次`
- Description: `首次注册体验额度，用完即止。`
- Primary action: `切换到此配置`

#### FREE Trial Quota Exhausted

- Quota text: `0/50 次`
- Description: `体验额度已用完，升级后获得每月额度。`
- Primary action: `升级 Pro`

#### Pro Or Team With Quota Remaining

- Quota text:
  - Pro: `剩余 128/200 次`
  - Team: `剩余 820/1000 次`
- Description: `专业视觉模型，无需配置 API Key`
- Primary action:
  - inactive config: `切换到此配置`
  - active config: `已激活`

#### Pro Or Team Quota Exhausted

- Quota text:
  - Pro: `0/200 次`
  - Team: `0/1000 次`
- Description: `本月额度已用完，下月自动恢复`
- Primary action: disabled `额度已耗尽`
- Secondary action may link to a higher plan when applicable.

## Backend Quota Model

Use one backend-owned official API quota model and return it from status endpoints. Frontends should render returned values instead of hardcoding plan limits.

```ts
officialApiQuota: {
  kind: 'trial' | 'monthly'
  used: number
  remaining: number
  limit: number
  resetsAt: string | null
}
```

### Quota Semantics

- FREE:
  - `kind: 'trial'`
  - `limit: 50`
  - `resetsAt: null`
- Pro:
  - `kind: 'monthly'`
  - `limit: 200`
  - `resetsAt`: next monthly reset timestamp
- Team:
  - `kind: 'monthly'`
  - `limit: 1000`
  - `resetsAt`: next monthly reset timestamp

## API Behavior

### `/api/vision/generate`

- Requires login.
- Allows FREE users when one-time trial quota remains.
- Deducts FREE trial quota for FREE users.
- Deducts monthly official API quota for Pro/Team users.
- Rolls back quota if the downstream model request fails.
- Returns `QUOTA_EXCEEDED` when the relevant quota pool is exhausted.

### `/api/billing/status`

- Returns subscription status and `officialApiQuota`.
- Uses the same quota limit constants as `/api/vision/generate`.

### `/api/sync/status`

- Continues to return `cloudSyncEnabled: false` for FREE users.
- Returns `officialApiQuota` for display consistency.
- Does not use API quota availability to imply cloud sync access.

### Cloud Sync APIs

- Continue requiring active Pro/Team or inherited Team access.
- FREE login status alone is not enough for upload/download cloud sync.

## Data Model

Avoid using a single `optimization_quota_used` field to represent both one-time FREE trial quota and paid monthly quota.

Recommended persisted fields or equivalent table columns:

- `trial_quota_limit`: default `50`
- `trial_quota_used`: default `0`
- `trial_quota_granted_at`: timestamp set on registration or first quota record creation
- Existing paid monthly quota field can continue to track Pro/Team monthly usage.

Registration should create or initialize the user's FREE trial quota record so the extension can show `50/50` immediately after login.

## Existing Consistency Issues To Fix During Implementation

- Some extension code currently treats FREE quota as `0`.
- Some API/status routes use `Pro: 50, Team: 200`.
- Some subscription UI copy uses `Pro: 200, Team: 1000`.

Implementation should converge on:

- FREE trial: 50 one-time calls
- Pro monthly: 200 calls/month
- Team monthly: 1000 calls/month

## Testing

- FREE user with no usage can activate official config and sees `50/50`.
- FREE user after one official API call sees `49/50`.
- FREE user at `50/50` used receives `QUOTA_EXCEEDED` and sees upgrade CTA.
- FREE user cannot cloud sync even with remaining API trial quota.
- Pro user sees monthly quota and cloud sync enabled.
- Team user sees monthly quota and cloud sync enabled.
- Expired Pro user falls back to FREE trial quota behavior and cloud sync disabled.
- Backend rollback restores quota when downstream official API call fails.
