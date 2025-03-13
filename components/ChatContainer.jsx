'use client'

import { useEffect, useRef } from 'react'
import Message from './Message'

export default function ChatContainer({ messages, isLoading, modelType = 'gpt' }) {
  const containerRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  // Get welcome message based on model type
  const getWelcomeMessage = () => {
    switch (modelType) {
      case 'gpt':
        return 'Welcome to ChatGPT'
      case 'claude':
        return 'Welcome to Claude'
      case 'gemini':
        return 'Welcome to Gemini'
      default:
        return 'Welcome to Chat'
    }
  }

  // Get model-specific color
  const getModelColor = () => {
    switch (modelType) {
      case 'gpt':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'claude':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
      case 'gemini':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div 
      ref={containerRef}
      className="chat-container flex-1 space-y-4 p-4 overflow-y-auto"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Type a message below to start chatting!
            </p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          message.role === 'system' && message.content === '--- New Chat ---' ? (
            <div key={index} className="flex justify-center my-6">
              <div className={`px-4 py-1 rounded-full text-sm ${getModelColor()}`}>
                New Chat
              </div>
            </div>
          ) : (
            <Message 
              key={index}
              role={message.role}
              content={message.content}
              modelType={modelType}
            />
          )
        ))
      )}
      
      {isLoading && (
        <div className="assistant-message flex items-center">
          <div className="loading"></div>
        </div>
      )}
    </div>
  )
}
