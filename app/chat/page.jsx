'use client'

import { useState, useEffect } from 'react'
import ChatLayout from '../../layouts/ChatLayout'
import ChatContainer from '../../components/ChatContainer'
import MessageInput from '../../components/MessageInput'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')

  // Get the selected model from localStorage when component mounts
  useEffect(() => {
    const storedModel = localStorage.getItem('selectedModel')
    if (storedModel) {
      setSelectedModel(storedModel)
    }
  }, [])

  // Listen for changes to the selected model in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedModel = localStorage.getItem('selectedModel')
      if (storedModel && storedModel !== selectedModel) {
        setSelectedModel(storedModel)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [selectedModel])

  const handleSendMessage = async (content) => {
    // Add user message to chat
    const userMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send to API and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content, 
          model: selectedModel,
          apiKey: localStorage.getItem(`${selectedModel}-api-key`) || ''
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
