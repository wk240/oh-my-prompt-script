/**
 * Agent template categories
 */
export type AgentTemplateCategory =
  | 'ecommerce'    // 电商套图
  | 'poster'       // 海报图
  | 'illustration' // 插画
  | 'logo'         // Logo
  | 'ui'           // UI界面
  | '3d'           // 3D渲染

/**
 * Agent template definition
 */
export interface AgentTemplate {
  id: AgentTemplateCategory
  name: string
  nameEn: string
  keywords: string[] // Style keywords for System Prompt
  description: string // Template description shown in UI
  descriptionEn: string
}

/**
 * Agent generate request payload
 */
export interface AgentGeneratePayload {
  inputText: string
  imageData?: string // Optional reference image (base64 data URL)
  templateCategory: AgentTemplateCategory
}

/**
 * Agent generate result
 */
export interface AgentGenerateResult {
  prompt: string // Generated prompt text
  templateCategory: AgentTemplateCategory
}

/**
 * Agent view mode state
 */
export type AgentViewMode = 'default' | 'agent'