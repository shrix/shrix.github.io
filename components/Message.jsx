'use client'

import { useState } from 'react'

export default function Message({ role, content, modelType = 'gpt' }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get model-specific indicator color
  const getModelIndicatorColor = () => {
    switch (modelType) {
      case 'gpt':
        return 'bg-green-500'
      case 'claude':
        return 'bg-purple-500'
      case 'gemini':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Get model name for display
  const getModelName = () => {
    switch (modelType) {
      case 'gpt':
        return 'OpenAI'
      case 'claude':
        return 'Claude'
      case 'gemini':
        return 'Gemini'
      default:
        return 'AI'
    }
  }

  return (
    <div className={`${role === 'user' ? 'user-message' : 'assistant-message'} relative group`}>
      {/* Model indicator for assistant messages */}
      {role === 'assistant' && (
        <div className="absolute -left-2 top-0 flex items-center">
          <div className={`w-1 h-full ${getModelIndicatorColor()}`}></div>
          <div className="absolute -left-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="ml-4 px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-md text-xs">
              {getModelName()}
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={copyToClipboard}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  )
}
