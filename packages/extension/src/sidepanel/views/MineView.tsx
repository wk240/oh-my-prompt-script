// packages/extension/src/sidepanel/views/MineView.tsx
import { useState, useEffect } from 'react'
// import { User, LogIn, LogOut, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react' // TODO: use in render
// import { Button } from '@/popup/components/ui/button' // TODO: use in render
import { MessageType } from '@oh-my-prompt/shared/messages'
import type { ProviderConfig, CloudAuthState, Provider, ProviderGroup } from '@oh-my-prompt/shared/types'
import { getAuthState } from '@/lib/cloud-sync/auth-service'
import { clearSupabaseClient } from '@/lib/cloud-sync/supabase-client'
// import { WEB_APP_URL } from '@/lib/config' // TODO: use in render
// import { OfficialVisionCard } from '@/popup/components/OfficialVisionCard' // TODO: use in render
// import { CollapsibleSection } from '@/popup/components/CollapsibleSection' // TODO: use in render
// import { ProviderSelect } from '@/popup/components/ProviderSelect' // TODO: use in render
// import { ModelSelect } from '@/popup/components/ModelSelect' // TODO: use in render
// import { SavedConfigsList } from '@/popup/components/SavedConfigsList' // TODO: use in render
import { loadSupportedProviders, groupProvidersByType } from '@/lib/provider-data'

export default function MineView() {
  // Auth state
  const [_authState, setAuthState] = useState<CloudAuthState | null>(null)

  // Vision/API states
  const [_configs, setConfigs] = useState<ProviderConfig[]>([])
  const [_activeConfigId, setActiveConfigId] = useState<string | null>(null)
  const [_providers, setProviders] = useState<Provider[]>([])
  const [_providerGroups, setProviderGroups] = useState<ProviderGroup[]>([])
  const [_visionEnabled, setVisionEnabled] = useState(true)

  // UI states
  const [_loading, setLoading] = useState(false)
  const [_error, setError] = useState<string | null>(null)
  const [_success, _setSuccess] = useState<string | null>(null)

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

  // TODO: Implement helper functions and render in next steps
  return (
    <div className="w-full p-4 space-y-4">
      {/* Placeholder - will implement in next tasks */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">MineView - 待实现</p>
      </div>
    </div>
  )
}