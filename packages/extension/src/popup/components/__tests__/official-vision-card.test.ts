import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '../../../..')

describe('OfficialVisionCard quota states', () => {
  it('does not fabricate exhausted quota while logged-in quota data is missing', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/popup/components/OfficialVisionCard.tsx'),
      'utf8',
    )

    expect(source).not.toContain('?? { remaining: 0')
    expect(source).toContain('!quota')
    expect(source).toContain('同步中')
    expect(source).toContain('quota.remaining <= 0')
  })
})
