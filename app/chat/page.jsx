'use client'

import { useState, useEffect } from 'react'
import ChatLayout from '../../layouts/ChatLayout'
import ChatContainer from '../../components/ChatContainer'
import MessageInput from '../../components/MessageInput'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [gptModel, setGptModel] = useState('gpt-3.5-turbo')
  const [claudeModel, setClaudeModel] = useState('claude-instant')

  // Get the selected model and model versions from localStorage when component mounts
  useEffect(() => {
    const storedModel = localStorage.getItem('selectedModel')
    const storedGptModel = localStorage.getItem('gpt-model')
    const storedClaudeModel = localStorage.getItem('claude-model')
    
    if (storedModel) {
      setSelectedModel(storedModel)
    }
    if (storedGptModel) {
      setGptModel(storedGptModel)
    }
    if (storedClaudeModel) {
      setClaudeModel(storedClaudeModel)
    }
  }, [])

  // Listen for changes to the selected model and model versions in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedModel') {
        setSelectedModel(e.newValue || 'gpt')
      } else if (e.key === 'gpt-model') {
        setGptModel(e.newValue || 'gpt-3.5-turbo')
      } else if (e.key === 'claude-model') {
        setClaudeModel(e.newValue || 'claude-instant')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleSendMessage = async (content) => {
    // Add user message to chat
    const userMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Get the current model version based on selected provider
      const currentModelVersion = selectedModel === 'gpt' 
        ? gptModel 
        : selectedModel === 'claude' 
          ? claudeModel 
          : 'gemini-flash-2'
      
      // Send to API and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gpt-model': gptModel,
          'x-claude-model': claudeModel
        },
        body: JSON.stringify({ 
          message: content, 
          model: selectedModel,
          apiKey: localStorage.getItem(`${selectedModel}-api-key`) || '',
          modelVersion: currentModelVersion
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      
      // Add assistant message to chat
      const assistantMessage = { role: 'assistant', content: data.content }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message to chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatLayout>
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
      />
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </ChatLayout>
  )
}
