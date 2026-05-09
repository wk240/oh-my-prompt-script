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

  // Build Supabase session object (must be JSON string for storage adapter)
  // Supabase expects this format for its storage adapter
  const sessionData = JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken || '',
    expires_in: expiresIn ? parseInt(expiresIn) : 3600,
    expires_at: expiresAt ? parseInt(expiresAt) : Math.floor(Date.now() / 1000) + 3600,
    token_type: tokenType || 'bearer',
    provider_token: providerToken || null
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

    // Show success message to user (replace web-app's default message)
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <h2 style="color: #22c55e;">登录成功</h2>
          <p style="color: #666;">请关闭此页面，返回扩展继续使用</p>
          <button onclick="window.close()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
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
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center;">
              <h2 style="color: #ef4444;">登录失败</h2>
              <p style="color: #666;">${errorMsg || errorCode || '未知错误'}</p>
              <button onclick="window.close()" style="margin-top: 16px; padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
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
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center;">
              <h2 style="color: #ef4444;">登录超时</h2>
              <p style="color: #666;">未收到认证信息，请重试</p>
              <button onclick="window.close()" style="margin-top: 16px; padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
                关闭页面
              </button>
            </div>
          </div>
        `
      }
    }
  }, 100)
}