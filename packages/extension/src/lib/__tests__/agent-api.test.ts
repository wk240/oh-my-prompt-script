import { describe, expect, it } from 'vitest'
import { extractAgentTextContent } from '../agent-api'

describe('extractAgentTextContent', () => {
  it('extracts chat completion text from content blocks', () => {
    const text = extractAgentTextContent('chat_completions', {
      choices: [
        {
          message: {
            content: [
              { type: 'text', text: 'First prompt' },
              { type: 'output_text', text: 'Second prompt' },
            ],
          },
        },
      ],
    })

    expect(text).toBe('First prompt\nSecond prompt')
  })

  it('extracts responses output_text content', () => {
    const text = extractAgentTextContent('openai_responses', {
      output_text: 'Structured ecommerce prompts',
    })

    expect(text).toBe('Structured ecommerce prompts')
  })
})
