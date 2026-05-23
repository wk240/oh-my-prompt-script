/**
 * TeamPromptCard - Card component for displaying team library prompts
 * Compact layout similar to NetworkPromptCard, with save/copy/inject actions
 */

import { ArrowUpRight, Bookmark, Copy } from 'lucide-react'
import type { TeamPrompt } from '@oh-my-prompt/shared/types'
import { truncateText } from '@oh-my-prompt/shared/utils'
import { Tooltip } from './Tooltip'

interface TeamPromptCardProps {
  prompt: TeamPrompt
  onClick: () => void        // Preview in modal
  onInject?: () => void      // Insert to input
  onSave?: () => void        // Save to personal library
  onCopy?: () => void        // Copy to clipboard
  language?: 'zh' | 'en'
}

export function TeamPromptCard({
  prompt,
  onClick,
  onInject,
  onSave,
  onCopy,
  language = 'zh'
}: TeamPromptCardProps) {
  const displayName = language === 'en' && prompt.nameEn ? prompt.nameEn : prompt.name
  const displayDescription = language === 'en' && prompt.descriptionEn ? prompt.descriptionEn : prompt.description

  return (
    <div
      className="team-prompt-card"
      onClick={onClick}
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
      {/* Save button - bottom right */}
      <Tooltip content="保存到个人库">
        <button
          onClick={(e) => { e.stopPropagation(); onSave?.() }}
          aria-label="保存到个人库"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '72px',
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
          <Bookmark style={{ width: 12, height: 12, color: '#8b5cf6' }} />
        </button>
      </Tooltip>

      {/* Copy button */}
      <Tooltip content="复制">
        <button
          onClick={(e) => { e.stopPropagation(); onCopy?.() }}
          aria-label="复制"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '40px',
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
          <Copy style={{ width: 12, height: 12, color: '#171717' }} />
        </button>
      </Tooltip>

      {/* Inject button */}
      <Tooltip content="一键注入">
        <button
          onClick={(e) => { e.stopPropagation(); onInject?.() }}
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

      {/* Name */}
      <Tooltip content={displayName}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#171717', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncateText(displayName, 30)}
        </div>
      </Tooltip>

      {/* Description tag */}
      <Tooltip content={displayDescription || prompt.content}>
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
          {truncateText(displayDescription || prompt.content, 30)}
        </div>
      </Tooltip>

      {/* Team name source */}
      {prompt.teamName && (
        <div
          style={{
            fontSize: '10px',
            fontWeight: 400,
            color: '#8b5cf6',
            marginTop: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          来自: {prompt.teamName}
        </div>
      )}
    </div>
  )
}