import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '../../../..')

vi.mock('../../../lib/sync/image-asset-service', () => ({
  savePromptImageAsset: vi.fn(async () => ({
    success: true,
    imageId: 'image-1',
    localPath: 'images/image-1.webp'
  })),
  deletePromptImageAsset: vi.fn(async () => undefined),
  getDisplayUrl: vi.fn(async () => 'blob:asset')
}))

describe('PromptEditModal category handling', () => {
  it('allows adding a prompt without selecting a category', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/content/components/PromptEditModal.tsx'),
      'utf8',
    )

    expect(source).toContain('if (!trimmedName || !trimmedContent) return')
    expect(source).toContain('setCategoryId(defaultCategoryId || \'\')')
    expect(source).toContain('const isValid = name.trim() && content.trim() && (!isTemporary || categoryId)')
    expect(source).toContain('<option value="">无分类</option>')
    expect(source).not.toContain('if (!trimmedName || !trimmedContent || !categoryId) return')
  })

  it('uses the image asset service for upload, delete, and display URL handling', async () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/content/components/PromptEditModal.tsx'),
      'utf8',
    )
    const { savePromptImageAsset } = await import('../../../lib/sync/image-asset-service')

    expect(source).toContain('savePromptImageAsset({')
    expect(source).toContain('deletePromptImageAsset(')
    expect(source).toContain('getDisplayUrl(prompt)')
    expect(source).toContain('sourceUrl: imageUrlInput.trim()')
    expect(source).not.toContain('saveImage(')
    expect(savePromptImageAsset).toHaveBeenCalledTimes(0)
  })
})
