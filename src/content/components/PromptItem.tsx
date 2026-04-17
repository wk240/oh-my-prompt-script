/**
 * PromptItem - Prompt entry with name and description
 * Handles selection state and keyboard interaction
 */

import type { Prompt } from '../../shared/types'

interface PromptItemProps {
  prompt: Prompt
  isSelected: boolean
  onClick: () => void
}

/**
 * Truncate description text to ~50 chars (D-06)
 */
function truncateDescription(text: string): string {
  if (text.length <= 50) return text
  return text.substring(0, 50) + '...'
}

export function PromptItem({ prompt, isSelected, onClick }: PromptItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  // Show description if available, otherwise show truncated content
  const displayText = prompt.description
    ? truncateDescription(prompt.description)
    : truncateDescription(prompt.content)

  return (
    <div
      className={`prompt-item${isSelected ? ' selected' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="prompt-name">{prompt.name}</div>
      <div className="prompt-preview">{displayText}</div>
    </div>
  )
}