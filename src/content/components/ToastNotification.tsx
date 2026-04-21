/**
 * ToastNotification - Portal-rendered toast for collect success
 * Phase 8: Inline styled toast with auto-dismiss (D-16, D-18)
 */

import { createPortal } from 'react-dom'
import { useEffect } from 'react'

const PORTAL_ID = 'prompt-script-dropdown-portal'

function getPortalContainer(): HTMLElement {
  let container = document.getElementById(PORTAL_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = PORTAL_ID
    document.body.appendChild(container)
  }
  return container
}

interface ToastNotificationProps {
  message: string
  onClose: () => void
}

export function ToastNotification({ message, onClose }: ToastNotificationProps) {
  // D-18: Auto-dismiss after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '16px', // UI-SPEC
        right: '16px', // UI-SPEC
        background: '#171717', // UI-SPEC
        color: '#ffffff', // UI-SPEC
        padding: '12px 16px', // UI-SPEC
        borderRadius: '8px', // UI-SPEC
        fontSize: '12px', // UI-SPEC
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // UI-SPEC
        zIndex: 2147483647, // UI-SPEC
      }}
    >
      {message}
    </div>,
    getPortalContainer()
  )
}