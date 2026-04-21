/**
 * Data extraction script for Awesome-Nano-Banana-Prompts
 * Parses README.md and extracts prompts with author attribution
 *
 * Usage: npx tsx scripts/extract-prompts.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const README_URL = 'https://raw.githubusercontent.com/devanshug2307/Awesome-Nano-Banana-Prompts/main/README.md'
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/resource-library/prompts.json')

// Category mapping from TOC numbers to IDs
const CATEGORY_MAP: Record<string, { id: string; name: string }> = {
  '1': { id: '3d-miniatures-dioramas', name: '3D Miniatures & Dioramas' },
  '2': { id: 'product-photography', name: 'Product Photography' },
  '3': { id: 'character-design', name: 'Character Design' },
  '4': { id: 'food-culinary', name: 'Food & Culinary' },
  '5': { id: 'fantasy-scifi', name: 'Fantasy & Sci-Fi' },
  '6': { id: 'sports-action', name: 'Sports & Action' },
  '7': { id: 'urban-cityscapes', name: 'Urban Cityscapes' },
  '8': { id: 'architecture-interiors', name: 'Architecture & Interiors' },
  '9': { id: 'nature-landscapes', name: 'Nature & Landscapes' },
  '10': { id: 'logo-branding', name: 'Logo & Branding' },
  '11': { id: 'vintage-retro', name: 'Vintage & Retro' },
  '12': { id: 'cinematic-posters', name: 'Cinematic Posters' },
  '13': { id: 'anime-manga', name: 'Anime & Manga' },
  '14': { id: 'minimalist-icons', name: 'Minimalist Icons' },
  '15': { id: 'misc', name: 'Miscellaneous' },
  '16': { id: 'portrait-photography', name: 'Portrait Photography' },
  '17': { id: 'fashion-photography', name: 'Fashion Photography' },
}

interface ExtractedPrompt {
  id: string
  name: string
  content: string
  categoryId: string
  order: number
  sourceCategory: string
  previewImage?: string
  author?: string
  authorUrl?: string
}

interface ResourceLibraryData {
  version: string
  source: string
  fetchedAt: string
  prompts: ExtractedPrompt[]
  categories: { id: string; name: string; order: number; count: number }[]
}

async function fetchReadme(): Promise<string> {
  console.log('[Oh My Prompt Script] Fetching README from GitHub...')
  const response = await fetch(README_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.status}`)
  }
  return await response.text()
}

function parsePrompts(readme: string): ExtractedPrompt[] {
  const prompts: ExtractedPrompt[] = []
  const lines = readme.split('\n')

  let currentCategory: { id: string; name: string } | null = null
  let currentPrompt: Partial<ExtractedPrompt> | null = null
  let inPromptBlock = false
  let promptContentLines: string[] = []
  let orderInCategory = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Match section header: ## N. Title
    const sectionMatch = line.match(/^## (\d+)\.\s+(.+)$/)
    if (sectionMatch) {
      const catNum = sectionMatch[1]
      currentCategory = CATEGORY_MAP[catNum] || null
      orderInCategory = 0
      continue
    }

    // Match prompt header: ### N.M. Title
    const promptMatch = line.match(/^### \d+\.\d+\.\s+(.+)$/)
    if (promptMatch && currentCategory) {
      // Save previous prompt if exists
      if (currentPrompt && promptContentLines.length > 0) {
        currentPrompt.content = promptContentLines.join('\n').trim()
        prompts.push(createPrompt(currentPrompt, currentCategory, orderInCategory))
        orderInCategory++
      }

      // Start new prompt
      currentPrompt = {
        name: promptMatch[1].trim(),
      }
      promptContentLines = []
      inPromptBlock = false
      continue
    }

    // Match preview image: ![alt](url)
    if (currentPrompt && !currentPrompt.previewImage) {
      const imageMatch = line.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/)
      if (imageMatch) {
        currentPrompt.previewImage = imageMatch[1]
        continue
      }
    }

    // Match Prompt marker: **Prompt:**
    if (line.trim() === '**Prompt:**') {
      inPromptBlock = false // Reset
      continue
    }

    // Match code block start: ```
    if (line.startsWith('```') && currentPrompt) {
      if (!inPromptBlock) {
        inPromptBlock = true
      } else {
        // End of code block
        inPromptBlock = false
      }
      continue
    }

    // Collect prompt content inside code block
    if (inPromptBlock && currentPrompt) {
      promptContentLines.push(line)
      continue
    }

    // Match Source: [author](url)
    if (currentPrompt && line.includes('**Source:**')) {
      const sourceMatch = line.match(/\*\*Source:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/)
      if (sourceMatch) {
        currentPrompt.author = sourceMatch[1].trim()
        currentPrompt.authorUrl = sourceMatch[2].trim()
      }
      continue
    }
  }

  // Save last prompt
  if (currentPrompt && currentCategory && promptContentLines.length > 0) {
    currentPrompt.content = promptContentLines.join('\n').trim()
    prompts.push(createPrompt(currentPrompt, currentCategory, orderInCategory))
  }

  return prompts
}

function createPrompt(
  partial: Partial<ExtractedPrompt>,
  category: { id: string; name: string },
  order: number
): ExtractedPrompt {
  return {
    id: `resource-${category.id}-${order}`,
    name: partial.name || 'Untitled',
    content: partial.content || '',
    categoryId: category.id,
    order,
    sourceCategory: category.name,
    previewImage: partial.previewImage,
    author: partial.author,
    authorUrl: partial.authorUrl,
  }
}

function generateCategories(prompts: ExtractedPrompt[]): { id: string; name: string; order: number; count: number }[] {
  const categoryCounts: Record<string, number> = {}
  for (const p of prompts) {
    categoryCounts[p.categoryId] = (categoryCounts[p.categoryId] || 0) + 1
  }

  return Object.entries(CATEGORY_MAP).map(([order, cat], idx) => ({
    id: cat.id,
    name: cat.name,
    order: parseInt(order),
    count: categoryCounts[cat.id] || 0,
  }))
}

async function main() {
  try {
    const readme = await fetchReadme()
    console.log('[Oh My Prompt Script] Parsing prompts...')

    const prompts = parsePrompts(readme)
    const categories = generateCategories(prompts)

    const data: ResourceLibraryData = {
      version: '1.1.0',
      source: 'https://github.com/devanshug2307/Awesome-Nano-Banana-Prompts',
      fetchedAt: new Date().toISOString(),
      prompts,
      categories,
    }

    // Write output
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log(`[Oh My Prompt Script] Extracted ${prompts.length} prompts`)
    console.log(`[Oh My Prompt Script] Output: ${OUTPUT_PATH}`)

    // Stats
    const withAuthor = prompts.filter(p => p.author).length
    const withImage = prompts.filter(p => p.previewImage).length
    console.log(`[Oh My Prompt Script] Stats: ${withAuthor} with author, ${withImage} with image`)
  } catch (error) {
    console.error('[Oh My Prompt Script] Error:', error)
    process.exit(1)
  }
}

main()