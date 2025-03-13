'use client'

import { useState, useEffect } from 'react'

export default function SettingsModal({ onClose }) {
  const [gptKey, setGptKey] = useState('')
  const [claudeKey, setClaudeKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt')

  useEffect(() => {
    // Load saved API keys and selected model
    setGptKey(localStorage.getItem('gpt-api-key') || '')
    setClaudeKey(localStorage.getItem('claude-api-key') || '')
    setSelectedModel(localStorage.getItem('selectedModel') || 'gpt')
  }, [])

  const saveSettings = () => {
    localStorage.setItem('gpt-api-key', gptKey)
    localStorage.setItem('claude-api-key', claudeKey)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Key Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {selectedModel === 'gpt' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="gpt-key" className="text-right">ChatGPT API Key</label>
              <input 
                id="gpt-key" 
                type="password" 
                className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                placeholder="sk-..." 
                value={gptKey}
                onChange={(e) => setGptKey(e.target.value)}
              />
              <div className="col-span-4 text-xs text-gray-500 dark:text-gray-400 text-right">
                Using ChatGPT 3.5 Turbo (most cost-effective)
              </div>
            </div>
          )}
          
          {selectedModel === 'claude' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="claude-key" className="text-right">Claude API Key</label>
              <input 
                id="claude-key" 
                type="password" 
                className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                placeholder="sk-ant-..." 
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
              />
              <div className="col-span-4 text-xs text-gray-500 dark:text-gray-400 text-right">
                Using Claude Instant (most cost-effective)
              </div>
            </div>
          )}
          
          {selectedModel === 'gemini' && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm">Gemini Flash 2.0 Experimental is available for free through Google AI Studio.</p>
              <p className="text-sm mt-2">No API key required for this model.</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveSettings}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
