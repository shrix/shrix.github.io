import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, model, apiKey } = await request.json()
    
    let responseContent = ''
    
    // Get specific model versions from localStorage (client-side only)
    // In a real implementation, these would be passed from the client
    const gptModel = request.headers.get('x-gpt-model') || 'gpt-4o-mini'
    const claudeModel = request.headers.get('x-claude-model') || 'claude-instant'
    
    // Check for required API keys for paid models
    if (model === 'gpt' && !apiKey) {
      return NextResponse.json({
        content: 'Please provide an OpenAI API key in the settings to use ChatGPT.'
      })
    } else if (model === 'claude' && !apiKey) {
      return NextResponse.json({
        content: 'Please provide an Anthropic API key in the settings to use Claude.'
      })
    }
    
    // Simulate responses for now - in a real implementation, these would call the actual APIs
    switch (model) {
      case 'gpt':
        // In a real implementation, this would call the OpenAI API with the selected model
        responseContent = `[${getModelDisplayName(model, gptModel)}] ${message}\n\nThis is a simulated response. In a real implementation, this would use the OpenAI API with your API key and the ${gptModel} model.`
        break
        
      case 'claude':
        // In a real implementation, this would call the Anthropic API with the selected model
        responseContent = `[${getModelDisplayName(model, claudeModel)}] ${message}\n\nThis is a simulated response. In a real implementation, this would use the Anthropic API with your API key and the ${claudeModel} model.`
        break
        
      case 'gemini':
        // In a real implementation, this would call the Google Gemini API
        responseContent = `[Gemini Flash 2.0] ${message}\n\nThis is a simulated response. In a real implementation, this would use the free Gemini Flash 2.0 API.`
        break
        
      default:
        responseContent = `Unknown model: ${model}`
    }
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      content: responseContent
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

// Helper function to get a display name for the model
function getModelDisplayName(provider, modelId) {
  if (provider === 'gpt') {
    switch (modelId) {
      case 'gpt-4o-mini':
        return 'ChatGPT 4o Mini'
      case 'gpt-3.5-turbo':
        return 'ChatGPT 3.5 Turbo'
      case 'gpt-4':
        return 'ChatGPT 4'
      case 'gpt-4-turbo':
        return 'ChatGPT 4 Turbo'
      case 'gpt-4o':
        return 'ChatGPT 4o'
      default:
        return 'ChatGPT'
    }
  } else if (provider === 'claude') {
    switch (modelId) {
      case 'claude-instant':
        return 'Claude Instant'
      case 'claude-3-haiku':
        return 'Claude 3 Haiku'
      case 'claude-3-sonnet':
        return 'Claude 3 Sonnet'
      case 'claude-3-opus':
        return 'Claude 3 Opus'
      default:
        return 'Claude'
    }
  }
  return 'Unknown Model'
}
