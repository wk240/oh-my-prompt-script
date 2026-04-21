import { Download, RefreshCw, Upload, ArrowUpCircle } from 'lucide-react'
import { useState } from 'react'
import { MessageType } from '../../shared/messages'
import type { UpdateStatus } from '../../lib/version-checker'

interface HeaderProps {
  onImport: () => void
  onExport: () => void
  onRefresh: () => void
  onUpdateAvailable?: (status: UpdateStatus | null) => void
}

function Header({ onImport, onExport, onRefresh, onUpdateAvailable }: HeaderProps) {
  const [checking, setChecking] = useState(false)

  const handleCheckUpdate = () => {
    setChecking(true)
    chrome.runtime.sendMessage({ type: MessageType.CHECK_UPDATE }, (response) => {
      setChecking(false)
      if (response?.success && response.data) {
        onUpdateAvailable?.(response.data)
      }
    })
  }

  return (
    <header className="h-[68px] px-6 flex items-center justify-between border-b border-[#E5E5E5] bg-white">
      {/* Brand Section */}
      <div className="flex items-center gap-2.5">
        {/* Lightning Bolt Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 1L4 8H7.5L6.5 15L12 8H8.5L9.5 1Z"
            fill="#171717"
          />
        </svg>
        {/* Title */}
        <span
          className="text-[16px] font-semibold text-[#171717] tracking-[1px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Oh My Prompt Script
        </span>
        {/* Version Badge */}
        <span className="text-xs text-gray-400 font-normal">
          v{chrome.runtime.getManifest().version}
        </span>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-5">
        <button
          onClick={handleCheckUpdate}
          className={`p-2 hover:bg-gray-100 rounded transition-colors ${checking ? 'opacity-50' : ''}`}
          title="检查更新"
          disabled={checking}
        >
          <ArrowUpCircle className={`w-[20px] h-[20px] text-[#171717] ${checking ? 'animate-pulse' : ''}`} />
        </button>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="刷新数据"
        >
          <RefreshCw className="w-[20px] h-[20px] text-[#171717]" />
        </button>
        <button
          onClick={onImport}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="导入"
        >
          <Upload className="w-[20px] h-[20px] text-[#171717]" />
        </button>
        <button
          onClick={onExport}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="导出"
        >
          <Download className="w-[20px] h-[20px] text-[#171717]" />
        </button>
      </div>
    </header>
  )
}

export default Header