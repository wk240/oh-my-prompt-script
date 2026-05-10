import { useState, useEffect, lazy, Suspense } from 'react'
import { LoadingSpinner } from './components/LoadingSpinner'
import { MessageType } from '@oh-my-prompt/shared/messages'

// Lazy load views
const PromptListView = lazy(() => import('./views/PromptListView').then(m => ({ default: m.default })))
const SettingsView = lazy(() => import('./views/SettingsView').then(m => ({ default: m.default })))

type CurrentView = 'prompts' | 'settings'

export default function SidePanelApp() {
  const [currentView, setCurrentView] = useState<CurrentView>('prompts')

  // Check sync status on mount to detect permission issues
  // Note: We don't request permission here because user gesture is already lost
  // (sidepanel.open is async, useEffect runs after that)
  useEffect(() => {
    // Check permission status via orchestrator
    chrome.runtime.sendMessage({ type: MessageType.GET_UNIFIED_SYNC_STATUS })
      .then((response) => {
        if (response?.success && response.data?.permissionStatus === 'prompt') {
          console.log('[Oh My Prompt] Sidepanel: folder permission needs restoration (prompt status)')
          // Don't auto-request - user gesture is lost
          // UnifiedSyncSection will show "需要重新授权" message and user can click to restore
        }
      })
      .catch(() => {
        // Silently ignore - folder may not be configured
      })
  }, []) // Run once on mount

  // Respond to SIDEPANEL_PING from service worker (check if sidepanel is open)
  useEffect(() => {
    const handleMessage = (
      message: { type: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ) => {
      if (message.type === MessageType.SIDEPANEL_PING) {
        sendResponse({ success: true, view: currentView })
        return true // Required for async response
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [currentView])

  // Check for navigation intent from content script (OPEN_SIDEPANEL_FOR_SETTINGS)
  useEffect(() => {
    // Initial check on mount
    chrome.storage.session.get('sidepanelIntent', (result) => {
      if (result.sidepanelIntent === 'settings') {
        setCurrentView('settings')
        // Clear intent after reading
        chrome.storage.session.remove('sidepanelIntent')
      }
    })

    // Listen for storage changes (handles case when sidepanel is already open)
    // Must use chrome.storage.onChanged (global) and filter by areaName === 'session'
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'session' && changes.sidepanelIntent?.newValue === 'settings') {
        setCurrentView('settings')
        // Clear intent after reading
        chrome.storage.session.remove('sidepanelIntent')
      }
    }
    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {currentView === 'prompts' ? (
        <PromptListView onOpenSettings={() => setCurrentView('settings')} />
      ) : (
        <SettingsView onBack={() => setCurrentView('prompts')} />
      )}
    </Suspense>
  )
}