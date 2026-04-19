/**
 * ProviderCategoryItem - Sidebar item for ProviderCategory navigation
 * Phase 7: Displays category name + count (D-13, D-14, D-15)
 */

import type { ProviderCategory } from '../../shared/types'
import { Globe } from 'lucide-react'

interface ProviderCategoryItemProps {
  category: ProviderCategory
  isSelected: boolean
  onSelect: (categoryId: string) => void
}

export function ProviderCategoryItem({ category, isSelected, onSelect }: ProviderCategoryItemProps) {
  return (
    <div
      className={`sidebar-category-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(category.id)
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        background: isSelected ? '#ffffff' : 'transparent',
        borderLeft: isSelected ? '2px solid #A16207' : 'none',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Globe icon for online categories */}
      <Globe style={{ width: 14, height: 14, color: isSelected ? '#A16207' : '#64748B' }} />
      {/* D-14: Name + count */}
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#171717', flex: 1 }}>
        {category.name}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748B' }}>
        · {category.count}条
      </span>
    </div>
  )
}