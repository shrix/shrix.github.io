'use client'

import { useState } from 'react'

export default function Message({ role, content, modelType = 'gpt' }) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'} mb-4 relative group`}>
      <div className={`px-4 py-2 rounded-lg ${isUser ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
        {content}
      </div>
      
      {/* Copy button */}
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
    </div>
  )
}
