/**
 * LovartButton - Lovart-native styled trigger button
 * Extracts Lovart visual styles at runtime for UI coordination
 */

import { useState, useEffect } from 'react'
import {
  extractLovartButtonStyle,
  getLovartIconColor,
  DEFAULT_STYLE,
  type LovartStyleConfig,
} from '../../style-extractor'

interface LovartButtonProps {
  inputElement: HTMLElement
  isOpen: boolean
  onClick: () => void
}

export function LovartButton({ isOpen, onClick }: LovartButtonProps) {
  const [style, setStyle] = useState<LovartStyleConfig>(DEFAULT_STYLE)
  const [iconColor, setIconColor] = useState<string>(DEFAULT_STYLE.color)

  // Extract Lovart styles on mount
  useEffect(() => {
    const extractedStyle = extractLovartButtonStyle()
    setStyle(extractedStyle)

    const extractedColor = getLovartIconColor()
    setIconColor(extractedColor)
  }, [])

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

  return (
    <button
      className="lovart-trigger-button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="选择预设提示词"
      aria-expanded={isOpen}
      title="Oh My Prompt"
      style={{
        width: '32px',
        height: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        color: iconColor,
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <path
          d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>
    </button>
  )
}