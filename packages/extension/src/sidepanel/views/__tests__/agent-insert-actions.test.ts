import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '../../../..')

describe('Agent sidepanel insert actions', () => {
  it('wires normal Agent results to the shared one-click insert callback', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/sidepanel/views/AgentView.tsx'),
      'utf8',
    )

    expect(source).toContain('onInsert?: (text: string) => Promise<void>')
    expect(source).toContain('const handleInsert = useCallback(async () => {')
    expect(source).toContain('await onInsert(result)')
    expect(source).toContain('Tooltip content="插入"')
  })

  it('wires ecommerce Agent single prompts and bundles to one-click insert', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/sidepanel/views/EcommerceView.tsx'),
      'utf8',
    )

    expect(source).toContain('onInsert?: (text: string) => Promise<void>')
    expect(source).toContain('await onInsert(text)')
    expect(source).toContain('await onInsert(bundle)')
    expect(source).toContain('aria-label="插入"')
    expect(source).toContain('插入全部')
  })

  it('passes the shared sidepanel insert function into both Agent views', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/sidepanel/views/PromptListView.tsx'),
      'utf8',
    )

    expect(source).toContain('const insertTextToCurrentTab = useCallback(async (text: string')
    expect(source).toContain('onInsert={insertTextToCurrentTab}')
  })
})
