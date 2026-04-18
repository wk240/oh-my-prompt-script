/**
 * NanoBananaProvider
 * Implementation for Nano Banana Prompts GitHub data source (Phase 5)
 *
 * Data source: https://github.com/devanshug2307/Awesome-Nano-Banana-Prompts
 * Contains 900+ image generation prompts across 17 categories
 *
 * Design decisions:
 * - D-04: GitHub Raw URL direct request (no API key)
 * - D-05: URL = https://raw.githubusercontent.com/devanshug2307/Awesome-Nano-Banana-Prompts/main/README.md
 * - D-07: No extra headers, use browser default behavior
 */

import type { NetworkPrompt, ProviderCategory } from '@/shared/types'
import type { DataSourceProvider } from './base'

const NANO_BANANA_URL = 'https://raw.githubusercontent.com/devanshug2307/Awesome-Nano-Banana-Prompts/main/README.md'

/**
 * NanoBananaProvider implementation
 */
export class NanoBananaProvider implements DataSourceProvider {
  readonly id = 'nano-banana'
  readonly name = 'Nano Banana Prompts'
  readonly dataUrl = NANO_BANANA_URL

  /**
   * Fetch raw markdown from GitHub Raw URL (D-04, D-05, D-07)
   * Note: Network timeout handled by service worker (Plan 03)
   */
  async fetch(): Promise<string> {
    const response = await fetch(this.dataUrl)
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }

  /**
   * Parse README markdown into NetworkPrompt array
   *
   * README structure:
   * - ## {number}. {emoji} {category name}
   * - ### {number}.{sub-number}. {prompt title}
   * - ![title](image_url)
   * - **Prompt:** followed by ``` code block
   * - **Source:** [name](url)
   */
  parse(rawData: string): NetworkPrompt[] {
    const prompts: NetworkPrompt[] = []
    const lines = rawData.split('\n')

    let currentCategory: { id: string; name: string; order: number } | null = null
    let currentPromptIndex = 0

    // Regex patterns
    const categoryRegex = /^## (\d+)\. .+ (.+)$/
    const promptHeaderRegex = /^### (\d+)\.(\d+)\. (.+)$/
    const imageRegex = /^!\[.*?\]\((.+?)\)$/
    const sourceRegex = /^\*\*Source:\*\*\s*\[.+?\]\((.+?)\)$/
    const promptStartRegex = /^\*\*Prompt:\*\*\s*$/

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Match category header
      const categoryMatch = line.match(categoryRegex)
      if (categoryMatch) {
        const order = parseInt(categoryMatch[1], 10)
        const name = categoryMatch[2].trim()
        currentCategory = {
          id: this.generateCategoryId(name),
          name,
          order
        }
        continue
      }

      // Match prompt header
      const promptMatch = line.match(promptHeaderRegex)
      if (promptMatch && currentCategory) {
        const categoryNum = parseInt(promptMatch[1], 10)
        const subNum = parseInt(promptMatch[2], 10)
        const title = promptMatch[3].trim()

        // Look ahead for image, prompt content, source
        let imageUrl: string | undefined
        let promptContent = ''
        let sourceUrl: string | undefined

        // Scan subsequent lines for prompt data
        for (let j = i + 1; j < lines.length && j < i + 20; j++) {
          const nextLine = lines[j]

          // Image URL
          const imageMatch = nextLine.match(imageRegex)
          if (imageMatch) {
            imageUrl = imageMatch[1]
            continue
          }

          // Source URL
          const sourceMatch = nextLine.match(sourceRegex)
          if (sourceMatch) {
            sourceUrl = sourceMatch[1]
            continue
          }

          // Prompt start marker
          if (promptStartRegex.test(nextLine)) {
            // Next line should be ``` and then content
            if (j + 1 < lines.length && lines[j + 1].startsWith('```')) {
              // Extract content between ``` markers
              let contentStart = j + 2
              let contentEnd = contentStart
              while (contentEnd < lines.length && !lines[contentEnd].startsWith('```')) {
                contentEnd++
              }
              promptContent = lines.slice(contentStart, contentEnd).join('\n').trim()
            }
            break
          }

          // Break on next prompt header or category
          if (lines[j].startsWith('### ') || lines[j].startsWith('## ')) {
            break
          }
        }

        if (promptContent) {
          const prompt: NetworkPrompt = {
            id: `nano-banana-${currentCategory.id}-${categoryNum}.${subNum}`,
            name: title,
            content: promptContent,
            categoryId: currentCategory.id,
            order: currentPromptIndex++,
            sourceProvider: 'nano-banana',
            sourceCategory: currentCategory.name,
            previewImage: imageUrl,
            sourceUrl: sourceUrl
          }
          prompts.push(prompt)
        }
      }
    }

    return prompts
  }

  /**
   * Generate category ID from name (e.g., '3D Miniatures & Dioramas' -> '3d-miniatures')
   */
  private generateCategoryId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * Get predefined categories from Nano Banana source
   * Implementation in Task 3
   */
  getCategories(): ProviderCategory[] {
    // TODO: Implement in Task 3
    return []
  }
}