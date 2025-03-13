'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import SettingsModal from '../components/SettingsModal'

export default function ChatLayout({ children }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 dark:text-white">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        openSettings={() => setIsSettingsOpen(true)}
      />
      <main className="flex-1 flex flex-col">{children}</main>
      
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  )
}
