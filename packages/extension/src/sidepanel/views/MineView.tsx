// packages/extension/src/sidepanel/views/MineView.tsx
import { useState, useEffect } from 'react'
import { User, LogIn, Check, Sparkles, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '@/popup/components/ui/button'
import { MessageType } from '@oh-my-prompt/shared/messages'
import type { ProviderConfig, CloudAuthState, Provider, ProviderGroup } from '@oh-my-prompt/shared/types'
import { getAuthState, signOut } from '@/lib/cloud-sync/auth-service'
import { clearSupabaseClient } from '@/lib/cloud-sync/supabase-client'
import { WEB_APP_URL } from '@/lib/config'
import { loadSupportedProviders, groupProvidersByType } from '@/lib/provider-data'

export default function MineView() {
  // Auth state
  const [authState, setAuthState] = useState<CloudAuthState | null>(null)

  // Vision/API states
  const [configs, setConfigs] = useState<ProviderConfig[]>([])
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [providerGroups, setProviderGroups] = useState<ProviderGroup[]>([])
  const [visionEnabled, setVisionEnabled] = useState(true)

  // Quick config state
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [selectedModel, setSelectedModel] = useState('')
  const [apiKey, setApiKey] = useState('')

  // Custom config state
  const [customApiFormat, setCustomApiFormat] = useState<'anthropic_messages' | 'chat_completions'>('chat_completions')
  const [customEndpoint, setCustomEndpoint] = useState('')
  const [customModel, setCustomModel] = useState('')
  const [customApiKey, setCustomApiKey] = useState('')
  const [customName, setCustomName] = useState('')

  // Edit/Delete dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ProviderConfig | null>(null)
  const [editApiKey, setEditApiKey] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingConfigId, setDeletingConfigId] = useState<string | null>(null)

  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    getAuthState().then(setAuthState)
    const loadedProviders = loadSupportedProviders()
    setProviders(loadedProviders)
    setProviderGroups(groupProvidersByType(loadedProviders, true)) // exclude official
    loadConfigs()
    loadVisionSetting()
  }, [])

  // Listen for auth updates
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: { logout?: boolean } }) => {
      if (message.type === MessageType.AUTH_STATUS_UPDATE) {
        if (message.payload?.logout) {
          clearSupabaseClient()
          setAuthState({ status: 'not_logged_in' })
        } else {
          getAuthState().then(setAuthState)
        }
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  // Auto-select first model when provider changes
  useEffect(() => {
    if (selectedProvider?.models.length) {
      setSelectedModel(selectedProvider.models[0].id)
    }
  }, [selectedProvider])

  const loadConfigs = async () => {
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: MessageType.GET_PROVIDER_CONFIGS })
      if (response.success && response.data) {
        setConfigs(response.data.configs)
        setActiveConfigId(response.data.activeConfigId)
      }
      setError(null)
    } catch (err) {
      setError('获取配置失败')
    } finally {
      setLoading(false)
    }
  }

  const loadVisionSetting = async () => {
    chrome.storage.local.get('prompt_script_data', (result) => {
      if (result.prompt_script_data?.settings?.visionEnabled !== undefined) {
        setVisionEnabled(result.prompt_script_data.settings.visionEnabled)
      }
    })
  }

  const handleLogin = () => {
    chrome.tabs.create({ url: `${WEB_APP_URL}/auth/callback?source=extension` })
  }

  const handleLogout = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await signOut()
      if (result.success) {
        setSuccess('已退出登录')
        setAuthState({ status: 'not_logged_in' })
        await loadConfigs()
      } else {
        setError('退出失败')
      }
    } catch (err) {
      setError('退出失败')
    } finally {
      setLoading(false)
    }
  }

  const officialConfigId = 'omp-official-default'

  const handleActivateOfficial = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Try to activate existing config
      const response = await chrome.runtime.sendMessage({
        type: MessageType.SET_ACTIVE_CONFIG,
        payload: { id: officialConfigId }
      })

      if (response.success) {
        setActiveConfigId(officialConfigId)
        setSuccess('已激活官方服务')
      } else {
        // Create if not exists
        const createResponse = await chrome.runtime.sendMessage({
          type: MessageType.ADD_PROVIDER_CONFIG,
          payload: {
            id: officialConfigId,
            providerId: 'oh-my-prompt-official',
            providerName: 'Oh My Prompt 官方',
            apiKey: '',
            apiEndpoint: WEB_APP_URL + '/api/vision',
            apiFormat: 'omp_official',
            selectedModel: 'auto',
            isCustom: false,
            requiresAuth: true
          }
        })

        if (createResponse.success) {
          setActiveConfigId(officialConfigId)
          setSuccess('已激活官方服务')
          await loadConfigs()
        } else {
          setError(createResponse.error || '激活失败')
        }
      }
    } catch (err) {
      setError('激活失败')
    } finally {
      setLoading(false)
    }
  }

  const handleVisionToggle = async (enabled: boolean) => {
    setVisionEnabled(enabled)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.SET_SETTINGS_ONLY,
        payload: { settings: { visionEnabled: enabled } }
      })
      if (response.success) {
        setSuccess(enabled ? '转提示词功能已开启' : '转提示词功能已关闭')
      } else {
        setError('设置保存失败')
        setVisionEnabled(!enabled)
      }
    } catch (err) {
      setError('设置保存失败')
      setVisionEnabled(!enabled)
    }
  }

  // Permission request helper
  async function requestApiHostPermission(baseUrl: string): Promise<boolean> {
    try {
      const url = new URL(baseUrl)
      const origin = url.origin + '/*'
      const hasPermission = await chrome.permissions.contains({ origins: [origin] })
      if (hasPermission) return true
      const granted = await chrome.permissions.request({ origins: [origin] })
      return granted
    } catch (err) {
      console.warn('[Oh My Prompt] API permission request failed:', err)
      return false
    }
  }

  const handleSaveQuickConfig = async () => {
    setError(null)
    setSuccess(null)
    if (!selectedProvider) {
      setError('请选择服务商')
      return
    }
    if (!apiKey.trim()) {
      setError('API Key 不能为空')
      return
    }

    const endpoint = selectedProvider.apiEndpoint
    const permissionGranted = await requestApiHostPermission(endpoint)
    if (!permissionGranted) {
      setError('API域名访问权限未授予')
      return
    }

    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.ADD_PROVIDER_CONFIG,
        payload: {
          providerId: selectedProvider.id,
          providerName: selectedProvider.nameCn || selectedProvider.name,
          apiKey: apiKey.trim(),
          apiEndpoint: endpoint,
          apiFormat: selectedProvider.apiFormat,
          selectedModel: selectedModel
        }
      })
      if (response.success) {
        setSuccess('配置已保存')
        setApiKey('')
        await loadConfigs()
      } else {
        setError(response.error || '保存失败')
      }
    } catch (err) {
      setError('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomConfig = async () => {
    setError(null)
    setSuccess(null)
    if (!customEndpoint.trim()) {
      setError('API 地址不能为空')
      return
    }
    if (!customEndpoint.startsWith('https://')) {
      setError('API 地址必须使用 HTTPS')
      return
    }
    if (!customApiKey.trim()) {
      setError('API Key 不能为空')
      return
    }
    if (!customModel.trim()) {
      setError('模型名称不能为空')
      return
    }

    const permissionGranted = await requestApiHostPermission(customEndpoint.trim())
    if (!permissionGranted) {
      setError('API域名访问权限未授予')
      return
    }

    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.ADD_PROVIDER_CONFIG,
        payload: {
          providerId: 'custom',
          providerName: customName.trim() || '自定义配置',
          apiKey: customApiKey.trim(),
          apiEndpoint: customEndpoint.trim(),
          apiFormat: customApiFormat,
          selectedModel: customModel.trim(),
          isCustom: true
        }
      })
      if (response.success) {
        setSuccess('配置已保存')
        setCustomEndpoint('')
        setCustomApiKey('')
        setCustomModel('')
        setCustomName('')
        await loadConfigs()
      } else {
        setError(response.error || '保存失败')
      }
    } catch (err) {
      setError('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (id: string) => {
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.SET_ACTIVE_CONFIG,
        payload: { id }
      })
      if (response.success) {
        setActiveConfigId(id)
        setSuccess('已切换到此配置')
      } else {
        setError(response.error || '切换失败')
      }
    } catch (err) {
      setError('切换失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (config: ProviderConfig) => {
    setEditingConfig(config)
    setEditApiKey('')
    setEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (!editingConfig) return
    setError(null)
    if (!editApiKey.trim()) {
      setError('请输入新的 API Key')
      return
    }
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.UPDATE_PROVIDER_CONFIG,
        payload: { id: editingConfig.id, updates: { apiKey: editApiKey.trim() } }
      })
      if (response.success) {
        setSuccess('配置已更新')
        setEditDialogOpen(false)
        await loadConfigs()
      } else {
        setError(response.error || '更新失败')
      }
    } catch (err) {
      setError('更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeletingConfigId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingConfigId) return
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.DELETE_PROVIDER_CONFIG,
        payload: { id: deletingConfigId }
      })
      if (response.success) {
        setSuccess('配置已删除')
        setDeleteDialogOpen(false)
        await loadConfigs()
      } else {
        setError(response.error || '删除失败')
      }
    } catch (err) {
      setError('删除失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-4 space-y-4">
      {/* 账号状态区 */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        {authState?.status === 'logged_in' ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                {(authState.user?.email?.split('@')[0]?.charAt(0)?.toUpperCase() || 'U')}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-gray-900 leading-[1.4]">
                  {authState.user?.email?.split('@')[0] || '已登录'}
                  {authState.subscription?.planType && (
                    <span className="ml-1.5 text-[11px] text-amber-600 font-medium">
                      {authState.subscription.planType === 'pro' ? '会员' : authState.subscription.planType}
                    </span>
                  )}
                </p>
                {authState.user?.email && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{authState.user.email}</p>
                )}
              </div>
            </div>
            <div className="mt-2.5 flex justify-between items-center">
              <a
                href={`${WEB_APP_URL}/dashboard`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-500 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
              >
                进入Web端
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {loading ? '退出中...' : '退出登录'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">未登录</p>
              <Button
                onClick={handleLogin}
                className="mt-2 h-8 text-xs"
              >
                <LogIn className="w-3 h-3" />
                登录
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 官方服务区 - 登录后显示 */}
      {authState?.status === 'logged_in' && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Oh My Prompt 官方服务</p>
              <p className="text-xs text-gray-500 mt-1">登录后云端备份、Agent生成、图片转提示词均可使用</p>
            </div>
          </div>
          {activeConfigId === officialConfigId ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              已激活
            </div>
          ) : (
            <Button
              onClick={handleActivateOfficial}
              disabled={loading}
              className="w-full h-9"
            >
              {loading ? '激活中...' : '激活官方服务'}
            </Button>
          )}
        </div>
      )}

      {/* 功能开关区 */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">图片转提示词</p>
              <p className="text-xs text-gray-500">鼠标悬停图片时显示转换按钮</p>
            </div>
          </div>
          <button
            onClick={() => handleVisionToggle(!visionEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              visionEnabled ? 'bg-gray-900' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={visionEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                visionEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 第三方API配置区 - 功能开启后显示 */}
      {visionEnabled && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <CollapsibleSection
            title="第三方 API 配置"
            defaultExpanded={configs.filter(c => c.apiFormat !== 'omp_official').length === 0}
            hint={configs.length > 0 ? `已有 ${configs.length} 个配置` : '配置后可使用 Agent 和图片转提示词'}
          >
            <Tabs defaultValue="quick">
              <TabsList className="w-full">
                <TabsTrigger value="quick" className="flex-1">快速配置</TabsTrigger>
                <TabsTrigger value="custom" className="flex-1">自定义配置</TabsTrigger>
              </TabsList>

              <TabsContent value="quick">
                <div className="space-y-4 mt-4">
                  <ProviderSelect
                    providers={providers}
                    groups={providerGroups}
                    value={selectedProvider}
                    onChange={setSelectedProvider}
                    disabled={loading}
                  />
                  {selectedProvider && (
                    <ModelSelect
                      models={selectedProvider.models}
                      value={selectedModel}
                      onChange={setSelectedModel}
                      disabled={loading}
                    />
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">API密钥</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:border-gray-400"
                      disabled={loading}
                    />
                    {selectedProvider?.apiKeyUrl && (
                      <a
                        href={selectedProvider.apiKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                      >
                        获取 API Key <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <Button onClick={handleSaveQuickConfig} disabled={loading || !selectedProvider} className="w-full h-10">
                    <Check className="w-4 h-4" />
                    {loading ? '保存中...' : '保存配置'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">配置名称</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="我的自定义配置"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:border-gray-400"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">API 格式</label>
                    <select
                      value={customApiFormat}
                      onChange={(e) => setCustomApiFormat(e.target.value as typeof customApiFormat)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md bg-white focus:border-gray-400"
                      disabled={loading}
                    >
                      <option value="anthropic_messages">Anthropic 格式</option>
                      <option value="chat_completions">OpenAI 格式</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">API地址</label>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:border-gray-400"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">模型名称</label>
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="gpt-4o, qwen-vl-max 等"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:border-gray-400"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">API密钥</label>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:border-gray-400"
                      disabled={loading}
                    />
                  </div>
                  <Button onClick={handleSaveCustomConfig} disabled={loading} className="w-full h-10">
                    <Check className="w-4 h-4" />
                    {loading ? '保存中...' : '保存配置'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            {success && <p className="text-sm text-green-600 mt-4">{success}</p>}
          </CollapsibleSection>
        </div>
      )}

      {/* 已保存配置列表 */}
      {visionEnabled && configs.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <SavedConfigsList
            configs={configs}
            activeConfigId={activeConfigId}
            onActivate={handleActivate}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
          />
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>编辑配置</DialogTitle>
            <DialogDescription>更新 {editingConfig?.providerName} 的 API Key</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">新的 API Key</label>
            <input
              type="password"
              value={editApiKey}
              onChange={(e) => setEditApiKey(e.target.value)}
              placeholder="输入新的 API Key..."
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-gray-400"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEditSave} disabled={loading}>{loading ? '保存中...' : '保存'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>此操作将删除此配置，是否继续？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
              {loading ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}