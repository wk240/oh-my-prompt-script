import { useState, lazy, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BackupSection } from '../settings/BackupSection'
import { LoadingSpinner } from '../components/LoadingSpinner'

const VisionSection = lazy(() =>
  import('../settings/VisionSection').then(m => ({ default: m.VisionSection }))
)
const ImportExportSection = lazy(() =>
  import('../settings/ImportExportSection').then(m => ({ default: m.ImportExportSection }))
)

interface SettingsViewProps {
  onBack: () => void
}

type SettingsTab = 'backup' | 'vision' | 'import-export'

const tabLabels: Record<SettingsTab, string> = {
  backup: '备份',
  vision: 'Vision',
  'import-export': '导入导出'
}

export default function SettingsView({ onBack }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('backup')

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">设置</h1>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 px-4 py-2 border-b border-gray-200">
        {(Object.keys(tabLabels) as SettingsTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'backup' && <BackupSection />}
        {activeTab === 'vision' && (
          <Suspense fallback={<LoadingSpinner className="py-8" />}>
            <VisionSection />
          </Suspense>
        )}
        {activeTab === 'import-export' && (
          <Suspense fallback={<LoadingSpinner className="py-8" />}>
            <ImportExportSection />
          </Suspense>
        )}
      </div>
    </div>
  )
}