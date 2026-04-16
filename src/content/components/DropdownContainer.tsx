/**
 * DropdownContainer - Main dropdown wrapper with Lovart-native styling
 * Auto-adapts position to stay within viewport boundaries
 */

import { useEffect, useRef, useState } from 'react'
import type { Prompt } from '../../shared/types'
import { Sparkles, Palette, Shapes, ArrowUpRight, X } from 'lucide-react'

interface DropdownContainerProps {
  prompts: Prompt[]
  onSelect: (prompt: Prompt) => void
  isOpen: boolean
  selectedPromptId: string | null
  onClose?: () => void
}

interface DropdownPosition {
  expandUp: boolean
  left: number
  maxHeight: number
}

function calculateDropdownPosition(): DropdownPosition {
  const dropdownWidth = 280
  const dropdownMaxHeight = 260
  const gap = 4
  const padding = 8

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const host = document.getElementById('lovart-injector-host')
  if (!host) {
    return { expandUp: true, left: 0, maxHeight: dropdownMaxHeight }
  }

  const hostRect = host.getBoundingClientRect()

  let leftPos = 0
  const absoluteRight = hostRect.left + dropdownWidth
  if (absoluteRight > viewportWidth - padding) {
    const overflow = absoluteRight - viewportWidth + padding
    leftPos = -overflow
  }

  const absoluteLeft = hostRect.left + leftPos
  if (absoluteLeft < padding) {
    leftPos = padding - hostRect.left
  }

  const spaceAbove = hostRect.top - padding
  const spaceBelow = viewportHeight - hostRect.bottom - padding

  let expandUp = true
  let maxHeight = dropdownMaxHeight

  if (spaceAbove < dropdownMaxHeight + gap) {
    if (spaceBelow >= dropdownMaxHeight + gap) {
      expandUp = false
      maxHeight = dropdownMaxHeight
    } else {
      if (spaceAbove >= spaceBelow) {
        expandUp = true
        maxHeight = spaceAbove - gap
      } else {
        expandUp = false
        maxHeight = spaceBelow - gap
      }
    }
  }

  return { expandUp, left: leftPos, maxHeight: Math.max(maxHeight, 150) }
}

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  design: Sparkles,
  style: Palette,
  default: Shapes,
}

export function DropdownContainer({
  prompts,
  onSelect,
  isOpen,
  selectedPromptId,
  onClose,
}: DropdownContainerProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<DropdownPosition>({
    expandUp: true,
    left: 0,
    maxHeight: 260,
  })

  useEffect(() => {
    if (isOpen) {
      const newPosition = calculateDropdownPosition()
      setPosition(newPosition)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleReposition = () => {
      setPosition(calculateDropdownPosition())
    }

    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, { passive: true })

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition)
    }
  }, [isOpen])

  if (!isOpen) return null

  const truncatePreview = (content: string): string => {
    if (content.length <= 30) return content
    return content.substring(0, 30) + '...'
  }

  const gap = 4
  const buttonHeight = 48
  const dropdownStyle: React.CSSProperties = {
    left: position.left,
    maxHeight: position.maxHeight,
    width: 280,
    top: position.expandUp ? 'auto' : buttonHeight + gap,
    bottom: position.expandUp ? buttonHeight + gap : 'auto',
  }

  // Get first category prompts for simplified list
  const allPrompts = prompts

  return (
    <div
      ref={dropdownRef}
      className="dropdown-container open"
      style={dropdownStyle}
    >
      {/* Header */}
      <div className="dropdown-header">
        <span className="dropdown-header-title">PROMPTS</span>
        <button
          className="dropdown-close"
          onClick={onClose}
          aria-label="关闭"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Prompt Items */}
      {allPrompts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-message">暂无提示词</div>
        </div>
      ) : (
        allPrompts.slice(0, 5).map((prompt, index) => {
          const IconComponent = ICON_MAP[prompt.categoryId === 'design' ? 'design' : prompt.categoryId === 'style' ? 'style' : 'default']

          return (
            <div
              key={prompt.id}
              className={`dropdown-item${selectedPromptId === prompt.id ? ' selected' : ''}${index === allPrompts.slice(0, 5).length - 1 ? ' last' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(prompt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(prompt)
                }
              }}
            >
              <IconComponent className="dropdown-item-icon w-4 h-4" />
              <div className="dropdown-item-text">
                <span className="dropdown-item-name">{prompt.name}</span>
                <span className="dropdown-item-preview">{truncatePreview(prompt.content)}</span>
              </div>
              <ArrowUpRight className="dropdown-item-arrow w-3 h-3" />
            </div>
          )
        })
      )}
    </div>
  )
}