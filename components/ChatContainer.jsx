'use client'

import { useEffect, useRef, useState } from 'react'
import Message from './Message'

export default function ChatContainer({ messages, isLoading, modelType = 'gpt', currentSessionId }) {
  const containerRef = useRef(null)
  const [currentModelType, setCurrentModelType] = useState(modelType)
  const [localCurrentSessionId, setLocalCurrentSessionId] = useState(currentSessionId)

  // Update currentModelType when modelType changes
  useEffect(() => {
    console.log('modelType changed to:', modelType);
    setCurrentModelType(modelType)
  }, [modelType])
  
  // Update localCurrentSessionId when currentSessionId changes
  useEffect(() => {
    console.log('currentSessionId changed to:', currentSessionId);
    if (currentSessionId) {
      setLocalCurrentSessionId(currentSessionId);
      
      // Store in localStorage for persistence
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [currentSessionId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])
  
  // Listen for session changed event
  useEffect(() => {
    const handleSessionChanged = (e) => {
      if (e.detail && e.detail.sessionId) {
        console.log('Session changed event received with ID:', e.detail.sessionId);
        setLocalCurrentSessionId(e.detail.sessionId);
        
        // Store in localStorage for persistence
        localStorage.setItem('currentSessionId', e.detail.sessionId);
      }
    }
    
    const handleForceRender = () => {
      console.log('Force render event received');
      // This is just to force a re-render
      setCurrentModelType(prev => prev);
    }
    
    window.addEventListener('sessionChanged', handleSessionChanged)
    window.addEventListener('forceRender', handleForceRender)
    
    return () => {
      window.removeEventListener('sessionChanged', handleSessionChanged)
      window.removeEventListener('forceRender', handleForceRender)
    }
  }, [])

  // Get welcome message based on model type
  const getWelcomeMessage = () => {
    console.log('getWelcomeMessage called with currentModelType:', currentModelType);
    
    switch (currentModelType) {
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
  const getModelColor = (type = currentModelType) => {
    switch (type) {
      case 'gpt':
        return 'bg-green-500 text-white' // Green for OpenAI
      case 'claude':
        return 'bg-orange-500 text-white' // Orange for Claude
      case 'gemini':
        return 'bg-blue-500 text-white' // Blue for Gemini
      default:
        return 'bg-gray-500 text-white'
    }
  }
  
  // Render messages in a chronological flow
  const renderMessages = () => {
    console.log('renderMessages called with:');
    console.log('- localCurrentSessionId:', localCurrentSessionId);
    console.log('- currentModelType:', currentModelType);
    console.log('- Total messages:', messages.length);
    
    // If there are no messages at all, show the welcome message
    if (!messages || messages.length === 0) {
      const welcomeMessage = getWelcomeMessage();
      console.log('Rendering welcome message (no messages):', welcomeMessage);
      
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{welcomeMessage}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Type a message below to start chatting!
            </p>
          </div>
        </div>
      );
    }
    
    // Log all separators to help with debugging
    const separators = messages.filter(msg => 
      msg.role === 'system' && msg.content === '--- New Chat ---'
    );
    console.log('All separators:', separators.map(s => s.id));
    
    // CASE 1: User clicked on a specific conversation in the sidebar
    if (localCurrentSessionId) {
      console.log('Specific session selected with ID:', localCurrentSessionId);
      
      // Special handling for GPT sessions with problematic IDs
      let sessionIdToUse = localCurrentSessionId;
      if (modelType === 'gpt' && !localCurrentSessionId.startsWith('gpt-separator-')) {
        console.log('Detected malformed GPT session ID:', localCurrentSessionId);
        // We'll need to try different matching strategies
      }
      
      // First, try to filter messages by their sessionId property (most reliable)
      const sessionMessages = messages.filter(msg => {
        // Match messages that have a direct sessionId property
        if (msg.sessionId === sessionIdToUse) return true;
        
        // Match the separator itself
        if (msg.role === 'system' && 
            msg.content === '--- New Chat ---' && 
            msg.id === sessionIdToUse) return true;
        
        // For GPT specifically, we do additional matching for backward compatibility
        if (modelType === 'gpt' && msg.role === 'system' && 
            msg.content === '--- New Chat ---' && 
            msg.id && msg.id.includes(sessionIdToUse.split('-').pop())) {
          console.log('Found matching GPT separator by ID fragment:', msg.id);
          return true;
        }
        
        return false;
      });
      
      // If we found messages with matching sessionId, use those
      if (sessionMessages.length > 0) {
        console.log('Found messages with matching sessionId:', sessionMessages.length);
        
        // If the only message is the separator itself, show welcome message
        if (sessionMessages.length === 1 && 
            sessionMessages[0].role === 'system' && 
            sessionMessages[0].content === '--- New Chat ---') {
          const welcomeMessage = getWelcomeMessage();
          console.log('Rendering welcome message (empty session):', welcomeMessage);
          
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2">{welcomeMessage}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Type a message below to start chatting!
                </p>
              </div>
            </div>
          );
        }
        
        // Render messages for the selected session (excluding the separator itself)
        const messagesToRender = sessionMessages.filter(msg => 
          !(msg.role === 'system' && msg.content === '--- New Chat ---')
        );
        
        console.log('Rendering specific session messages:', messagesToRender.length);
        
        return messagesToRender.map((message, index) => {
          return (
            <Message 
              key={`${localCurrentSessionId}-${index}`}
              role={message.role}
              content={message.content}
              modelType={message.modelType || currentModelType}
            />
          );
        });
      }
      
      // Fallback to the old method if sessionId property is not available
      // Find the separator message with this ID
      let separatorIndex = messages.findIndex(msg => 
        msg.role === 'system' && 
        msg.content === '--- New Chat ---' && 
        msg.id === sessionIdToUse
      );
      
      // For GPT, if we can't find the separator directly, try partial matching
      if (separatorIndex === -1 && modelType === 'gpt') {
        // Try to match by ID fragment (the timestamp portion)
        const idFragment = sessionIdToUse.split('-').pop();
        if (idFragment) {
          separatorIndex = messages.findIndex(msg => 
            msg.role === 'system' && 
            msg.content === '--- New Chat ---' && 
            msg.id && msg.id.includes(idFragment)
          );
          
          if (separatorIndex !== -1) {
            console.log('Found separator using ID fragment matching:', messages[separatorIndex].id);
            
            // Update the current session ID for future use
            const correctSessionId = messages[separatorIndex].id;
            const sessionChangedEvent = new CustomEvent('sessionChanged', {
              detail: { sessionId: correctSessionId }
            });
            window.dispatchEvent(sessionChangedEvent);
          }
        }
      }
      
      // If we still can't find it, as a last resort, try content-based matching for GPT
      if (separatorIndex === -1 && modelType === 'gpt') {
        // Get all separators
        const allSeparators = messages
          .map((msg, idx) => ({ msg, idx }))
          .filter(item => item.msg.role === 'system' && item.msg.content === '--- New Chat ---');
        
        if (allSeparators.length > 0) {
          console.log('Attempting content-based matching for GPT session');
          
          // Default to the first separator if all else fails
          separatorIndex = allSeparators[0].idx;
          
          // Update the current session ID for future use
          const firstSeparatorId = allSeparators[0].msg.id;
          if (firstSeparatorId) {
            const sessionChangedEvent = new CustomEvent('sessionChanged', {
              detail: { sessionId: firstSeparatorId }
            });
            window.dispatchEvent(sessionChangedEvent);
          }
        }
      }
      
      if (separatorIndex !== -1) {
        console.log('Found separator at index:', separatorIndex);
        
        // Find the next separator (if any) to determine the end of this session
        let nextSeparatorIndex = -1;
        
        for (let i = separatorIndex + 1; i < messages.length; i++) {
          if (messages[i].role === 'system' && messages[i].content === '--- New Chat ---') {
            nextSeparatorIndex = i;
            break;
          }
        }
        
        // If no next separator found, use the end of the array
        if (nextSeparatorIndex === -1) {
          nextSeparatorIndex = messages.length;
        }
        
        console.log('Session range:', separatorIndex + 1, 'to', nextSeparatorIndex);
        
        // Get messages for this specific session (excluding the separator itself)
        const sessionMessages = messages.slice(separatorIndex + 1, nextSeparatorIndex);
        console.log('Session messages:', sessionMessages);
        
        // If there are no messages after the separator, show welcome message
        if (sessionMessages.length === 0) {
          const welcomeMessage = getWelcomeMessage();
          console.log('Rendering welcome message (empty session):', welcomeMessage);
          
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2">{welcomeMessage}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Type a message below to start chatting!
                </p>
              </div>
            </div>
          );
        }
        
        console.log('Rendering specific session messages:', sessionMessages.length);
        
        // Render messages for the selected session
        return sessionMessages.map((message, index) => {
          return (
            <Message 
              key={`${localCurrentSessionId}-${index}`}
              role={message.role}
              content={message.content}
              modelType={message.modelType || currentModelType}
            />
          );
        });
      } else {
        console.warn('Session ID not found:', localCurrentSessionId);
        // If we can't find the session, fall through to the default case
        // which will show the most recent conversation
      }
    }
    
    // CASE 2: User switched LLM providers or no specific session is selected
    // In this case, show the most recent conversation for the current model type
    
    // Check if the last message is a separator (indicating a new chat with no messages)
    const lastMessage = messages[messages.length - 1];
    const isNewEmptyChat = lastMessage && 
      lastMessage.role === 'system' && 
      lastMessage.content === '--- New Chat ---';
    
    if (isNewEmptyChat) {
      const welcomeMessage = getWelcomeMessage();
      console.log('Rendering welcome message (new empty chat):', welcomeMessage);
      
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{welcomeMessage}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Type a message below to start chatting!
            </p>
          </div>
        </div>
      );
    }
    
    // Find the most recent separator to determine which messages to show
    let startIndex = 0;
    let mostRecentSeparatorId = null;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'system' && messages[i].content === '--- New Chat ---') {
        startIndex = i + 1; // Start from the message after the separator
        mostRecentSeparatorId = messages[i].id;
        break;
      }
    }
    
    console.log('Showing most recent conversation starting at index:', startIndex);
    console.log('Most recent separator ID:', mostRecentSeparatorId);
    
    // Get only the messages for the current conversation (after the most recent separator)
    const currentConversationMessages = messages.slice(startIndex);
    
    // If there are no messages after the most recent separator, show welcome message
    if (currentConversationMessages.length === 0) {
      const welcomeMessage = getWelcomeMessage();
      console.log('Rendering welcome message (empty recent conversation):', welcomeMessage);
      
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{welcomeMessage}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Type a message below to start chatting!
            </p>
          </div>
        </div>
      );
    }
    
    // Render messages for the current conversation
    return currentConversationMessages.map((message, index) => {
      return (
        <Message 
          key={mostRecentSeparatorId ? `${mostRecentSeparatorId}-${index}` : `current-${index}`}
          role={message.role}
          content={message.content}
          modelType={message.modelType || currentModelType}
        />
      );
    });
  }

  return (
    <div 
      ref={containerRef}
      className="chat-container flex-1 space-y-4 p-4 overflow-y-auto"
    >
      {renderMessages()}
      
      {isLoading && (
        <div className="assistant-message flex items-center">
          <div className="loading"></div>
        </div>
      )}
    </div>
  )
}
