'use client'

import { useState, useEffect } from 'react'

export default function SettingsModal({ onClose }) {
  const [gptKey, setGptKey] = useState('')
  const [claudeKey, setClaudeKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [gptModel, setGptModel] = useState('gpt-3.5-turbo')
  const [claudeModel, setClaudeModel] = useState('claude-instant')

  useEffect(() => {
    // Load saved API keys, selected model, and model versions
    setGptKey(localStorage.getItem('gpt-api-key') || '')
    setClaudeKey(localStorage.getItem('claude-api-key') || '')
    setSelectedModel(localStorage.getItem('selectedModel') || 'gpt')
    setGptModel(localStorage.getItem('gpt-model') || 'gpt-3.5-turbo')
    setClaudeModel(localStorage.getItem('claude-model') || 'claude-instant')
  }, [])

  const saveSettings = () => {
    localStorage.setItem('gpt-api-key', gptKey)
    localStorage.setItem('claude-api-key', claudeKey)
    localStorage.setItem('gpt-model', gptModel)
    localStorage.setItem('claude-model', claudeModel)
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
        <div className="space-y-6">
          {selectedModel === 'gpt' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="gpt-key" className="text-right">OpenAI API Key</label>
                <input 
                  id="gpt-key" 
                  type="password" 
                  className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                  placeholder="sk-..." 
                  value={gptKey}
                  onChange={(e) => setGptKey(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="gpt-model" className="text-right">Model</label>
                <select
                  id="gpt-model"
                  className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={gptModel}
                  onChange={(e) => setGptModel(e.target.value)}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>
              
              <div className="col-span-4 text-xs text-gray-500 dark:text-gray-400 text-right">
                GPT-3.5 Turbo is the most cost-effective option
              </div>
            </div>
          )}
          
          {selectedModel === 'claude' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="claude-key" className="text-right">Anthropic API Key</label>
                <input 
                  id="claude-key" 
                  type="password" 
                  className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                  placeholder="sk-ant-..." 
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="claude-model" className="text-right">Model</label>
                <select
                  id="claude-model"
                  className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                >
                  <option value="claude-instant">Claude Instant (Cheapest)</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                </select>
              </div>
              
              <div className="col-span-4 text-xs text-gray-500 dark:text-gray-400 text-right">
                Claude Instant is the most cost-effective option
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
