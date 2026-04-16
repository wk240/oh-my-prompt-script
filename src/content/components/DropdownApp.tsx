/**
 * DropdownApp - Root component coordinating trigger and dropdown
 * Manages dropdown state and handles prompt selection
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { TriggerButton } from './TriggerButton'
import { DropdownContainer } from './DropdownContainer'
import type { Prompt, Category, StorageSchema } from '../../shared/types'
import { STORAGE_KEY } from '../../shared/constants'
import { InsertHandler } from '../insert-handler'
import { readImportFile } from '../../lib/import-export'

interface DropdownAppProps {
  lovartIconColor: string
  inputElement: HTMLElement
}

type ViewState = 'list' | 'add-form'

export function DropdownApp({ lovartIconColor, inputElement }: DropdownAppProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [viewState, setViewState] = useState<ViewState>('list')
  // Storage-backed state
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Add prompt form state
  const [newPromptName, setNewPromptName] = useState('')
  const [newPromptContent, setNewPromptContent] = useState('')
  const [newPromptCategoryId, setNewPromptCategoryId] = useState('default')
  const [isSaving, setIsSaving] = useState(false)
  // Initialize InsertHandler directly in useRef to avoid timing issues
  const insertHandlerRef = useRef<InsertHandler>(new InsertHandler())

  // Fetch storage data on mount
  useEffect(() => {
    loadStorageData()
  }, [])

  const loadStorageData = useCallback(async () => {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      const data = result[STORAGE_KEY] as StorageSchema | undefined
      if (data) {
        setPrompts(data.prompts)
        setCategories(data.categories)
      } else {
        // Initialize with default category
        setPrompts([])
        setCategories([{ id: 'default', name: '默认分类', order: 0 }])
      }
    } catch (error) {
      console.error('[Lovart Injector] Load error:', error)
      // Initialize with default category on error
      setPrompts([])
      setCategories([{ id: 'default', name: '默认分类', order: 0 }])
    }
    setIsLoading(false)
  }, [])

  /**
   * Toggle dropdown visibility (D-12: toggle behavior)
   */
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
    setViewState('list')
    // Reset scroll position on open
    if (!isOpen) {
      const dropdown = document.querySelector('#lovart-injector-host')?.shadowRoot?.querySelector('.dropdown-container')
      if (dropdown) {
        dropdown.scrollTop = 0
      }
    }
  }, [isOpen])

  /**
   * Handle prompt selection (D-11: keep open after insert)
   */
  const handleSelect = useCallback((prompt: Prompt) => {
    // Insert prompt into Lovart input
    insertHandlerRef.current.insertPrompt(inputElement, prompt.content)

    // Set visual feedback
    setSelectedPromptId(prompt.id)

    // Visual feedback fades after 2s (UI-SPEC)
    setTimeout(() => {
      setSelectedPromptId(null)
    }, 2000)

    // Keep dropdown open (D-11)
  }, [inputElement])

  /**
   * Handle add prompt button click - show form
   */
  const handleAddPrompt = useCallback(() => {
    setViewState('add-form')
    setNewPromptName('')
    setNewPromptContent('')
    setNewPromptCategoryId(categories[0]?.id || 'default')
  }, [categories])

  /**
   * Handle import button click - directly save to chrome.storage.local
   */
  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const result = await readImportFile(file)

      if (result.valid && result.data) {
        const { prompts: importedPrompts, categories: importedCategories } = result.data
        // Update local state
        setPrompts(importedPrompts)
        setCategories(importedCategories)
        // Save to storage directly
        try {
          await chrome.storage.local.set({
            [STORAGE_KEY]: {
              prompts: importedPrompts,
              categories: importedCategories,
              version: '1.0.0'
            }
          })
          setViewState('list')
        } catch (error) {
          console.error('[Lovart Injector] Import save error:', error)
        }
      }
    }

    input.click()
  }, [])

  /**
   * Handle save new prompt - directly save to chrome.storage.local
   */
  const handleSavePrompt = useCallback(async () => {
    if (!newPromptName.trim() || !newPromptContent.trim()) return

    setIsSaving(true)

    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      name: newPromptName.trim(),
      content: newPromptContent.trim(),
      categoryId: newPromptCategoryId,
    }

    const updatedPrompts = [...prompts, newPrompt]
    const dataToSave: StorageSchema = {
      prompts: updatedPrompts,
      categories,
      version: '1.0.0'
    }

    try {
      // Directly save to chrome.storage.local - bypass Service Worker
      await chrome.storage.local.set({ [STORAGE_KEY]: dataToSave })

      // Success - update local state
      setPrompts(updatedPrompts)
      setViewState('list')
      setNewPromptName('')
      setNewPromptContent('')
    } catch (error) {
      console.error('[Lovart Injector] Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }, [newPromptName, newPromptContent, newPromptCategoryId, prompts, categories])

  /**
   * Handle cancel add form
   */
  const handleCancelAdd = useCallback(() => {
    setViewState('list')
    setNewPromptName('')
    setNewPromptContent('')
  }, [])

  // Loading state - show trigger button with loading dropdown
  if (isLoading) {
    return (
      <div className="dropdown-app">
        <TriggerButton
          isOpen={isOpen}
          onClick={handleToggle}
          lovartIconColor={lovartIconColor}
        />
        {isOpen && (
          <div className="dropdown-container open" style={{ top: '48px', left: '0', width: '280px' }}>
            <div className="empty-state">
              <div className="empty-message">加载中...</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Add prompt form view
  if (viewState === 'add-form') {
    return (
      <div className="dropdown-app">
        <TriggerButton
          isOpen={isOpen}
          onClick={handleToggle}
          lovartIconColor={lovartIconColor}
        />
        {isOpen && (
          <div className="dropdown-container open" style={{ top: '48px', left: '0', width: '280px' }}>
            <div className="add-prompt-form">
              <div className="add-prompt-form-header">
                <span className="add-prompt-form-title">新增提示词</span>
                <button className="add-prompt-form-close" onClick={handleCancelAdd}>
                  ✕
                </button>
              </div>
              <div className="add-prompt-field">
                <label className="add-prompt-label">名称</label>
                <input
                  className="add-prompt-input"
                  type="text"
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  placeholder="提示词名称"
                  autoFocus
                />
              </div>
              <div className="add-prompt-field">
                <label className="add-prompt-label">内容</label>
                <textarea
                  className="add-prompt-textarea"
                  value={newPromptContent}
                  onChange={(e) => setNewPromptContent(e.target.value)}
                  placeholder="提示词内容..."
                />
              </div>
              <div className="add-prompt-field">
                <label className="add-prompt-label">分类</label>
                <select
                  className="add-prompt-category-select"
                  value={newPromptCategoryId}
                  onChange={(e) => setNewPromptCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="add-prompt-submit"
                onMouseDown={(e) => {
                  // Prevent focus transfer to button
                  e.preventDefault()
                }}
                onClick={(e) => {
                  // Stop propagation to prevent parent handlers
                  e.stopPropagation()
                  handleSavePrompt()
                }}
                disabled={!newPromptName.trim() || !newPromptContent.trim() || isSaving}
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main list view
  return (
    <div className="dropdown-app">
      <TriggerButton
        isOpen={isOpen}
        onClick={handleToggle}
        lovartIconColor={lovartIconColor}
      />

      <DropdownContainer
        prompts={prompts}
        categories={categories}
        onSelect={handleSelect}
        isOpen={isOpen}
        selectedPromptId={selectedPromptId}
        onAddPrompt={handleAddPrompt}
        onImport={handleImport}
      />
    </div>
  )
}