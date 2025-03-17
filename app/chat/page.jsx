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
  const [currentSessionId, setCurrentSessionId] = useState(null)
  
  // Track message timestamps for sorting
  const [messageTimestamps, setMessageTimestamps] = useState({})

  // Get the selected model and model versions from localStorage when component mounts
  useEffect(() => {
    const storedModel = localStorage.getItem('selectedModel')
    const storedGptModel = localStorage.getItem('gpt-model')
    const storedClaudeModel = localStorage.getItem('claude-model')
    const storedTimestamps = localStorage.getItem('message-timestamps')
    
    // Load saved messages for each model
    const storedGptMessages = localStorage.getItem('gpt-messages')
    const storedClaudeMessages = localStorage.getItem('claude-messages')
    const storedGeminiMessages = localStorage.getItem('gemini-messages')
    
    // First set the model type to ensure correct welcome message
    const model = storedModel || 'gpt'
    setSelectedModel(model)
    
    if (storedGptModel) {
      setGptModel(storedGptModel)
    }
    if (storedClaudeModel) {
      setClaudeModel(storedClaudeModel)
    }
    if (storedTimestamps) {
      try {
        setMessageTimestamps(JSON.parse(storedTimestamps))
      } catch (e) {
        console.error('Error parsing stored timestamps:', e)
      }
    }
    
    // Restore saved messages
    let gptMsgs = []
    let claudeMsgs = []
    let geminiMsgs = []
    
    if (storedGptMessages) {
      try {
        gptMsgs = JSON.parse(storedGptMessages)
        setGptMessages(gptMsgs)
      } catch (e) {
        console.error('Error parsing stored GPT messages:', e)
      }
    }
    if (storedClaudeMessages) {
      try {
        claudeMsgs = JSON.parse(storedClaudeMessages)
        setClaudeMessages(claudeMsgs)
      } catch (e) {
        console.error('Error parsing stored Claude messages:', e)
      }
    }
    if (storedGeminiMessages) {
      try {
        geminiMsgs = JSON.parse(storedGeminiMessages)
        setGeminiMessages(geminiMsgs)
      } catch (e) {
        console.error('Error parsing stored Gemini messages:', e)
      }
    }

    // After setting all the messages, try to initialize the current session ID
    const initializeSession = () => {
      // First check if we have a stored current session ID
      const storedSessionId = localStorage.getItem('currentSessionId')
      
      if (storedSessionId) {
        console.log('Found stored currentSessionId:', storedSessionId)
        setCurrentSessionId(storedSessionId)
        
        // Dispatch a session changed event to update other components
        setTimeout(() => {
          const sessionChangedEvent = new CustomEvent('sessionChanged', {
            detail: { sessionId: storedSessionId, model }
          })
          window.dispatchEvent(sessionChangedEvent)
          
          // Force UI updates
          window.dispatchEvent(new Event('forceRender'))
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100)
      } else {
        // If no stored session ID, try to find the most recent session separator
        let selectedMessages = []
        
        switch (model) {
          case 'gpt':
            selectedMessages = gptMsgs
            break
          case 'claude':
            selectedMessages = claudeMsgs
            break
          case 'gemini':
            selectedMessages = geminiMsgs
            break
        }
        
        // Find the most recent separator message (going backward through the array)
        if (selectedMessages.length > 0) {
          for (let i = selectedMessages.length - 1; i >= 0; i--) {
            const msg = selectedMessages[i]
            if (msg.role === 'system' && msg.content === '--- New Chat ---' && msg.id) {
              console.log('Found most recent separator with ID:', msg.id)
              setCurrentSessionId(msg.id)
              
              // Store it in localStorage for future reference
              localStorage.setItem('currentSessionId', msg.id)
              
              // Dispatch a session changed event to update other components
              setTimeout(() => {
                const sessionChangedEvent = new CustomEvent('sessionChanged', {
                  detail: { sessionId: msg.id, model }
                })
                window.dispatchEvent(sessionChangedEvent)
                
                // Force UI updates
                window.dispatchEvent(new Event('forceRender'))
                window.dispatchEvent(new Event('messagesUpdated'))
              }, 100)
              
              break
            }
          }
        } else {
          console.log('No messages found for selected model, creating initial chat')
          
          // If no messages at all, create the first chat
          const sessionId = `${model}-separator-${Date.now()}`
          const event = new CustomEvent('newChat', { 
            detail: { model, sessionId } 
          })
          window.dispatchEvent(event)
          
          console.log('Dispatched initial newChat event with ID:', sessionId)
        }
      }
    }
    
    // Slight delay to ensure all state is set correctly before initializing session
    setTimeout(initializeSession, 50)
  }, [])

  // Generate a unique ID for a message
  const generateMessageId = (modelType, index) => {
    return `${modelType}-${index}`
  }

  // Listen for changes to the selected model and model versions in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedModel') {
        setSelectedModel(e.newValue || 'gpt')
      } else if (e.key === 'gpt-model') {
        setGptModel(e.newValue || 'gpt-4o-mini')
      } else if (e.key === 'claude-model') {
        setClaudeModel(e.newValue || 'claude-instant')
      } else if (e.key === 'message-timestamps') {
        try {
          setMessageTimestamps(JSON.parse(e.newValue || '{}'))
        } catch (e) {
          console.error('Error parsing stored timestamps:', e)
        }
      }
    }

    // Listen for custom model change event
    const handleModelChange = (e) => {
      console.log('handleModelChange called with model:', e.detail.model)
      
      // Set the model type first
      setSelectedModel(e.detail.model)
      
      // Find the most recent session for the new model
      let messages = []
      switch (e.detail.model) {
        case 'gpt':
          messages = gptMessages
          break
        case 'claude':
          messages = claudeMessages
          break
        case 'gemini':
          messages = geminiMessages
          break
        default:
          console.error('Unknown model:', e.detail.model)
          return
      }
      
      // Find the most recent separator
      const lastSeparator = messages.slice().reverse().find(msg => 
        msg.role === 'system' && msg.content === '--- New Chat ---'
      )
      
      if (lastSeparator) {
        console.log('Found last separator with ID:', lastSeparator.id)
        setCurrentSessionId(lastSeparator.id)
        console.log('Current session ID set by handleModelChange to:', lastSeparator.id)
        
        // Dispatch a session changed event to update other components
        const sessionChangedEvent = new CustomEvent('sessionChanged', {
          detail: { sessionId: lastSeparator.id, model: e.detail.model }
        })
        window.dispatchEvent(sessionChangedEvent)
        
        // Force a re-render of the ChatContainer
        setTimeout(() => {
          window.dispatchEvent(new Event('forceRender'))
        }, 50)
      } else {
        console.log('No separator found for model:', e.detail.model)
        // If there are no separators, we should set currentSessionId to null
        // This will show the welcome message
        setCurrentSessionId(null)
        console.log('Current session ID reset to null by handleModelChange')
        
        // Force a re-render of the ChatContainer
        setTimeout(() => {
          window.dispatchEvent(new Event('forceRender'))
        }, 50)
        
        // If there are no messages at all for this model, create a new chat
        if (messages.length === 0) {
          console.log('No messages found for model, creating new chat')
          const sessionId = `${e.detail.model}-separator-${Date.now()}`
          const newChatEvent = new CustomEvent('newChat', { 
            detail: { model: e.detail.model, sessionId } 
          })
          window.dispatchEvent(newChatEvent)
        }
      }
    }
    
    // Listen for new chat event
    const handleNewChat = (e) => {
      const model = e.detail?.model || selectedModel
      const sessionId = e.detail?.sessionId || `${model}-separator-${Date.now()}`
      console.log('handleNewChat called with model:', model, 'sessionId:', sessionId)
      
      // Add a separator to the current model's messages
      let currentMessages = []
      
      switch (model) {
        case 'gpt':
          currentMessages = [...gptMessages]
          // Add the separator with a unique ID
          currentMessages.push({ 
            role: 'system', 
            content: '--- New Chat ---',
            id: sessionId,
            timestamp: Date.now()
          })
          // Save to localStorage
          localStorage.setItem('gpt-messages', JSON.stringify(currentMessages))
          // Update state
          setGptMessages(currentMessages)
          break
        case 'claude':
          currentMessages = [...claudeMessages]
          // Add the separator with a unique ID
          currentMessages.push({ 
            role: 'system', 
            content: '--- New Chat ---',
            id: sessionId,
            timestamp: Date.now()
          })
          // Save to localStorage
          localStorage.setItem('claude-messages', JSON.stringify(currentMessages))
          // Update state
          setClaudeMessages(currentMessages)
          break
        case 'gemini':
          currentMessages = [...geminiMessages]
          // Add the separator with a unique ID
          currentMessages.push({ 
            role: 'system', 
            content: '--- New Chat ---',
            id: sessionId,
            timestamp: Date.now()
          })
          // Save to localStorage
          localStorage.setItem('gemini-messages', JSON.stringify(currentMessages))
          // Update state
          setGeminiMessages(currentMessages)
          break
      }
      
      // Set the current session ID
      setCurrentSessionId(sessionId)
      console.log('Current session ID set by handleNewChat to:', sessionId)
      
      // Dispatch a session changed event to update other components
      const sessionChangedEvent = new CustomEvent('sessionChanged', {
        detail: { sessionId: sessionId, model: model }
      })
      window.dispatchEvent(sessionChangedEvent)
      
      // Force a re-render of the ChatContainer
      setTimeout(() => {
        window.dispatchEvent(new Event('forceRender'))
      }, 50)
      
      // Dispatch event to notify sidebar of message updates
      window.dispatchEvent(new Event('messagesUpdated'))
    }
    
    // Listen for load session event
    const handleLoadSession = (e) => {
      const { model, sessionId, hasMessages, isFallback } = e.detail
      console.log('Loading session:', sessionId, 'for model:', model, 'has messages:', hasMessages, 'isFallback:', isFallback)
      
      if (!sessionId) {
        console.error('No sessionId provided to handleLoadSession')
        return
      }
      
      // Set the selected model first
      setSelectedModel(model)
      
      // Set the current session ID
      setCurrentSessionId(sessionId)
      
      // Store it in localStorage for persistence
      localStorage.setItem('currentSessionId', sessionId)
      console.log('Current session ID set to:', sessionId)
      
      // Find the session in the messages
      let messages = []
      switch (model) {
        case 'gpt':
          messages = JSON.parse(localStorage.getItem('gpt-messages') || '[]')
          break
        case 'claude':
          messages = JSON.parse(localStorage.getItem('claude-messages') || '[]')
          break
        case 'gemini':
          messages = JSON.parse(localStorage.getItem('gemini-messages') || '[]')
          break
        default:
          console.error('Unknown model:', model)
          return
      }
      
      // If this is a fallback scenario for GPT, we need special handling
      if (isFallback && model === 'gpt') {
        console.log('Handling fallback GPT session...');
        
        // Create a new separator message with this ID if it doesn't exist
        const separatorExists = messages.some(msg => msg.id === sessionId);
        
        if (!separatorExists) {
          console.log('Creating new separator for fallback session');
          // Add a new separator with this ID
          const updatedMessages = [...messages, {
            role: 'system',
            content: '--- New Chat ---',
            id: sessionId,
            timestamp: Date.now()
          }];
          
          // Save to localStorage
          localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
          
          // Update state
          setGptMessages(updatedMessages);
          
          // Force UI updates
          setTimeout(() => {
            window.dispatchEvent(new Event('forceRender'));
            window.dispatchEvent(new Event('messagesUpdated'));
          }, 100);
          
          return;
        }
      }
      
      // Find the separator that starts this session
      const sessionIndex = messages.findIndex(msg => msg.id === sessionId)
      if (sessionIndex !== -1) {
        console.log('Found session at index:', sessionIndex)
        
        // Handle special case for GPT when the session is the first one
        if (model === 'gpt' && sessionIndex === 0) {
          console.log('Special handling for first GPT session');
          
          // Check if this is a separator
          const isSessionSeparator = 
            messages[sessionIndex].role === 'system' && 
            messages[sessionIndex].content === '--- New Chat ---';
          
          if (!isSessionSeparator) {
            console.log('First message is not a separator, adding one...');
            
            // Create a new separator message with this ID
            const newSeparator = {
              role: 'system',
              content: '--- New Chat ---',
              id: sessionId,
              timestamp: Date.now()
            };
            
            // Add the separator to the beginning of the messages
            const updatedMessages = [newSeparator, ...messages];
            
            // Save to localStorage
            localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
            
            // Update state
            setGptMessages(updatedMessages);
            
            // Force UI updates
            setTimeout(() => {
              window.dispatchEvent(new Event('forceRender'));
              window.dispatchEvent(new Event('messagesUpdated'));
            }, 100);
            
            return;
          }
        }
        
        // Check if there are any messages after this separator
        const hasMessagesAfterSeparator = sessionIndex < messages.length - 1
        console.log('Has messages after separator:', hasMessagesAfterSeparator)
        
        // Ensure this session's timestamp is updated to make it selectable
        if (model === 'gpt' && (!messages[sessionIndex].timestamp || messages[sessionIndex].timestamp === 0)) {
          console.log('Fixing missing timestamp for GPT session');
          
          const updatedMessages = [...messages];
          updatedMessages[sessionIndex] = {
            ...updatedMessages[sessionIndex],
            timestamp: Date.now()
          };
          
          // Save to localStorage
          localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
          
          // Update state
          setGptMessages(updatedMessages);
        }
        
        // Dispatch a session changed event to update other components
        const sessionChangedEvent = new CustomEvent('sessionChanged', {
          detail: { 
            sessionId: sessionId, 
            model: model,
            hasMessages: hasMessagesAfterSeparator 
          }
        })
        window.dispatchEvent(sessionChangedEvent)
        
        // Force a re-render of the ChatContainer
        setTimeout(() => {
          window.dispatchEvent(new Event('forceRender'))
        }, 50)
        
        // Refresh the sidebar
        setTimeout(() => {
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100)
      } else {
        console.error('Session not found:', sessionId, 'in model:', model)
        
        // Special handling for GPT sessions that can't be found
        if (model === 'gpt') {
          console.log('Session not found for GPT, creating a new one...');
          
          // Create a new separator with this ID
          const newSeparator = {
            role: 'system',
            content: '--- New Chat ---',
            id: sessionId,
            timestamp: Date.now()
          };
          
          // Add the separator to the messages
          const updatedMessages = [...messages, newSeparator];
          
          // Save to localStorage
          localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
          
          // Update state
          setGptMessages(updatedMessages);
          
          // Force UI updates
          setTimeout(() => {
            window.dispatchEvent(new Event('forceRender'));
            window.dispatchEvent(new Event('messagesUpdated'));
          }, 100);
          
          return;
        }
        
        // Even if we can't find the session, we should still update the UI
        // to show that we're trying to load this session
        const sessionChangedEvent = new CustomEvent('sessionChanged', {
          detail: { 
            sessionId: sessionId, 
            model: model,
            hasMessages: false
          }
        })
        window.dispatchEvent(sessionChangedEvent)
        
        // Also dispatch additional updates to ensure the UI refreshes properly
        setTimeout(() => {
          window.dispatchEvent(new Event('forceRender'))
        }, 50)
        setTimeout(() => {
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100)
      }
    }
    
    // Listen for session changed event
    const handleSessionChanged = (e) => {
      if (e.detail && e.detail.sessionId) {
        const newSessionId = e.detail.sessionId;
        
        // Only update if the session ID has actually changed
        if (currentSessionId !== newSessionId) {
          console.log('Session changed from', currentSessionId, 'to', newSessionId);
          setCurrentSessionId(newSessionId);
          
          // Force UI updates
          setTimeout(() => {
            window.dispatchEvent(new Event('forceRender'));
          }, 50);
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('modelChanged', handleModelChange)
    window.addEventListener('newChat', handleNewChat)
    window.addEventListener('loadSession', handleLoadSession)
    window.addEventListener('sessionChanged', handleSessionChanged)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('modelChanged', handleModelChange)
      window.removeEventListener('newChat', handleNewChat)
      window.removeEventListener('loadSession', handleLoadSession)
      window.removeEventListener('sessionChanged', handleSessionChanged)
    }
  }, [gptMessages, claudeMessages, geminiMessages, selectedModel])
  
  // Update localStorage when messages change
  useEffect(() => {
    localStorage.setItem('gpt-messages', JSON.stringify(gptMessages))
    localStorage.setItem('selectedModel', selectedModel)
    localStorage.setItem('message-timestamps', JSON.stringify(messageTimestamps))
    
    // Only dispatch one messagesUpdated event after all state is updated
    if (selectedModel === 'gpt') {
      // Throttle the event dispatch to avoid too many updates
      const timeoutId = setTimeout(() => {
        window.dispatchEvent(new Event('messagesUpdated'))
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [gptMessages, selectedModel, messageTimestamps])
  
  useEffect(() => {
    localStorage.setItem('claude-messages', JSON.stringify(claudeMessages))
    
    if (selectedModel === 'claude') {
      // Throttle the event dispatch to avoid too many updates
      const timeoutId = setTimeout(() => {
        window.dispatchEvent(new Event('messagesUpdated'))
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [claudeMessages, selectedModel])
  
  useEffect(() => {
    localStorage.setItem('gemini-messages', JSON.stringify(geminiMessages))
    
    if (selectedModel === 'gemini') {
      // Throttle the event dispatch to avoid too many updates
      const timeoutId = setTimeout(() => {
        window.dispatchEvent(new Event('messagesUpdated'))
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [geminiMessages, selectedModel])
  
  // Store current session ID in localStorage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId)
      console.log('Stored currentSessionId in localStorage:', currentSessionId)
    }
  }, [currentSessionId])
  
  // Load current session ID from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('currentSessionId')
    if (storedSessionId) {
      console.log('Loaded currentSessionId from localStorage:', storedSessionId)
      setCurrentSessionId(storedSessionId)
    }
  }, [])

  // Log whenever currentSessionId changes to help with debugging
  useEffect(() => {
    console.log('currentSessionId changed to:', currentSessionId);
  }, [currentSessionId]);

  // Get the current messages based on selected model
  const getCurrentMessages = () => {
    const currentTime = Date.now();
    // Return only the selected model's messages
    switch (selectedModel) {
      case 'gpt':
        return gptMessages.map((msg, index) => ({ 
          ...msg, 
          modelType: 'gpt',
          // Only add an id if one doesn't already exist
          id: msg.id || generateMessageId('gpt', index),
          // Ensure all messages have timestamps
          timestamp: msg.timestamp || messageTimestamps[msg.id] || currentTime
        }))
      case 'claude':
        return claudeMessages.map((msg, index) => ({ 
          ...msg, 
          modelType: 'claude',
          // Only add an id if one doesn't already exist
          id: msg.id || generateMessageId('claude', index),
          // Ensure all messages have timestamps
          timestamp: msg.timestamp || messageTimestamps[msg.id] || currentTime
        }))
      case 'gemini':
        return geminiMessages.map((msg, index) => ({ 
          ...msg, 
          modelType: 'gemini',
          // Only add an id if one doesn't already exist
          id: msg.id || generateMessageId('gemini', index),
          // Ensure all messages have timestamps
          timestamp: msg.timestamp || messageTimestamps[msg.id] || currentTime
        }))
      default:
        return []
    }
  }
  
  // Set messages for the current model
  const setCurrentMessages = (messages) => {
    // If messages have modelType, they're from unified view
    // and we should ignore them
    if (messages.length > 0 && messages[0].modelType) {
      return
    }
    
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

  // Helper function to ensure all messages across all models are consistently stored
  const updateSessionTimestamp = (sessionId, model) => {
    if (!sessionId) return;
    
    console.log(`Updating timestamp for ${model} session ${sessionId}`);
    
    const now = Date.now();
    
    try {
      // Update in localStorage to ensure consistency
      const messagesKey = `${model}-messages`;
      const storedMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
      
      // Find and update ONLY the specific separator with matching ID
      let found = false;
      const updatedMessages = storedMessages.map(msg => {
        if (msg.id === sessionId && msg.role === 'system' && msg.content === '--- New Chat ---') {
          found = true;
          console.log(`Found and updating separator with ID ${sessionId}`);
          return { ...msg, timestamp: now };
        }
        return msg;
      });
      
      if (!found) {
        console.warn(`Could not find separator with ID ${sessionId} in ${model} messages`);
      }
      
      // Save back to localStorage
      localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));
      
      // Also update in memory state, ensuring we only update the correct separator
      switch (model) {
        case 'gpt':
          setGptMessages(prev => 
            prev.map(msg => 
              (msg.id === sessionId && msg.role === 'system' && msg.content === '--- New Chat ---') 
                ? { ...msg, timestamp: now } 
                : msg
            )
          );
          break;
        case 'claude':
          setClaudeMessages(prev => 
            prev.map(msg => 
              (msg.id === sessionId && msg.role === 'system' && msg.content === '--- New Chat ---') 
                ? { ...msg, timestamp: now } 
                : msg
            )
          );
          break;
        case 'gemini':
          setGeminiMessages(prev => 
            prev.map(msg => 
              (msg.id === sessionId && msg.role === 'system' && msg.content === '--- New Chat ---') 
                ? { ...msg, timestamp: now } 
                : msg
            )
          );
          break;
      }
    } catch (e) {
      console.error(`Error updating ${model} timestamp:`, e);
    }
  }

  const handleSendMessage = async (content) => {
    console.log('handleSendMessage called with currentSessionId:', currentSessionId);
    
    // Special handling to ensure we're working with a valid session ID for GPT
    let sessionIdToUse = currentSessionId;
    if (selectedModel === 'gpt' && currentSessionId && !currentSessionId.startsWith('gpt-separator-')) {
      console.log('Detected malformed GPT session ID:', currentSessionId);
      
      // Create a replacement session ID
      sessionIdToUse = `gpt-separator-${Date.now()}-fixed`;
      console.log('Created replacement session ID:', sessionIdToUse);
      
      // Update the current session ID
      setCurrentSessionId(sessionIdToUse);
      localStorage.setItem('currentSessionId', sessionIdToUse);
      
      // Add a new separator with this ID
      const newSeparator = {
        role: 'system',
        content: '--- New Chat ---',
        id: sessionIdToUse,
        timestamp: Date.now()
      };
      
      // Add the separator to the current messages
      const updatedMessages = [...gptMessages, newSeparator];
      setGptMessages(updatedMessages);
      localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
      
      // Dispatch a session changed event
      const sessionChangedEvent = new CustomEvent('sessionChanged', {
        detail: { sessionId: sessionIdToUse }
      });
      window.dispatchEvent(sessionChangedEvent);
      
      // Force a refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('messagesUpdated'));
        window.dispatchEvent(new Event('forceRender'));
      }, 100);
    }
    
    // Add user message to current model's chat
    const userMessage = { 
      role: 'user', 
      content, 
      modelType: selectedModel,
      // Add a unique ID for the user message that won't conflict with separator IDs
      id: `${selectedModel}-message-${Date.now()}`,
      // Add a session property to track which conversation this message belongs to
      sessionId: sessionIdToUse,
      // Add timestamp directly to the message
      timestamp: Date.now()
    }
    
    // Get current messages with modelType property preserved
    const currentMessages = getCurrentMessages()
    
    // Check if we're in a new chat (last message is a separator)
    const isNewChat = (messages) => {
      return messages.length > 0 && 
        messages[messages.length - 1].role === 'system' && 
        messages[messages.length - 1].content === '--- New Chat ---';
    };
    
    // Add the user message to the current model's messages, respecting currentSessionId
    console.log('Adding message to session:', sessionIdToUse);
    
    // Check if we should preserve the current conversation context
    let preserveContext = sessionIdToUse !== null;
    console.log('Preserve conversation context:', preserveContext);
    
    // Update the timestamp of the current session separator to ensure it moves to the top of the list
    if (sessionIdToUse) {
      // Use the common helper to update timestamps consistently
      updateSessionTimestamp(sessionIdToUse, selectedModel);
    }
    
    switch (selectedModel) {
      case 'gpt':
        console.log('Sending message to GPT model with conversation context preserved:', preserveContext);
        // Check if we have a current session ID and we're not starting a new chat
        if (sessionIdToUse && !isNewChat(gptMessages)) {
          // Add to existing conversation
          setGptMessages([...gptMessages, userMessage]);
          console.log('Added message to existing GPT conversation with session ID:', sessionIdToUse);
        } else if (isNewChat(gptMessages)) {
          // Start a new conversation with just this message
          const newMessages = [...gptMessages, userMessage];
          setGptMessages(newMessages);
          console.log('Started new GPT conversation because last message was a separator');
        } else {
          // Add to existing conversation (fallback)
          setGptMessages([...gptMessages, userMessage]);
          console.log('Added message to GPT conversation (fallback case)');
        }
        
        // Add timestamp for the new message
        setMessageTimestamps(prev => {
          return { ...prev, [userMessage.id]: Date.now() };
        });
        
        // Force a refresh of the chat history
        setTimeout(() => {
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100);
        break;
      case 'claude':
        console.log('Sending message to Claude model with conversation context preserved:', preserveContext);
        // Check if we have a current session ID and we're not starting a new chat
        if (sessionIdToUse && !isNewChat(claudeMessages)) {
          // Add to existing conversation
          setClaudeMessages([...claudeMessages, userMessage]);
          console.log('Added message to existing Claude conversation with session ID:', sessionIdToUse);
        } else if (isNewChat(claudeMessages)) {
          // Start a new conversation with just this message
          const newMessages = [...claudeMessages, userMessage];
          setClaudeMessages(newMessages);
          console.log('Started new Claude conversation because last message was a separator');
        } else {
          // Add to existing conversation (fallback)
          setClaudeMessages([...claudeMessages, userMessage]);
          console.log('Added message to Claude conversation (fallback case)');
        }
        
        // Add timestamp for the new message
        setMessageTimestamps(prev => {
          return { ...prev, [userMessage.id]: Date.now() };
        });
        
        // Force a refresh of the chat history
        setTimeout(() => {
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100);
        break;
      case 'gemini':
        console.log('Sending message to Gemini model with conversation context preserved:', preserveContext);
        // Check if we have a current session ID and we're not starting a new chat
        if (sessionIdToUse && !isNewChat(geminiMessages)) {
          // Add to existing conversation
          setGeminiMessages([...geminiMessages, userMessage]);
          console.log('Added message to existing Gemini conversation with session ID:', sessionIdToUse);
        } else if (isNewChat(geminiMessages)) {
          // Start a new conversation with just this message
          const newMessages = [...geminiMessages, userMessage];
          setGeminiMessages(newMessages);
          console.log('Started new Gemini conversation because last message was a separator');
        } else {
          // Add to existing conversation (fallback)
          setGeminiMessages([...geminiMessages, userMessage]);
          console.log('Added message to Gemini conversation (fallback case)');
        }
        
        // Add timestamp for the new message
        setMessageTimestamps(prev => {
          return { ...prev, [userMessage.id]: Date.now() };
        });
        
        // Force a refresh of the chat history
        setTimeout(() => {
          window.dispatchEvent(new Event('messagesUpdated'))
        }, 100);
        break;
    }
    
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
          modelVersion: currentModelVersion,
          sessionId: sessionIdToUse // Pass the current session ID to the API
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      
      // Add assistant message to current model's chat with a unique ID
      const assistantMessage = { 
        role: 'assistant', 
        content: data.content, 
        modelType: selectedModel,
        id: `${selectedModel}-assistant-${Date.now()}`,
        sessionId: sessionIdToUse, // Use the validated session ID
        timestamp: Date.now() // Add timestamp directly to the message
      }
      
      // Add the assistant message to the current model's messages
      switch (selectedModel) {
        case 'gpt':
          // Add to the current conversation
          setGptMessages(prev => [...prev, assistantMessage])
          
          // Add timestamp for the new message
          setMessageTimestamps(prev => {
            return { ...prev, [assistantMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'gpt');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
        case 'claude':
          // Add to the current conversation
          setClaudeMessages(prev => [...prev, assistantMessage])
          
          // Add timestamp for the new message
          setMessageTimestamps(prev => {
            return { ...prev, [assistantMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'claude');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
        case 'gemini':
          // Add to the current conversation
          setGeminiMessages(prev => [...prev, assistantMessage])
          
          // Add timestamp for the new message
          setMessageTimestamps(prev => {
            return { ...prev, [assistantMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'gemini');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message to current model's chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message. Please try again.',
        modelType: selectedModel,
        id: `${selectedModel}-error-${Date.now()}`,
        sessionId: sessionIdToUse, // Use the validated session ID
        timestamp: Date.now() // Add timestamp directly to the message
      }
      
      // Add the error message to the current model's messages
      switch (selectedModel) {
        case 'gpt':
          // Add to the current conversation
          setGptMessages(prev => [...prev, errorMessage])
          
          // Add timestamp for the error message
          setMessageTimestamps(prev => {
            return { ...prev, [errorMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'gpt');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
        case 'claude':
          // Add to the current conversation
          setClaudeMessages(prev => [...prev, errorMessage])
          
          // Add timestamp for the error message
          setMessageTimestamps(prev => {
            return { ...prev, [errorMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'claude');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
        case 'gemini':
          // Add to the current conversation
          setGeminiMessages(prev => [...prev, errorMessage])
          
          // Add timestamp for the error message
          setMessageTimestamps(prev => {
            return { ...prev, [errorMessage.id]: Date.now() }
          })
          
          // Update the session timestamp to move it to the top
          updateSessionTimestamp(sessionIdToUse, 'gemini');
          
          // Force a refresh of the chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('messagesUpdated'))
          }, 100)
          break
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat history for the current model
  const clearCurrentChat = () => {
    if (confirm(`Are you sure you want to clear the ${selectedModel.toUpperCase()} chat history?`)) {
      // Clear messages for the current model
      switch (selectedModel) {
        case 'gpt':
          setGptMessages([])
          localStorage.setItem('gpt-messages', '[]')
          break
        case 'claude':
          setClaudeMessages([])
          localStorage.setItem('claude-messages', '[]')
          break
        case 'gemini':
          setGeminiMessages([])
          localStorage.setItem('gemini-messages', '[]')
          break
      }
      
      // Clear timestamps for this model
      setMessageTimestamps(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          if (key.startsWith(selectedModel)) {
            delete updated[key]
          }
        })
        localStorage.setItem('message-timestamps', JSON.stringify(updated))
        return updated
      })
      
      // Dispatch event to notify sidebar of message updates
      window.dispatchEvent(new Event('messagesUpdated'))
    }
  }

  // Start a new chat for the current model
  const startNewChat = () => {
    // Generate a new session ID
    const sessionId = `${selectedModel}-separator-${Date.now()}`
    
    // Dispatch the newChat event to trigger the handler
    const event = new CustomEvent('newChat', { 
      detail: { model: selectedModel, sessionId } 
    })
    window.dispatchEvent(event)
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full">
        <ChatContainer 
          key={`${selectedModel}-${currentSessionId}`}
          messages={getCurrentMessages()}
          isLoading={isLoading}
          modelType={selectedModel}
          currentSessionId={currentSessionId}
        />
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </ChatLayout>
  )
}