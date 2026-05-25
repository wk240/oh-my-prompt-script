import { describe, expect, it } from 'vitest'
import { buildAgentSystemPrompt } from '../agent-templates'

describe('buildAgentSystemPrompt', () => {
  it('requires general Agent responses to use the structured JSON layout', () => {
    const prompt = buildAgentSystemPrompt('general', false)

    expect(prompt).toContain('请严格输出 JSON')
    expect(prompt).toContain('"prompt": "可直接用于图片生成的一整段完整提示词"')
    expect(prompt).toContain('"sections"')
    expect(prompt).toContain('"subject"')
    expect(prompt).toContain('"negativePrompt"')
  })
})
