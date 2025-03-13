'use client'

import { useEffect, useRef } from 'react'
import Message from './Message'

export default function ChatContainer({ messages, isLoading }) {
  const containerRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div 
      ref={containerRef}
      className="chat-container flex-1 space-y-4 p-4 overflow-y-auto"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to Chat</h2>
            <p className="text-gray-500 dark:text-gray-400">Select a model and start chatting</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message 
            key={index}
            role={message.role}
            content={message.content}
          />
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
