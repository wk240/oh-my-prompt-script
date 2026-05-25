import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteCloudImage, uploadCloudImage } from '../image-cloud-client'

vi.mock('@/lib/config', () => ({ WEB_APP_URL: 'https://oh-my-prompt.test', SUPABASE_PROJECT_REF: 'test-ref' }))

const uploadInput = {
  imageId: 'image-1',
  promptId: 'prompt-1',
  blob: new Blob(['abc'], { type: 'image/webp' }),
  hash: 'hash-1',
  width: 100,
  height: 80,
  size: 1000
}

describe('image-cloud-client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    global.chrome = {
      storage: {
        local: {
          get: vi.fn(async () => ({
            'sb-test-ref-auth-token': JSON.stringify({
              access_token: 'token',
              expires_at: Math.floor(Date.now() / 1000) + 3600
            })
          }))
        }
      }
    } as unknown as typeof chrome
  })

  it('uploads WebP image with metadata', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({
      success: true,
      data: {
        cloudUrl: 'https://blob/img.webp',
        cloudPath: 'users/u/images/image-1.webp',
        size: 1000
      }
    }), { status: 200 }))

    const result = await uploadCloudImage(uploadInput)

    expect(result.success).toBe(true)
    expect(fetch).toHaveBeenCalledWith('https://oh-my-prompt.test/api/images/upload', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer token' })
    }))
  })

  it('deletes cloud image with cloudPath payload', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }))

    const result = await deleteCloudImage('image-1', 'users/u/images/image-1.webp')

    expect(result.success).toBe(true)
    expect(fetch).toHaveBeenCalledWith('https://oh-my-prompt.test/api/images/image-1', expect.objectContaining({
      method: 'DELETE',
      body: JSON.stringify({ cloudPath: 'users/u/images/image-1.webp' })
    }))
  })

  it('returns not logged in for malformed auth storage', async () => {
    vi.mocked(chrome.storage.local.get).mockResolvedValueOnce({
      'sb-test-ref-auth-token': 'not-json'
    })

    const result = await uploadCloudImage(uploadInput)

    expect(result).toEqual({ success: false, error: 'NOT_LOGGED_IN' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns structured error when upload fetch rejects', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'))

    const result = await uploadCloudImage(uploadInput)

    expect(result).toEqual({ success: false, error: 'network down' })
  })

  it('returns structured error for malformed upload success body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }))

    const result = await uploadCloudImage(uploadInput)

    expect(result).toEqual({ success: false, error: 'MALFORMED_RESPONSE' })
  })

  it('returns structured error when delete fetch rejects', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'))

    const result = await deleteCloudImage('image-1', 'users/u/images/image-1.webp')

    expect(result).toEqual({ success: false, error: 'network down' })
  })
})
