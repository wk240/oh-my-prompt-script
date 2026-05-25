import { WEB_APP_URL, SUPABASE_PROJECT_REF } from '@/lib/config'

const AUTH_STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`

export interface UploadCloudImageInput {
  imageId: string
  promptId: string
  blob: Blob
  hash: string
  width: number
  height: number
  size: number
}

export interface UploadCloudImageResult {
  success: boolean
  cloudUrl?: string
  cloudPath?: string
  size?: number
  error?: string
}

async function getAuthTokenDirect(): Promise<string | null> {
  const result = await chrome.storage.local.get(AUTH_STORAGE_KEY)
  const sessionData = result[AUTH_STORAGE_KEY]
  if (!sessionData) return null
  const session = JSON.parse(sessionData)
  if (!session.access_token || !session.expires_at) return null
  if (session.expires_at < Math.floor(Date.now() / 1000)) return null
  return session.access_token
}

export async function uploadCloudImage(input: UploadCloudImageInput): Promise<UploadCloudImageResult> {
  const token = await getAuthTokenDirect()
  if (!token) return { success: false, error: 'NOT_LOGGED_IN' }

  const formData = new FormData()
  formData.set('file', input.blob, `${input.imageId}.webp`)
  formData.set('imageId', input.imageId)
  formData.set('promptId', input.promptId)
  formData.set('hash', input.hash)
  formData.set('width', String(input.width))
  formData.set('height', String(input.height))
  formData.set('size', String(input.size))

  const response = await fetch(`${WEB_APP_URL}/api/images/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !body.success) {
    return { success: false, error: body.error || `HTTP_${response.status}` }
  }

  return {
    success: true,
    cloudUrl: body.data.cloudUrl,
    cloudPath: body.data.cloudPath,
    size: body.data.size
  }
}

export async function deleteCloudImage(imageId: string, cloudPath?: string): Promise<{ success: boolean; error?: string }> {
  const token = await getAuthTokenDirect()
  if (!token) return { success: false, error: 'NOT_LOGGED_IN' }

  const response = await fetch(`${WEB_APP_URL}/api/images/${encodeURIComponent(imageId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cloudPath })
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !body.success) {
    return { success: false, error: body.error || `HTTP_${response.status}` }
  }
  return { success: true }
}
