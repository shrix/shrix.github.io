'use client'

import { useState, useEffect } from 'react'
import ChatLayout from '../../layouts/ChatLayout'
import ChatContainer from '../../components/ChatContainer'
import MessageInput from '../../components/MessageInput'

export default function ChatPage() {
  // Maintain separate message histories for each model
  const [gptMessages, setGptMessages] = useState([])
  const [claudeMessages, setClaudeMessages] = useState([])
  const [geminiMessages, setGeminiMessages] = useState([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [gptModel, setGptModel] = useState('gpt-4o-mini')
  const [claudeModel, setClaudeModel] = useState('claude-instant')

  // Get the selected model and model versions from localStorage when component mounts
  useEffect(() => {
    const storedModel = localStorage.getItem('selectedModel')
    const storedGptModel = localStorage.getItem('gpt-model')
    const storedClaudeModel = localStorage.getItem('claude-model')
    
    // Load saved messages for each model
    const storedGptMessages = localStorage.getItem('gpt-messages')
    const storedClaudeMessages = localStorage.getItem('claude-messages')
    const storedGeminiMessages = localStorage.getItem('gemini-messages')
    
    if (storedModel) {
      setSelectedModel(storedModel)
    }
    if (storedGptModel) {
      setGptModel(storedGptModel)
    }
    if (storedClaudeModel) {
      setClaudeModel(storedClaudeModel)
    }
    
    // Restore saved messages
    if (storedGptMessages) {
      try {
        setGptMessages(JSON.parse(storedGptMessages))
      } catch (e) {
        console.error('Error parsing stored GPT messages:', e)
      }
    }
    if (storedClaudeMessages) {
      try {
        setClaudeMessages(JSON.parse(storedClaudeMessages))
      } catch (e) {
        console.error('Error parsing stored Claude messages:', e)
      }
    }
    if (storedGeminiMessages) {
      try {
        setGeminiMessages(JSON.parse(storedGeminiMessages))
      } catch (e) {
        console.error('Error parsing stored Gemini messages:', e)
      }
    }
  }, [])

  // Listen for changes to the selected model and model versions in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedModel') {
        setSelectedModel(e.newValue || 'gpt')
      } else if (e.key === 'gpt-model') {
        setGptModel(e.newValue || 'gpt-4o-mini')
      } else if (e.key === 'claude-model') {
        setClaudeModel(e.newValue || 'claude-instant')
      }
    }

    // Listen for custom model change event
    const handleModelChange = (e) => {
      setSelectedModel(e.detail.model)
    }
    
    // Listen for new chat event
    const handleNewChat = (e) => {
      // Start a new chat for the current model
      // We don't clear the messages, just add a visual separator
      const model = e.detail.model
      
      switch (model) {
        case 'gpt':
          // Add a system message as a separator
          setGptMessages(prev => {
            // Only add separator if there are messages
            if (prev.length === 0) return prev
            
            // Check if the last message is already a separator
            const lastMsg = prev[prev.length - 1]
            if (lastMsg.role === 'system' && lastMsg.content === '--- New Chat ---') {
              return prev
            }
            
            return [...prev, { role: 'system', content: '--- New Chat ---' }]
          })
          break
        case 'claude':
          setClaudeMessages(prev => {
            if (prev.length === 0) return prev
            const lastMsg = prev[prev.length - 1]
            if (lastMsg.role === 'system' && lastMsg.content === '--- New Chat ---') {
              return prev
            }
            return [...prev, { role: 'system', content: '--- New Chat ---' }]
          })
          break
        case 'gemini':
          setGeminiMessages(prev => {
            if (prev.length === 0) return prev
            const lastMsg = prev[prev.length - 1]
            if (lastMsg.role === 'system' && lastMsg.content === '--- New Chat ---') {
              return prev
            }
            return [...prev, { role: 'system', content: '--- New Chat ---' }]
          })
          break
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('modelChanged', handleModelChange)
    window.addEventListener('newChat', handleNewChat)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('modelChanged', handleModelChange)
      window.removeEventListener('newChat', handleNewChat)
    }
  }, [])
  
  // Save messages to localStorage whenever they change and dispatch messagesUpdated event
  useEffect(() => {
    localStorage.setItem('gpt-messages', JSON.stringify(gptMessages))
    // Dispatch event to notify sidebar of message updates
    window.dispatchEvent(new Event('messagesUpdated'))
  }, [gptMessages])
  
  useEffect(() => {
    localStorage.setItem('claude-messages', JSON.stringify(claudeMessages))
    window.dispatchEvent(new Event('messagesUpdated'))
  }, [claudeMessages])
  
  useEffect(() => {
    localStorage.setItem('gemini-messages', JSON.stringify(geminiMessages))
    window.dispatchEvent(new Event('messagesUpdated'))
  }, [geminiMessages])

  // Get the current messages based on selected model
  const getCurrentMessages = () => {
    switch (selectedModel) {
      case 'gpt':
        return gptMessages
      case 'claude':
        return claudeMessages
      case 'gemini':
        return geminiMessages
      default:
        return []
    }
  }
  
  // Set messages for the current model
  const setCurrentMessages = (messages) => {
    switch (selectedModel) {
      case 'gpt':
        setGptMessages(messages)
        break
      case 'claude':
        setClaudeMessages(messages)
        break
      case 'gemini':
        setGeminiMessages(messages)
        break
    }
  }

  const handleSendMessage = async (content) => {
    // Add user message to current model's chat
    const userMessage = { role: 'user', content }
    setCurrentMessages([...getCurrentMessages(), userMessage])
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
      
      // Add assistant message to current model's chat
      const assistantMessage = { role: 'assistant', content: data.content }
      setCurrentMessages([...getCurrentMessages(), assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message to current model's chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message. Please try again.' 
      }
      setCurrentMessages([...getCurrentMessages(), errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat history for the current model
  const clearCurrentChat = () => {
    if (confirm(`Are you sure you want to clear the ${selectedModel.toUpperCase()} chat history?`)) {
      setCurrentMessages([])
    }
  }

  // Start a new chat for the current model
  const startNewChat = () => {
    // Dispatch the newChat event to trigger the handler
    const event = new CustomEvent('newChat', { 
      detail: { model: selectedModel } 
    })
    window.dispatchEvent(event)
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedModel === 'gpt' && `Using: ${gptModel}`}
            {selectedModel === 'claude' && `Using: ${claudeModel}`}
            {selectedModel === 'gemini' && 'Using: Gemini Flash 2.0'}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={startNewChat}
              className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              New Chat
            </button>
            <button 
              onClick={clearCurrentChat}
              className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              Clear Chat
            </button>
          </div>
        </div>
        <ChatContainer 
          messages={getCurrentMessages()}
          isLoading={isLoading}
          modelType={selectedModel}
        />
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </ChatLayout>
  )
}
