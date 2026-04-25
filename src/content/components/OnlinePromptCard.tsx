/**
 * OnlinePromptCard - Card component for displaying online prompts from prompts.chat API
 * Similar to NetworkPromptCard but adapted for OnlinePrompt type
 * Features: thumbnail image, title, category tag, author info, collect button, inject button
 * Hover preview: shows full image on hover, positioned relative to cursor
 */

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Bookmark, Image } from 'lucide-react'
import type { OnlinePrompt } from '../../shared/types'
import { truncateText } from '../../shared/utils'
import { Tooltip } from './Tooltip'

interface OnlinePromptCardProps {
  prompt: OnlinePrompt
  onClick: () => void
  onInject?: () => void
  onCollect?: () => void
  isCollected?: boolean
}

// Fallback placeholder SVG for failed image loads or missing images
const FALLBACK_IMAGE_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"%3E%3Crect fill="%23f0f0f0" width="120" height="80"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'

// Preview offset from mouse cursor
const PREVIEW_OFFSET = 16

// Preview image max dimensions
const PREVIEW_MAX_WIDTH = 720
const PREVIEW_MAX_HEIGHT = 480

export function OnlinePromptCard({ prompt, onClick, onInject, onCollect, isCollected = false }: OnlinePromptCardProps) {
  // Hover preview state
  const [showPreview, setShowPreview] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if prompt has an image
  const hasImage = prompt.type === 'IMAGE' && prompt.mediaUrl

  // Handle mouse enter - show preview if image exists
  const handleMouseEnter = () => {
    if (hasImage) {
      setShowPreview(true)
    }
  }

  // Handle mouse move - track position for preview positioning
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  // Handle mouse leave - hide preview
  const handleMouseLeave = () => {
    setShowPreview(false)
  }

  // Handle button clicks - stop propagation to prevent card click
  const handleInjectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onInject?.()
  }

  const handleCollectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCollect?.()
  }

  // Calculate preview position with edge detection
  const previewHeight = PREVIEW_MAX_HEIGHT + 32 + 16
  const previewWidth = PREVIEW_MAX_WIDTH + 32 + 16
  const previewTopPosition = mousePos.y - PREVIEW_OFFSET - previewHeight
  const previewLeftPosition = mousePos.x - PREVIEW_OFFSET - previewWidth
  const shouldStickToTop = previewTopPosition < 0
  const shouldStickToLeft = previewLeftPosition < 0

  // Preview portal element
  const previewElement = showPreview && hasImage ? (
    <div
      style={{
        position: 'fixed',
        left: shouldStickToLeft ? PREVIEW_OFFSET : mousePos.x - PREVIEW_OFFSET,
        top: shouldStickToTop ? PREVIEW_OFFSET : mousePos.y - PREVIEW_OFFSET,
        transform: shouldStickToLeft && shouldStickToTop
          ? 'none'
          : shouldStickToLeft
            ? 'translateY(-100%)'
            : shouldStickToTop
              ? 'translateX(-100%)'
              : 'translate(-100%, -100%)',
        zIndex: 2147483647,
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
        padding: '16px',
        maxWidth: `${PREVIEW_MAX_WIDTH + 32}px`,
        maxHeight: `${PREVIEW_MAX_HEIGHT + 32}px`,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <img
        src={prompt.mediaUrl!}
        alt={prompt.title}
        style={{
          maxWidth: `${PREVIEW_MAX_WIDTH}px`,
          maxHeight: `${PREVIEW_MAX_HEIGHT}px`,
          width: 'auto',
          height: 'auto',
          borderRadius: '8px',
          display: 'block',
          objectFit: 'contain',
        }}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE_SVG
        }}
      />
    </div>
  ) : null

  // Construct author profile URL (prompts.chat uses username in profile)
  const authorUrl = `https://prompts.chat/@${prompt.author.username}`

  return (
    <div
      ref={cardRef}
      className="online-prompt-card"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        width: 'calc(50% - 6px)',
        padding: '12px',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Preview rendered via portal to document.body */}
      {previewElement && createPortal(previewElement, document.body)}

      {/* Collect button - bottom right, left of inject */}
      <Tooltip content={isCollected ? '已收藏' : '收藏'}>
        <button
          onClick={handleCollectClick}
          aria-label={isCollected ? '已收藏' : '收藏'}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '40px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isCollected ? '#171717' : '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          <Bookmark style={{ width: 12, height: 12, color: isCollected ? '#ffffff' : '#171717', fill: isCollected ? '#171717' : 'none' }} />
        </button>
      </Tooltip>

      {/* Inject button - bottom right corner */}
      <Tooltip content="一键注入">
        <button
          onClick={handleInjectClick}
          aria-label="一键注入"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            border: '1px solid #E5E5E5',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          <ArrowUpRight style={{ width: 12, height: 12, color: '#171717' }} />
        </button>
      </Tooltip>

      {/* Thumbnail image or placeholder */}
      {hasImage ? (
        <img
          src={prompt.mediaUrl!}
          alt={prompt.title}
          style={{
            width: '100%',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE_SVG
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '80px',
            background: '#f5f5f5',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image style={{ width: 32, height: 32, color: '#ccc' }} />
        </div>
      )}

      {/* Title with tooltip */}
      <Tooltip content={prompt.title}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#171717', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncateText(prompt.title, 30)}
        </div>
      </Tooltip>

      {/* Category tag with tooltip */}
      <Tooltip content={prompt.description || prompt.content}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: '#64748B',
            marginTop: '4px',
            padding: '4px 8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {prompt.category.name}
        </div>
      </Tooltip>

      {/* Author attribution */}
      <a
        href={authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: '10px',
          fontWeight: 400,
          color: '#737373',
          marginTop: '4px',
          display: 'block',
          textDecoration: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        by {prompt.author.name}
        {prompt.author.verified && (
          <span style={{ marginLeft: '2px', color: '#3b82f6' }} title="Verified">
            ✓
          </span>
        )}
      </a>
    </div>
  )
}