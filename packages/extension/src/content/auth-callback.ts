/**
 * Auth Callback Content Script
 *
 * Runs on OAuth callback pages to extract tokens from URL and save to extension storage.
 * This bridges the gap between web-app OAuth and extension Supabase client.
 *
 * URL format: /auth/callback#access_token=xxx&refresh_token=xxx&...
 *
 * Timing: Web-app returns HTML with JavaScript that injects tokens into hash.
 * We need to wait for the hash to be set before extracting tokens.
 */

console.log('[Oh My Prompt] Auth callback script loaded')

// Supabase project reference (extracted from URL)
const SUPABASE_PROJECT_REF = 'futfxudabvjfldlismun'

/**
 * Decode JWT access token to extract user info.
 * Supabase JWT contains user metadata in the claims.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Decode payload (base64url)
    const payload = parts[1]
    // Replace URL-safe base64 chars with standard base64 chars
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)

    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch (e) {
    console.error('[Oh My Prompt] Failed to decode JWT:', e)
    return null
  }
}

function extractAndSaveTokens(): boolean {
  // Extract tokens from URL hash
  const hash = window.location.hash.substring(1) // Remove '#'
  if (!hash) {
    return false
  }

  const params = new URLSearchParams(hash)

  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  const expiresAt = params.get('expires_at')
  const expiresIn = params.get('expires_in')
  const tokenType = params.get('token_type')
  const providerToken = params.get('provider_token')

  if (!accessToken) {
    console.log('[Oh My Prompt] No access token in hash yet')
    return false
  }

  console.log('[Oh My Prompt] Found access token, saving to storage...')

  // Decode JWT to get user info
  const jwtPayload = decodeJwtPayload(accessToken)
  const userId = (jwtPayload?.sub as string) || ''
  const userEmail = (jwtPayload?.email as string) || ''

  // Extract user metadata from JWT claims
  const userMetadata = jwtPayload?.user_metadata as Record<string, unknown> | undefined
  const appMetadata = jwtPayload?.app_metadata as Record<string, unknown> | undefined

  // Build Supabase session object (must be JSON string for storage adapter)
  // Supabase expects this format for its storage adapter
  const sessionData = JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken || '',
    expires_in: expiresIn ? parseInt(expiresIn) : 3600,
    expires_at: expiresAt ? parseInt(expiresAt) : Math.floor(Date.now() / 1000) + 3600,
    token_type: tokenType || 'bearer',
    provider_token: providerToken || null,
    // Include user object for auth-service.ts compatibility
    user: {
      id: userId,
      email: userEmail,
      aud: jwtPayload?.aud || 'authenticated',
      role: jwtPayload?.role || 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: userMetadata || {},
      app_metadata: appMetadata || {},
      is_anonymous: false
    }
  })

  // Save to chrome.storage.local with Supabase's expected key format
  // Key format: sb-{projectRef}-auth-token
  const storageKey = `sb-${SUPABASE_PROJECT_REF}-auth-token`

  chrome.storage.local.set({
    [storageKey]: sessionData
  }, () => {
    console.log('[Oh My Prompt] Session saved to storage with key:', storageKey)

    // Notify background script that auth completed
    chrome.runtime.sendMessage({
      type: 'AUTH_CALLBACK_COMPLETE',
      payload: { success: true }
    }).catch(err => {
      console.warn('[Oh My Prompt] Failed to notify background:', err)
    })

    // Show success message to user (DESIGN.md minimalist style)
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; background: #FFFFFF;">
        <div style="text-align: center; padding: 32px 40px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 48px rgba(0,0,0,0.25); max-width: 400px;">
          <div style="width: 48px; height: 48px; margin: 0 auto 24px auto;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <h2 style="color: #171717; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">登录成功</h2>
          <p style="color: #64748B; font-size: 12px; font-weight: 500; margin: 0 0 24px 0;">云端同步已激活<br/>请关闭此页面返回扩展继续使用</p>
          <button onclick="window.close()" style="padding: 8px 24px; background: #171717; color: #FFFFFF; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;">
            关闭页面
          </button>
        </div>
      </div>
    `
  })

  return true
}

// Try immediate extraction (if hash already set)
if (extractAndSaveTokens()) {
  // Success, tokens extracted immediately
} else {
  // Hash not ready yet, wait for it
  console.log('[Oh My Prompt] Waiting for tokens in hash...')

  // Listen for hashchange event (when web-app's JavaScript sets the hash)
  const handleHashChange = () => {
    if (extractAndSaveTokens()) {
      // Success, remove listener
      window.removeEventListener('hashchange', handleHashChange)
    }
  }

  window.addEventListener('hashchange', handleHashChange)

  // Also poll periodically as fallback (in case hashchange doesn't fire)
  let pollCount = 0
  const maxPolls = 50 // Poll for up to 5 seconds (100ms interval)
  const pollInterval = setInterval(() => {
    pollCount++
    if (extractAndSaveTokens()) {
      clearInterval(pollInterval)
      window.removeEventListener('hashchange', handleHashChange)
    } else if (pollCount >= maxPolls) {
      clearInterval(pollInterval)
      window.removeEventListener('hashchange', handleHashChange)

      // Timeout - check for error in hash
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const errorCode = params.get('error_code')
      const errorMsg = params.get('error_description') || params.get('error') || params.get('msg')

      if (errorCode || errorMsg) {
        console.error('[Oh My Prompt] Auth error:', errorCode, errorMsg)

        chrome.runtime.sendMessage({
          type: 'AUTH_CALLBACK_COMPLETE',
          payload: { success: false, error: errorMsg || errorCode }
        }).catch(err => {
          console.warn('[Oh My Prompt] Failed to notify background:', err)
        })

        document.body.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; background: #FFFFFF;">
            <div style="text-align: center; padding: 32px 40px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 48px rgba(0,0,0,0.25); max-width: 400px;">
              <div style="width: 48px; height: 48px; margin: 0 auto 24px auto;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h2 style="color: #171717; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">登录失败</h2>
              <p style="color: #64748B; font-size: 12px; font-weight: 500; margin: 0 0 24px 0;">${errorMsg || errorCode || '未知错误'}</p>
              <button onclick="window.close()" style="padding: 8px 24px; background: #171717; color: #FFFFFF; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;">
                关闭页面
              </button>
            </div>
          </div>
        `
      } else {
        console.error('[Oh My Prompt] Auth timeout - no tokens received')

        chrome.runtime.sendMessage({
          type: 'AUTH_CALLBACK_COMPLETE',
          payload: { success: false, error: '登录超时，未收到认证信息' }
        }).catch(err => {
          console.warn('[Oh My Prompt] Failed to notify background:', err)
        })

        document.body.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; background: #FFFFFF;">
            <div style="text-align: center; padding: 32px 40px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 48px rgba(0,0,0,0.25); max-width: 400px;">
              <div style="width: 48px; height: 48px; margin: 0 auto 24px auto;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h2 style="color: #171717; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">登录超时</h2>
              <p style="color: #64748B; font-size: 12px; font-weight: 500; margin: 0 0 24px 0;">未收到认证信息，请重试</p>
              <button onclick="window.close()" style="padding: 8px 24px; background: #171717; color: #FFFFFF; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;">
                关闭页面
              </button>
            </div>
          </div>
        `
      }
    }
  }, 100)
}