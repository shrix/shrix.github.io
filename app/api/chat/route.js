import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, model, apiKey } = await request.json()
    
    let responseContent = ''
    
    // Check for required API keys for paid models
    if (model === 'gpt' && !apiKey) {
      return NextResponse.json({
        content: 'Please provide an OpenAI API key in the settings to use ChatGPT 3.5 Turbo.'
      })
    } else if (model === 'claude' && !apiKey) {
      return NextResponse.json({
        content: 'Please provide an Anthropic API key in the settings to use Claude Instant.'
      })
    }
    
    // Simulate responses for now - in a real implementation, these would call the actual APIs
    switch (model) {
      case 'gpt':
        // In a real implementation, this would call the OpenAI API with gpt-3.5-turbo
        responseContent = `[ChatGPT 3.5 Turbo] ${message}\n\nThis is a simulated response. In a real implementation, this would use the OpenAI API with your API key.`
        break
        
      case 'claude':
        // In a real implementation, this would call the Anthropic API with claude-instant
        responseContent = `[Claude Instant] ${message}\n\nThis is a simulated response. In a real implementation, this would use the Anthropic API with your API key.`
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
