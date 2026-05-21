import type { AgentTemplate, AgentTemplateCategory } from '@oh-my-prompt/shared/types/agent'
import templatesData from '@/data/agent-templates.json'

/**
 * Get all Agent templates
 */
export function getAgentTemplates(): AgentTemplate[] {
  return templatesData as AgentTemplate[]
}

/**
 * Get template by category ID
 */
export function getAgentTemplate(category: AgentTemplateCategory): AgentTemplate | undefined {
  return getAgentTemplates().find(t => t.id === category)
}

/**
 * Build System Prompt for Agent generation
 * @param category - Template category
 * @param hasImage - Whether user provided reference image
 * @returns System Prompt string
 */
export function buildAgentSystemPrompt(
  category: AgentTemplateCategory,
  hasImage: boolean
): string {
  const template = getAgentTemplate(category)
  if (!template) {
    throw new Error(`Unknown template category: ${category}`)
  }

  const keywordsText = template.keywords.join('、')

  if (hasImage) {
    return `你是提示词增强专家。用户正在生成${template.name}类型的提示词。

风格要点：${keywordsText}。

参考图片的视觉风格、色彩、构图，结合用户描述生成详细的提示词。提示词应包含：
- 主体描述（是什么）
- 风格定义（什么风格）
- 光影效果（如何照亮）
- 色彩方案（什么颜色）
- 构图布局（如何排列）
- 材质纹理（什么质感）
- 氛围情绪（什么感觉）

输出语言与输入语言一致。如果用户用中文描述，输出中文提示词；如果用英文描述，输出英文提示词。`
  }

  return `你是提示词增强专家。用户正在生成${template.name}类型的提示词。

风格要点：${keywordsText}。

将简短描述扩展为详细的提示词，包含：
- 主体描述（是什么）
- 风格定义（什么风格）
- 光影效果（如何照亮）
- 色彩方案（什么颜色）
- 构图布局（如何排列）
- 材质纹理（什么质感）
- 氛围情绪（什么感觉）

输出语言与输入语言一致。如果用户用中文描述，输出中文提示词；如果用英文描述，输出英文提示词。`
}