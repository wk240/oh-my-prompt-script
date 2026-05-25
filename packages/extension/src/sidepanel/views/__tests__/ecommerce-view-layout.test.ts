import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '../../../..')

describe('EcommerceView result layout', () => {
  it('renders the result view as an exclusive panel instead of overlaying the form', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/sidepanel/views/EcommerceView.tsx'),
      'utf8',
    )
    const css = readFileSync(
      resolve(repoRoot, 'src/sidepanel/index.css'),
      'utf8',
    )

    expect(source).toContain("viewMode === 'form'")
    expect(source).toContain("viewMode === 'result'")
    expect(css).toMatch(/\.ecommerce-panel-result-view\s*\{[^}]*position:\s*relative;/s)
    expect(css).not.toMatch(/\.ecommerce-panel-result-view\s*\{[^}]*position:\s*absolute;/s)
  })
})
