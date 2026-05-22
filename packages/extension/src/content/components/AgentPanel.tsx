/**
 * AgentPanel - Agent prompt generation UI for Content Script dropdown
 * Inline-styled, Portal-rendered (same pattern as DropdownContainer)
 * Feature-parity with sidepanel/AgentView.tsx
 */

import { useState, useEffect, useCallback } from 'react'
import type { AgentTemplateCategory, Category, ProviderConfig } from '@oh-my-prompt/shared/types'
import { MessageType } from '@oh-my-prompt/shared/messages'
import { Sparkles, Loader2, AlertTriangle, Copy, Bookmark, RefreshCw, X, Upload, Settings, LogIn, ArrowUpRight } from 'lucide-react'
import { showToast } from './ToastNotification'
import { CategorySelectDialog } from './CategorySelectDialog'
import { WEB_APP_URL } from '../../lib/config'

interface AgentPanelProps {
  selectedTemplate: AgentTemplateCategory
  extractedText?: string
  categories: Category[]
  onSave: (prompt: string, categoryId: string, templateCategory: AgentTemplateCategory) => void
  onInsert?: (text: string) => void
  // Persisted state from parent (survives close/reopen)
  persistedInputText?: string
  persistedResult?: string | null
  persistedImageData?: string | null
  onPersistStateChange?: (state: { inputText: string; result: string | null; imageData: string | null }) => void
}

