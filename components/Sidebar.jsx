'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Sidebar({ collapsed, setCollapsed, openSettings }) {
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [apiStatus, setApiStatus] = useState('API Key Reqd for ChatGPT')
  const [isHovering, setIsHovering] = useState(false)
  const [modelDisplayName, setModelDisplayName] = useState('ChatGPT 4o Mini')
  const [chatHistory, setChatHistory] = useState({
    gpt: [],
    claude: [],
    gemini: []
  })
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Update API status and model display name when model changes
  useEffect(() => {
    // Check local storage for API keys and model versions
    const gptKey = localStorage.getItem('gpt-api-key')
    const claudeKey = localStorage.getItem('claude-api-key')
    const gptModel = localStorage.getItem('gpt-model') || 'gpt-4o-mini'
    const claudeModel = localStorage.getItem('claude-model') || 'claude-instant'
    
    if (selectedModel === 'gpt') {
      setApiStatus(gptKey ? 'OpenAI API Key set' : 'API Key Reqd for OpenAI')
      
      // Set display name based on model version
      switch (gptModel) {
        case 'gpt-4o-mini':
          setModelDisplayName('ChatGPT 4o Mini')
          break
        case 'gpt-3.5-turbo':
          setModelDisplayName('ChatGPT 3.5 Turbo')
          break
        case 'gpt-4':
          setModelDisplayName('ChatGPT 4')
          break
        case 'gpt-4-turbo':
          setModelDisplayName('ChatGPT 4 Turbo')
          break
        case 'gpt-4o':
          setModelDisplayName('ChatGPT 4o')
          break
        default:
          setModelDisplayName('ChatGPT')
      }
    } else if (selectedModel === 'claude') {
      setApiStatus(claudeKey ? 'Anthropic API Key set' : 'API Key Reqd for Anthropic')
      
      // Set display name based on model version
      switch (claudeModel) {
        case 'claude-instant':
          setModelDisplayName('Claude Instant')
          break
        case 'claude-3-haiku':
          setModelDisplayName('Claude 3 Haiku')
          break
        case 'claude-3-sonnet':
          setModelDisplayName('Claude 3 Sonnet')
          break
        case 'claude-3-opus':
          setModelDisplayName('Claude 3 Opus')
          break
        default:
          setModelDisplayName('Claude')
      }
    } else {
      setApiStatus(`Gemini Flash 2.0 (Free)`)
      setModelDisplayName('Gemini Flash 2.0')
    }
  }, [selectedModel])

  // Load chat history from localStorage
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        // Get current session ID from localStorage (if available)
        const storedSessionId = localStorage.getItem('currentSessionId');
        if (storedSessionId) {
          // Ensure GPT session IDs always have the correct format
          if (storedSessionId && 
              localStorage.getItem('selectedModel') === 'gpt' && 
              !storedSessionId.startsWith('gpt-separator-')) {
            console.log('Found malformed GPT session ID in localStorage:', storedSessionId);
            // We'll create a proper one and store it for future use
            const correctedId = `gpt-separator-${Date.now()}-corrected`;
            localStorage.setItem('currentSessionId', correctedId);
            console.log('Corrected session ID to:', correctedId);
            setCurrentSessionId(correctedId);
          } else {
            setCurrentSessionId(storedSessionId);
            console.log('Sidebar loaded currentSessionId from localStorage:', storedSessionId);
          }
        }
        
        const gptMessages = JSON.parse(localStorage.getItem('gpt-messages') || '[]')
        const claudeMessages = JSON.parse(localStorage.getItem('claude-messages') || '[]')
        const geminiMessages = JSON.parse(localStorage.getItem('gemini-messages') || '[]')
        
        // Special handling for GPT messages to ensure they're properly formatted
        let fixedGptMessages = [...gptMessages];
        let gptMessagesFixed = false;
        
        // Make sure GPT messages have proper session separators
        if (fixedGptMessages.length > 0) {
          // Check if the first message is a separator
          if (!(fixedGptMessages[0].role === 'system' && fixedGptMessages[0].content === '--- New Chat ---')) {
            // Add a separator at the beginning
            const newSeparator = {
              role: 'system',
              content: '--- New Chat ---',
              id: `gpt-separator-${Date.now()}-first`,
              timestamp: fixedGptMessages[0].timestamp || Date.now()
            };
            fixedGptMessages = [newSeparator, ...fixedGptMessages];
            gptMessagesFixed = true;
          }
          
          // Make sure all separators have IDs and timestamps and that GPT separator IDs are properly formatted
          let anyFixes = false;
          let lastSeparatorIndex = -1;
          
          fixedGptMessages = fixedGptMessages.map((msg, index) => {
            if (msg.role === 'system' && msg.content === '--- New Chat ---') {
              lastSeparatorIndex = index;
              
              // Check if ID is missing or malformed
              if (!msg.id || !msg.id.startsWith('gpt-separator-')) {
                anyFixes = true;
                return {
                  ...msg,
                  id: `gpt-separator-${Date.now()}-${index}`,
                  timestamp: msg.timestamp || Date.now()
                };
              }
              
              // Check if timestamp is missing
              if (!msg.timestamp) {
                anyFixes = true;
                return {
                  ...msg,
                  timestamp: Date.now()
                };
              }
            }
            return msg;
          });
          
          // If the last separator doesn't have any messages after it, we might need to add a timestamp to ensure it appears in the list
          if (lastSeparatorIndex !== -1 && lastSeparatorIndex === fixedGptMessages.length - 1) {
            fixedGptMessages[lastSeparatorIndex].timestamp = Date.now();
            anyFixes = true;
          }
          
          if (anyFixes) {
            gptMessagesFixed = true;
          }
          
          // Save fixed messages back to localStorage if needed
          if (gptMessagesFixed) {
            console.log('Fixed GPT messages structure:', fixedGptMessages);
            localStorage.setItem('gpt-messages', JSON.stringify(fixedGptMessages));
          }
        }
        
        // Get timestamps for sorting
        const timestamps = JSON.parse(localStorage.getItem('message-timestamps') || '{}')
        
        // Split messages into sessions based on "--- New Chat ---" separators
        const gptSessions = splitIntoSessions(gptMessagesFixed ? fixedGptMessages : gptMessages, 'gpt', timestamps)
        const claudeSessions = splitIntoSessions(claudeMessages, 'claude', timestamps)
        const geminiSessions = splitIntoSessions(geminiMessages, 'gemini', timestamps)
        
        setChatHistory({
          gpt: gptSessions,
          claude: claudeSessions,
          gemini: geminiSessions
        })
        
        // If we don't have a currentSessionId yet but there are conversations available,
        // select the most recent conversation of the currently selected model
        if (!currentSessionId && !storedSessionId) {
          console.log('No currentSessionId, attempting to select the most recent conversation');
          
          const modelToLoad = localStorage.getItem('selectedModel') || 'gpt';
          let sessionsToCheck = [];
          
          switch (modelToLoad) {
            case 'gpt':
              sessionsToCheck = gptSessions;
              break;
            case 'claude':
              sessionsToCheck = claudeSessions;
              break;
            case 'gemini':
              sessionsToCheck = geminiSessions;
              break;
          }
          
          if (sessionsToCheck.length > 0) {
            // Sort by timestamp, newest first
            const sortedSessions = [...sessionsToCheck].sort((a, b) => 
              (b.timestamp || 0) - (a.timestamp || 0)
            );
            
            const mostRecentSession = sortedSessions[0];
            if (mostRecentSession && mostRecentSession.id) {
              console.log('Automatically selecting most recent session:', mostRecentSession.id);
              setCurrentSessionId(mostRecentSession.id);
              localStorage.setItem('currentSessionId', mostRecentSession.id);
              
              // Dispatch the session changed event
              const sessionChangedEvent = new CustomEvent('sessionChanged', {
                detail: { sessionId: mostRecentSession.id }
              });
              window.dispatchEvent(sessionChangedEvent);
              
              // Force a refresh to update the UI
              setTimeout(() => {
                window.dispatchEvent(new Event('forceRender'));
              }, 50);
            }
          }
        }
        
        // Special handling for stored session that might need fixing
        if (storedSessionId) {
          const selectedModel = localStorage.getItem('selectedModel') || 'gpt';
          
          // Special fix for GPT sessions with malformed IDs
          if (selectedModel === 'gpt' && !storedSessionId.startsWith('gpt-separator-')) {
            console.log('Stored session ID is malformed:', storedSessionId);
            
            // Try to find the first GPT session
            if (gptSessions.length > 0) {
              const firstSession = gptSessions[0];
              if (firstSession && firstSession.id) {
                console.log('Using first GPT session instead:', firstSession.id);
                
                // Update the session ID
                setCurrentSessionId(firstSession.id);
                localStorage.setItem('currentSessionId', firstSession.id);
                
                // Dispatch event
                const sessionChangedEvent = new CustomEvent('sessionChanged', {
                  detail: { sessionId: firstSession.id }
                });
                window.dispatchEvent(sessionChangedEvent);
                
                // Force a refresh to update the UI
                setTimeout(() => {
                  window.dispatchEvent(new Event('forceRender'));
                }, 50);
              }
            }
          }
        }
      } catch (e) {
        console.error('Error loading chat history:', e)
      }
    }
    
    // Load initially
    loadChatHistory()
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadChatHistory()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for when messages are updated
    const handleMessagesUpdated = () => {
      loadChatHistory()
    }
    
    window.addEventListener('messagesUpdated', handleMessagesUpdated)
    
    // Listen for session ID changes
    const handleSessionChange = (e) => {
      if (e.detail && e.detail.sessionId) {
        console.log('Sidebar received sessionChanged event with ID:', e.detail.sessionId);
        setCurrentSessionId(e.detail.sessionId)
      }
    }
    
    window.addEventListener('sessionChanged', handleSessionChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('messagesUpdated', handleMessagesUpdated)
      window.removeEventListener('sessionChanged', handleSessionChange)
    }
  }, [currentSessionId])

  // Listen for changes to model versions in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // Force a re-render when model versions change
      if (selectedModel === 'gpt') {
        const gptModel = localStorage.getItem('gpt-model')
        if (gptModel) {
          // This will trigger the first useEffect
          setSelectedModel(prev => {
            if (prev === 'gpt') {
              // Force re-render by toggling and then toggling back
              setTimeout(() => setSelectedModel('gpt'), 0)
              return 'gpt-temp'
            }
            return prev
          })
        }
      } else if (selectedModel === 'claude') {
        const claudeModel = localStorage.getItem('claude-model')
        if (claudeModel) {
          // This will trigger the first useEffect
          setSelectedModel(prev => {
            if (prev === 'claude') {
              // Force re-render by toggling and then toggling back
              setTimeout(() => setSelectedModel('claude'), 0)
              return 'claude-temp'
            }
            return prev
          })
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [selectedModel])

  // Save selected model to localStorage when it changes
  useEffect(() => {
    if (selectedModel !== 'gpt-temp' && selectedModel !== 'claude-temp') {
      localStorage.setItem('selectedModel', selectedModel)
    }
  }, [selectedModel])

  // Handle model change
  const handleModelChange = (e) => {
    const newModel = e.target.value
    setSelectedModel(newModel)
    
    // Dispatch a custom event to notify the chat page of the model change
    const modelChangedEvent = new CustomEvent('modelChanged', { 
      detail: { model: newModel } 
    })
    window.dispatchEvent(modelChangedEvent)
    
    // Find the most recent conversation for the new model
    if (chatHistory[newModel] && chatHistory[newModel].length > 0) {
      // Sort conversations by timestamp (newest first)
      const sortedSessions = [...chatHistory[newModel]].sort((a, b) => 
        (b.timestamp || 0) - (a.timestamp || 0)
      )
      
      // Get the most recent conversation
      const mostRecentSession = sortedSessions[0]
      
      if (mostRecentSession && mostRecentSession.id) {
        console.log(`Automatically selecting most recent ${newModel} session:`, mostRecentSession.id)
        
        // Get the session's index in the original array (needed for selectSession)
        const sessionIndex = chatHistory[newModel].findIndex(s => s.id === mostRecentSession.id)
        
        if (sessionIndex !== -1) {
          // Set the session ID directly
          setCurrentSessionId(mostRecentSession.id)
          
          // Store in localStorage
          localStorage.setItem('currentSessionId', mostRecentSession.id)
          localStorage.setItem('selectedSessionIndex', sessionIndex.toString())
          localStorage.setItem('selectedSessionModel', newModel)
          
          // Dispatch a session changed event
          const sessionChangedEvent = new CustomEvent('sessionChanged', {
            detail: { sessionId: mostRecentSession.id }
          })
          window.dispatchEvent(sessionChangedEvent)
          
          // Dispatch a load session event
          const loadSessionEvent = new CustomEvent('loadSession', { 
            detail: { 
              model: newModel, 
              sessionId: mostRecentSession.id,
              hasMessages: (mostRecentSession.messages && mostRecentSession.messages.length > 0)
            } 
          })
          window.dispatchEvent(loadSessionEvent)
          
          // Force UI updates
          setTimeout(() => {
            window.dispatchEvent(new Event('forceRender'))
          }, 50)
          
          return
        }
      }
    }
    
    // If there are no existing conversations for this model, create a new one
    if (chatHistory[newModel].length === 0) {
      console.log(`No conversations found for ${newModel}, creating a new one`)
      
      // Generate a new session ID
      const sessionId = `${newModel}-separator-${Date.now()}`
      
      // Dispatch event to create a new chat
      const newChatEvent = new CustomEvent('newChat', { 
        detail: { model: newModel, sessionId } 
      })
      window.dispatchEvent(newChatEvent)
    }
  }
  
  // Create a new chat
  const handleNewChat = () => {
    // Clear the selected session index and model
    localStorage.removeItem('selectedSessionIndex')
    localStorage.removeItem('selectedSessionModel')
    
    // Generate a new session ID
    const newSessionId = `${selectedModel}-separator-${Date.now()}`
    
    // Set the current session ID
    setCurrentSessionId(newSessionId)
    
    // Dispatch a custom event to notify the chat page to start a new chat
    const event = new CustomEvent('newChat', { 
      detail: { model: selectedModel, sessionId: newSessionId } 
    })
    window.dispatchEvent(event)
    
    // Also dispatch a session changed event to update other components
    const sessionChangedEvent = new CustomEvent('sessionChanged', {
      detail: { sessionId: newSessionId }
    })
    window.dispatchEvent(sessionChangedEvent)
    
    // Force a refresh of the chat history to ensure all conversations remain visible
    setTimeout(() => {
      window.dispatchEvent(new Event('messagesUpdated'))
    }, 100)
  }

  // Get model-specific color
  const getModelColor = (model) => {
    switch (model) {
      case 'gpt':
        return 'bg-green-500' // Green for OpenAI
      case 'claude':
        return 'bg-orange-500' // Orange for Claude
      case 'gemini':
        return 'bg-blue-500' // Blue for Gemini
      default:
        return 'bg-gray-500'
    }
  }
  
  // Split messages into sessions based on "--- New Chat ---" separators
  const splitIntoSessions = (messages, modelType, timestamps) => {
    if (!messages || messages.length === 0) return []
    
    // Special handling for GPT - ensure first message is a separator
    if (modelType === 'gpt' && messages.length > 0) {
      const firstMessage = messages[0];
      
      // If the first message is not a separator, we need to add one
      if (!(firstMessage.role === 'system' && firstMessage.content === '--- New Chat ---')) {
        console.log('First GPT message is not a separator, fixing...');
        
        // Create a temporary copy with a separator at the beginning
        const fixedMessages = [
          {
            role: 'system',
            content: '--- New Chat ---',
            id: `gpt-separator-${Date.now()}`,
            timestamp: firstMessage.timestamp || Date.now()
          },
          ...messages
        ];
        
        // Save the fixed messages back to localStorage
        localStorage.setItem('gpt-messages', JSON.stringify(fixedMessages));
        
        // Use the fixed messages for processing
        messages = fixedMessages;
      }
    }
    
    const sessions = []
    let currentSession = []
    let sessionStartIndex = -1
    let sessionLatestTimestamp = 0
    let sessionId = null
    
    messages.forEach((msg, index) => {
      // If this is a separator, start a new session
      if (msg.role === 'system' && msg.content === '--- New Chat ---') {
        // Save the current session if it has messages
        if (currentSession.length > 0 && sessionId) {
          sessions.push({
            messages: currentSession,
            timestamp: sessionLatestTimestamp,
            modelType,
            id: sessionId // Store the session ID for later use
          })
        }
        
        // Start a new session
        currentSession = []
        sessionStartIndex = index
        sessionId = msg.id
        
        // Use the separator's own timestamp for consistency
        sessionLatestTimestamp = msg.timestamp || Date.now()
        
        // For GPT specifically, make sure ID is properly formatted
        if (modelType === 'gpt' && sessionId && !sessionId.startsWith('gpt-separator-')) {
          sessionId = `gpt-separator-${Date.now()}-${index}`;
          msg.id = sessionId; // Update the message's ID directly
          console.log(`Fixed malformed GPT session ID to: ${sessionId}`);
        }
        
        // Make sure session IDs are never null
        if (!sessionId) {
          sessionId = `${modelType}-separator-${Date.now()}-${index}`;
          msg.id = sessionId; // Update the message's ID directly
          console.log(`Created missing session ID: ${sessionId}`);
        }
        
        console.log(`Session separator found with ID: ${sessionId}, timestamp: ${sessionLatestTimestamp}`)
      } else {
        // Add message sessionId property for more reliable session tracking
        if (sessionId && modelType === 'gpt') {
          msg.sessionId = sessionId;
        }
        
        // Add the message to the current session
        currentSession.push(msg)
      }
    })
    
    // Add the last session if it has messages
    if (currentSession.length > 0 && sessionId) {
      sessions.push({
        messages: currentSession,
        timestamp: sessionLatestTimestamp,
        modelType,
        id: sessionId
      })
    }
    
    return sessions
  }
  
  // Get first message from a conversation to use as title
  const getChatTitle = (session) => {
    if (!session || !session.messages || session.messages.length === 0) return 'New Chat'
    
    // Find the first user message
    const firstUserMessage = session.messages.find(msg => msg.role === 'user')
    if (!firstUserMessage) return 'New Chat'
    
    // Truncate the message if it's too long
    const maxLength = 25
    let title = firstUserMessage.content
    if (title.length > maxLength) {
      title = title.substring(0, maxLength) + '...'
    }
    return title
  }

  // Render chat history items
  const renderChatHistory = () => {
    // Combine all models' sessions, sorted by timestamp (newest first)
    const allSessions = [
      ...chatHistory.gpt.map((session, index) => ({ ...session, index, model: 'gpt' })),
      ...chatHistory.claude.map((session, index) => ({ ...session, index, model: 'claude' })),
      ...chatHistory.gemini.map((session, index) => ({ ...session, index, model: 'gemini' }))
    ]
    
    // Debug timestamps before sorting
    console.log('Session timestamps before sorting:',
      allSessions.map(s => ({
        model: s.model,
        id: s.id,
        index: s.index,
        timestamp: s.timestamp,
        title: getChatTitle(s).substring(0, 15) + '...'
      }))
    );
    
    // More aggressive sorting by timestamp, ensuring newest conversations are first
    const sortedSessions = allSessions.sort((a, b) => {
      // First compare by timestamp
      const timestampDiff = (b.timestamp || 0) - (a.timestamp || 0);
      if (timestampDiff !== 0) return timestampDiff;
      
      // If timestamps are the same (or missing), use model and index as tiebreakers
      if (a.model !== b.model) return a.model.localeCompare(b.model);
      return a.index - b.index;
    });
    
    // Debug timestamps after sorting
    console.log('Session timestamps after sorting:',
      sortedSessions.map(s => ({
        model: s.model,
        id: s.id,
        index: s.index,
        timestamp: s.timestamp,
        title: getChatTitle(s).substring(0, 15) + '...',
        isActive: currentSessionId === s.id
      }))
    );
    
    // If there are no sessions, return a message
    if (sortedSessions.length === 0) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center px-2">
          No chat history yet
        </div>
      );
    }
    
    // Return the rendered chat history
    return sortedSessions.map((session, i) => {
      // Check if this session is the active one by comparing sessionIds
      const isActive = currentSessionId === session.id;
      
      // Create a unique key for this session
      const sessionKey = `${session.model}-${session.index}-${session.id || Date.now() + i}`;
      
      return (
        <div 
          key={sessionKey}
          className={`flex items-center px-2 py-2 my-1 rounded-md cursor-pointer transition-colors duration-150 ${
            isActive 
              ? 'bg-gray-200 dark:bg-gray-700 border-l-2 border-gray-500' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            console.log('Selecting session:', session);
            selectSession(session.model, session.index);
          }}
        >
          <div className={`w-1 h-5 rounded-sm mr-2 ${getModelColor(session.model)}`}></div>
          <div className="flex-1 text-sm truncate">
            {getChatTitle(session)}
          </div>
        </div>
      )
    })
  }
  
  // Select a session
  const selectSession = (model, index) => {
    // Log more detailed debugging info
    console.log('selectSession called with:', { model, index });
    console.log('Current chatHistory state:', chatHistory);
    
    // Set the selected model first
    setSelectedModel(model)
    
    // Store the selected session index and model
    localStorage.setItem('selectedSessionIndex', index.toString())
    localStorage.setItem('selectedSessionModel', model)
    
    // Get the session from the chat history
    const session = chatHistory[model][index]
    console.log('Session to select:', session);
    
    if (session && session.id) {
      let sessionId = session.id
      console.log('Selected session with ID:', sessionId)
      
      // For GPT model, ALWAYS make sure the session ID is properly formatted
      // This fixes issues with GPT sessions specifically
      if (model === 'gpt' && !sessionId.startsWith('gpt-separator-')) {
        const originalId = sessionId;
        sessionId = `gpt-separator-${Date.now()}-${index}`;
        console.log(`Correcting malformed GPT session ID from ${originalId} to ${sessionId}`);
        
        // We need to update the actual message separator in storage
        try {
          const allMessages = JSON.parse(localStorage.getItem('gpt-messages') || '[]');
          let updated = false;
          
          const updatedMessages = allMessages.map(msg => {
            if (msg.id === originalId && msg.role === 'system' && msg.content === '--- New Chat ---') {
              updated = true;
              return { ...msg, id: sessionId };
            }
            return msg;
          });
          
          if (updated) {
            localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
            console.log('Updated message separator ID in storage');
          }
        } catch (e) {
          console.error('Error updating GPT message ID:', e);
        }
      }
      
      // Set the current session ID
      setCurrentSessionId(sessionId)
      
      // Store it in localStorage
      localStorage.setItem('currentSessionId', sessionId)
      
      // Check if this session has any messages other than the separator
      const hasMessages = session.messages && session.messages.length > 0
      console.log('Session has messages:', hasMessages, 'count:', session.messages?.length || 0)
      
      // For GPT model, make special effort to locate the proper session
      if (model === 'gpt') {
        // Load the original messages to find or fix any issues
        try {
          const allMessages = JSON.parse(localStorage.getItem('gpt-messages') || '[]');
          let foundSeparator = false;
          
          // First, check if the separator exists with this ID
          for (let i = 0; i < allMessages.length; i++) {
            const msg = allMessages[i];
            if (msg.id === sessionId && msg.role === 'system' && msg.content === '--- New Chat ---') {
              foundSeparator = true;
              break;
            }
          }
          
          // If we didn't find the separator, try to find it by matching messages
          if (!foundSeparator && session.messages.length > 0) {
            console.log('Session separator not found directly, trying to match by content...');
            
            for (let i = 0; i < allMessages.length; i++) {
              const msg = allMessages[i];
              if (msg.role === 'system' && msg.content === '--- New Chat ---') {
                // Check if the next messages match this session's messages
                let matches = true;
                const messagesToCheck = Math.min(session.messages.length, allMessages.length - i - 1);
                
                for (let j = 0; j < messagesToCheck; j++) {
                  if (i + 1 + j >= allMessages.length) break;
                  if (j >= session.messages.length) break;
                  
                  // Compare message content for similarity
                  if (session.messages[j].content !== allMessages[i + 1 + j].content) {
                    matches = false;
                    break;
                  }
                }
                
                if (matches && messagesToCheck > 0) {
                  // We found a matching session!
                  const matchedSessionId = msg.id;
                  console.log('Found matching session by content, ID:', matchedSessionId);
                  
                  // Update to use this session ID
                  sessionId = matchedSessionId;
                  setCurrentSessionId(matchedSessionId);
                  localStorage.setItem('currentSessionId', matchedSessionId);
                  foundSeparator = true;
                  break;
                }
              }
            }
          }
          
          // If we still couldn't find it, create a new session
          if (!foundSeparator) {
            console.log('Could not find or match GPT session, creating a new one');
            const newSessionId = `gpt-separator-${Date.now()}-new`;
            
            // Add a new separator
            const updatedMessages = [...allMessages, {
              role: 'system',
              content: '--- New Chat ---',
              id: newSessionId,
              timestamp: Date.now()
            }];
            
            localStorage.setItem('gpt-messages', JSON.stringify(updatedMessages));
            sessionId = newSessionId;
            setCurrentSessionId(newSessionId);
            localStorage.setItem('currentSessionId', newSessionId);
            
            // We need to dispatch a newChat event instead
            const newChatEvent = new CustomEvent('newChat', { 
              detail: { model: 'gpt', sessionId: newSessionId } 
            });
            window.dispatchEvent(newChatEvent);
            
            // Force UI updates
            setTimeout(() => {
              window.dispatchEvent(new Event('forceRender'));
              window.dispatchEvent(new Event('messagesUpdated'));
            }, 100);
            
            return;
          }
        } catch (e) {
          console.error('Error handling GPT session selection:', e);
        }
      }
      
      // Dispatch a custom event to notify the chat page to load this session
      const event = new CustomEvent('loadSession', { 
        detail: { model, sessionId, hasMessages }
      })
      window.dispatchEvent(event)
      
      // Also dispatch a session changed event to update other components
      const sessionChangedEvent = new CustomEvent('sessionChanged', {
        detail: { sessionId, hasMessages }
      })
      window.dispatchEvent(sessionChangedEvent)
      
      // Force a refresh of the chat history to ensure the selected session is highlighted
      setTimeout(() => {
        window.dispatchEvent(new Event('forceRender'))
      }, 50)
    } else {
      console.error('No session ID found for session:', session)
      
      // Fallback for missing session ID - try to create a valid session ID
      console.log('Attempting fallback for missing session ID');
      if (model === 'gpt' && session && session.messages && session.messages.length > 0) {
        // Create a new session ID
        const fallbackSessionId = `gpt-separator-${Date.now()}`;
        console.log('Created fallback session ID:', fallbackSessionId);
        
        // Add the session ID to local storage
        localStorage.setItem('currentSessionId', fallbackSessionId);
        setCurrentSessionId(fallbackSessionId);
        
        // Dispatch events with the fallback ID
        const event = new CustomEvent('loadSession', { 
          detail: { 
            model, 
            sessionId: fallbackSessionId, 
            hasMessages: true,
            isFallback: true 
          }
        });
        window.dispatchEvent(event);
        
        const sessionChangedEvent = new CustomEvent('sessionChanged', {
          detail: { 
            sessionId: fallbackSessionId, 
            hasMessages: true,
            isFallback: true 
          }
        });
        window.dispatchEvent(sessionChangedEvent);
        
        // Force UI updates
        setTimeout(() => {
          window.dispatchEvent(new Event('forceRender'));
        }, 50);
      }
    }
  }

  // Determine if sidebar should be visible
  const sidebarVisible = !collapsed || isHovering

  return (
    <div 
      className={`sidebar-container ${sidebarVisible ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out relative`}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className={`sidebar fixed h-full bg-slate-50 dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col ${sidebarVisible ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
        onMouseEnter={() => setIsHovering(true)}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Chat</h1>
          {/* Icons in the top-right corner */}
          <div className="flex items-center gap-[2px]">
            <ThemeToggle />
            <button 
              className="p-[2px] rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={openSettings}
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button 
              className="p-[2px] rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Pin sidebar" : "Unpin sidebar"}
            >
              {collapsed ? (
                // Enhanced pin sidebar icon (when sidebar is collapsed)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="14 7 19 12 14 17" />
                  <line x1="19" y1="4" x2="19" y2="20" strokeOpacity="0.8" />
                </svg>
              ) : (
                // Enhanced unpin sidebar icon (when sidebar is expanded)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="10 7 5 12 10 17" />
                  <line x1="5" y1="4" x2="5" y2="20" strokeOpacity="0.8" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Model</label>
          <div className="flex items-center gap-2">
            {/* Add back model indicator dash */}
            <div className={`w-1 h-6 rounded-sm ${getModelColor(selectedModel)}`}></div>
            
            <select 
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="gpt">OpenAI (API Key)</option>
              <option value="claude">Anthropic (API Key)</option>
              <option value="gemini">Gemini Flash 2.0 (Free)</option>
            </select>
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Using: {modelDisplayName}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <button 
            className="w-full text-left px-4 py-2 mb-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md flex items-center"
            onClick={handleNewChat}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
          
          {/* Chat history section */}
          <div className="space-y-1">
            <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold px-2 mb-2">Chat History</h3>
            
            {renderChatHistory()}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t dark:border-gray-700">
          <div className="text-sm text-amber-600 dark:text-amber-400 text-center">{apiStatus}</div>
        </div>
      </div>
      
      {/* Hover area to show sidebar when collapsed */}
      {collapsed && (
        <div 
          className="fixed top-0 left-0 w-16 h-full z-10"
          onMouseEnter={() => setIsHovering(true)}
        />
      )}
    </div>
  )
}
