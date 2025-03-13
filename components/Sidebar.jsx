'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Sidebar({ collapsed, setCollapsed, openSettings }) {
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [apiStatus, setApiStatus] = useState('API Key Reqd for ChatGPT')
  const [isHovering, setIsHovering] = useState(false)

  // Update API status when model changes
  useEffect(() => {
    // Check local storage for API keys
    const gptKey = localStorage.getItem('gpt-api-key')
    const claudeKey = localStorage.getItem('claude-api-key')
    
    if (selectedModel === 'gpt') {
      setApiStatus(gptKey ? 'ChatGPT API Key set' : 'API Key Reqd for ChatGPT')
    } else if (selectedModel === 'claude') {
      setApiStatus(claudeKey ? 'Claude API Key set' : 'API Key Reqd for Claude')
    } else {
      setApiStatus(`${selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)} (Free)`)
    }
  }, [selectedModel])

  // Determine if sidebar should be visible
  const sidebarVisible = !collapsed || isHovering

  return (
    <div 
      className={`sidebar-container ${sidebarVisible ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out relative`}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className={`sidebar fixed h-full bg-slate-50 dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col ${sidebarVisible ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
        onMouseEnter={() => setIsHovering(true)}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Chat</h1>
          {/* Icons in the top-right corner */}
          <div className="flex items-center gap-[2px]">
            <ThemeToggle />
            <button 
              className="p-[2px] rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={openSettings}
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button 
              className="p-[2px] rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Pin sidebar" : "Unpin sidebar"}
            >
              {collapsed ? (
                // Enhanced pin sidebar icon (when sidebar is collapsed)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="14 7 19 12 14 17" />
                  <line x1="19" y1="4" x2="19" y2="20" strokeOpacity="0.8" />
                </svg>
              ) : (
                // Enhanced unpin sidebar icon (when sidebar is expanded)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="10 7 5 12 10 17" />
                  <line x1="5" y1="4" x2="5" y2="20" strokeOpacity="0.8" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Model</label>
          <select 
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gpt">ChatGPT (API Key Reqd)</option>
            <option value="claude">Claude (API Key Reqd)</option>
            <option value="gemini">Gemini (Free)</option>
            <option value="grok">Grok (Free)</option>
          </select>
        </div>

        <div className="flex-1">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            New Chat
          </button>
        </div>

        <div className="mt-auto pt-4 border-t dark:border-gray-700">
          <div className="text-sm text-amber-600 dark:text-amber-400 text-center">{apiStatus}</div>
        </div>
      </div>
      
      {/* Hover area to show sidebar when collapsed */}
      {collapsed && (
        <div 
          className="fixed top-0 left-0 w-16 h-full z-10"
          onMouseEnter={() => setIsHovering(true)}
        />
      )}
    </div>
  )
}
