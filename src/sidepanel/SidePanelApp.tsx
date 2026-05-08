import { useState, useEffect, lazy, Suspense } from 'react'
import { LoadingSpinner } from './components/LoadingSpinner'

// Lazy load views
const PromptListView = lazy(() => import('./views/PromptListView').then(m => ({ default: m.default })))
const SettingsView = lazy(() => import('./views/SettingsView').then(m => ({ default: m.default })))

type CurrentView = 'prompts' | 'settings'

export default function SidePanelApp() {
  const [currentView, setCurrentView] = useState<CurrentView>('prompts')

  // Check for navigation intent from content script (OPEN_SIDEPANEL_FOR_SETTINGS)
  useEffect(() => {
    chrome.storage.session.get('sidepanelIntent', (result) => {
      if (result.sidepanelIntent === 'settings') {
        setCurrentView('settings')
        // Clear intent after reading
        chrome.storage.session.remove('sidepanelIntent')
      }
    })
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