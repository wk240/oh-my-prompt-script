import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './components/ui/dialog'
import { Check, X, Trash2 } from 'lucide-react'
import { MessageType } from '../shared/messages'
import type { VisionApiConfig } from '../shared/types'

function SettingsApp() {
  const [config, setConfig] = useState<VisionApiConfig | null>(null)
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [modelName, setModelName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Load config on mount
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: MessageType.GET_API_CONFIG })
      if (response.success && response.data) {
        setConfig(response.data)
        setBaseUrl(response.data.baseUrl)
        setApiKey(response.data.apiKey)
        setModelName(response.data.modelName)
      } else {
        setConfig(null)
        setBaseUrl('')
        setApiKey('')
        setModelName('')
      }
      setError(null)
    } catch (err) {
      setError('获取配置失败')
      // SECURITY: Log error only, never apiKey (AUTH-02, T-10-02)
      console.error('[Oh My Prompt] GET_API_CONFIG error:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateInputs = (): string | null => {
    const trimmedUrl = baseUrl.trim()
    const trimmedKey = apiKey.trim()
    const trimmedModel = modelName.trim()

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return 'API Base URL 必须以 http:// 或 https:// 开头'
    }
    if (!trimmedKey) {
      return 'API Key 不能为空'
    }
    if (!trimmedModel) {
      return 'Model Name 不能为空'
    }
    return null
  }

  const handleSave = async () => {
    // Clear previous messages
    setError(null)
    setSuccess(null)

    // Validate inputs
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const payload: VisionApiConfig = {
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
        modelName: modelName.trim()
      }

      // SECURITY: Log baseUrl and modelName only, never apiKey (AUTH-02, T-10-02)
      console.log('[Oh My Prompt] SET_API_CONFIG: baseUrl=', payload.baseUrl, 'modelName=', payload.modelName)

      const response = await chrome.runtime.sendMessage({
        type: MessageType.SET_API_CONFIG,
        payload
      })

      if (response.success) {
        setSuccess('配置已保存')
        await loadConfig()
      } else {
        setError(response.error || '保存配置失败，请重试')
      }
    } catch (err) {
      setError('保存配置失败，请重试')
      // SECURITY: Log error only, never apiKey
      console.error('[Oh My Prompt] SET_API_CONFIG error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await chrome.runtime.sendMessage({ type: MessageType.DELETE_API_CONFIG })

      if (response.success) {
        setSuccess('配置已删除')
        setConfig(null)
        setBaseUrl('')
        setApiKey('')
        setModelName('')
        setDeleteDialogOpen(false)
      } else {
        setError(response.error || '删除配置失败')
      }
    } catch (err) {
      setError('删除配置失败')
      console.error('[Oh My Prompt] DELETE_API_CONFIG error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50">
      <div className="w-[480px] max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h1 className="text-base font-semibold text-gray-900">API 配置</h1>
            {!config && (
              <p className="text-sm text-gray-500 mt-1">
                配置 Vision AI API 密钥以启用图片转提示词功能
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
            aria-label="关闭"
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Status indicator if configured */}
          {config && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">状态</span>
              <span className="text-sm flex items-center gap-1 text-green-600">
                <Check style={{ width: 14, height: 14 }} />
                已配置
              </span>
            </div>
          )}

          {/* API Base URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              API Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={loading}
            />
          </div>

          {/* API Key */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={loading}
            />
          </div>

          {/* Model Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="gpt-4-vision-preview"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Success message */}
          {success && (
            <p className="text-sm text-green-600">
              {success}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={loading}>
              <Check style={{ width: 16, height: 16 }} />
              {loading ? '保存中...' : '保存配置'}
            </Button>
            {(config || baseUrl || apiKey || modelName) && (
              <Button variant="outline" onClick={handleDeleteClick} disabled={loading}>
                <Trash2 style={{ width: 16, height: 16 }} />
                {loading ? '删除中...' : '删除配置'}
              </Button>
            )}
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-500 pt-2">
            提示：API 密钥仅存储在本地，不会同步到其他设备
          </p>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              此操作将删除您的 API 配置，是否继续？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
              {loading ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SettingsApp