export function AgentPanel({
  selectedTemplate,
  extractedText,
  categories,
  onSave,
  onInsert,
  persistedInputText,
  persistedResult,
  persistedImageData,
  onPersistStateChange
}: AgentPanelProps) {
  const [inputText, setInputTextLocal] = useState(persistedInputText ?? '')
  const [imageData, setImageDataLocal] = useState<string | null>(persistedImageData ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResultLocal] = useState<string | null>(persistedResult ?? null)
  const [error, setError] = useState<string | null>(null)
  const [errorAction, setErrorAction] = useState<'settings' | null>(null)
  const [hasConfig, setHasConfig] = useState<boolean | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Sync from persisted state (when parent re-mounts this component after reopen)
  const setInputText = useCallback((value: string) => {
    setInputTextLocal(value)
    onPersistStateChange?.({ inputText: value, result, imageData })
  }, [result, imageData, onPersistStateChange])

  const setImageData = useCallback((value: string | null) => {
    setImageDataLocal(value)
    onPersistStateChange?.({ inputText, result, imageData: value })
  }, [inputText, result, onPersistStateChange])

  const setResult = useCallback((value: string | null) => {
    setResultLocal(value)
    onPersistStateChange?.({ inputText, result: value, imageData })
  }, [inputText, imageData, onPersistStateChange])

  // Pre-fill extracted text
  useEffect(() => {
    if (extractedText) {
      setInputText(extractedText)
    }
  }, [extractedText])

  // Check if provider config exists
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.GET_PROVIDER_CONFIGS })
      .then(response => {
        if (response?.success && response?.data) {
          const { configs, activeConfigId } = response.data as { configs: ProviderConfig[]; activeConfigId: string | null }
          setHasConfig(activeConfigId !== null && configs.some(c => c.id === activeConfigId) || configs.some(c => c.apiFormat === 'omp_official'))
        } else {
          setHasConfig(false)
        }
      })
      .catch(() => setHasConfig(false))
  }, [])

  // Listen for auth status updates (login/logout) to refresh config check
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: { logout?: boolean } }) => {
      if (message.type === MessageType.AUTH_STATUS_UPDATE) {
        chrome.runtime.sendMessage({ type: MessageType.GET_PROVIDER_CONFIGS })
          .then(response => {
            if (response?.success && response?.data) {
              const { configs, activeConfigId } = response.data as { configs: ProviderConfig[]; activeConfigId: string | null }
              setHasConfig(activeConfigId !== null && configs.some(c => c.id === activeConfigId) || configs.some(c => c.apiFormat === 'omp_official'))
            } else {
              setHasConfig(false)
            }
          })
          .catch(() => setHasConfig(false))
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请上传图片文件')
      return
    }
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_IMAGE_SIZE) {
      showToast('图片大小不能超过 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageData(e.target?.result as string)
    }
    reader.onerror = () => showToast('图片读取失败')
    reader.readAsDataURL(file)
  }, [])

  const handleRemoveImage = useCallback(() => setImageData(null), [])

  // Handle generate
  const handleGenerate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setErrorAction(null)
    setResult(null)

    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.AGENT_GENERATE,
        payload: {
          inputText: inputText.trim(),
          imageData,
          templateCategory: selectedTemplate
        }
      })
      if (!response?.success) {
        throw new Error(response?.error || '生成失败')
      }
      setResult(response.data.prompt)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败'
      if (errorMessage.startsWith('NO_CONFIG:')) {
        setError('请先配置 API 或登录官方服务')
        setErrorAction('settings')
      } else if (errorMessage.startsWith('NOT_LOGGED_IN:')) {
        setError('请先登录会员账号')
        setErrorAction('settings')
      } else if (errorMessage.startsWith('UNSUPPORTED_FORMAT:')) {
        setError('不支持当前 API 格式')
      } else if (errorMessage === 'timeout') {
        setError('请求超时，请重试')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [inputText, imageData, selectedTemplate, isLoading])

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      showToast('已复制到剪贴板')
    } catch {
      showToast('复制失败')
    }
  }, [result])

  // Handle save
  const handleSave = useCallback((categoryId: string) => {
    if (!result) return
    onSave(result, categoryId, selectedTemplate)
    setShowSaveDialog(false)
    showToast('已保存到分类')
  }, [result, selectedTemplate, onSave])

  const handleRetry = useCallback(() => handleGenerate(), [handleGenerate])
  const isGenerateDisabled = !inputText.trim() || isLoading

  return (
    <div className="agent-panel">
      {/* Setup Guide — shown when no provider config available */}
      {hasConfig === false && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '24px 16px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Settings style={{ width: 24, height: 24, color: '#7C3AED' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#171717', marginBottom: 4 }}>尚未配置 API</div>
          <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>使用 Agent 生成提示词前，需要登录官方服务或配置第三方 API</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 240 }}>
            <button
              onClick={() => window.open(`${WEB_APP_URL}/auth/login?source=extension`, '_blank')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px 16px', background: '#7C3AED', color: 'white', fontSize: 13, fontWeight: 500, borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              <LogIn style={{ width: 16, height: 16 }} />
              登录官方服务
            </button>
            <button
              onClick={() => chrome.runtime.sendMessage({ type: MessageType.OPEN_SIDEPANEL_FOR_SETTINGS })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px 16px', background: 'white', color: '#374151', fontSize: 13, fontWeight: 500, borderRadius: 8, border: '1px solid #E5E7EB', cursor: 'pointer' }}
            >
              <Settings style={{ width: 16, height: 16 }} />
              配置第三方 API
            </button>
          </div>
        </div>
      )}

      {/* Main Agent UI — shown when config exists or still checking */}
      {(hasConfig === true || hasConfig === null) && (
      <>
      {/* Input */}
      <div className="agent-panel-section">
        <label style={{ fontSize: 12, fontWeight: 500, color: '#171717', display: 'block', marginBottom: 6 }}>
          描述你想要生成的图像<span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>
        </label>
        <textarea
          className="agent-panel-textarea"
          placeholder="例如：一款极简风格的蓝牙耳机，白色背景，产品主体突出..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          rows={4}
        />
      </div>

      {/* Image upload */}
      <div className="agent-panel-section">
        <label style={{ fontSize: 12, fontWeight: 500, color: '#171717', display: 'block', marginBottom: 6 }}>参考图片（可选）</label>
        {imageData ? (
          <div className="agent-panel-image-preview">
            <img src={imageData} alt="参考图片" className="agent-panel-image-thumb" />
            <button className="agent-panel-image-remove" onClick={handleRemoveImage} aria-label="移除图片">
              <X style={{ width: 12, height: 12 }} />
            </button>
          </div>
        ) : (
          <div className="agent-panel-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="agent-panel-file-input"
              disabled={isLoading}
            />
            <div className="agent-panel-upload-content">
              <Upload style={{ width: 16, height: 16, color: '#64748B' }} />
              <span style={{ fontSize: 11, color: '#64748B' }}>上传参考图片</span>
            </div>
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        className={`agent-panel-generate-btn ${isGenerateDisabled ? 'disabled' : ''}`}
        onClick={handleGenerate}
        disabled={isGenerateDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="agent-panel-spinner" />
            <span>生成中...</span>
          </>
        ) : (
          <>
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>生成提示词</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="agent-panel-error">
          <AlertTriangle style={{ width: 14, height: 14, color: '#dc2626', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#B91C1C', flex: 1 }}>{error}</span>
          {errorAction === 'settings' && (
            <button
              className="agent-panel-error-retry"
              onClick={() => { setError(null); setErrorAction(null); chrome.runtime.sendMessage({ type: MessageType.OPEN_SIDEPANEL_FOR_SETTINGS }) }}
              style={{ background: '#7C3AED', color: 'white' }}
            >
              <Settings style={{ width: 12, height: 12 }} />
              <span>去设置</span>
            </button>
          )}
          <button className="agent-panel-error-retry" onClick={handleRetry}>
            <RefreshCw style={{ width: 12, height: 12 }} />
            <span>重试</span>
          </button>
        </div>
      )}

      {/* Result */}
      {result && !error && (
        <div className="agent-panel-result">
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>生成的提示词</div>
          <div className="agent-panel-result-content">{result}</div>
          <div className="agent-panel-result-actions">
            {onInsert && (
              <button className="agent-panel-action-btn agent-panel-insert-btn" onClick={() => { onInsert(result); showToast('已插入提示词') }} title="插入到输入框" style={{ color: '#7C3AED' }}>
                <ArrowUpRight style={{ width: 14, height: 14 }} />
              </button>
            )}
            <button className="agent-panel-action-btn" onClick={handleCopy} title="复制">
              <Copy style={{ width: 14, height: 14 }} />
            </button>
            <button className="agent-panel-action-btn" onClick={() => setShowSaveDialog(true)} title="保存到库">
              <Bookmark style={{ width: 14, height: 14 }} />
            </button>
            <button className="agent-panel-action-btn" onClick={handleRetry} disabled={isLoading} title="重新生成">
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}

      {/* Save dialog */}
      <CategorySelectDialog
        categories={categories}
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleSave}
      />
      </>
      )}
    </div>
  )
}
