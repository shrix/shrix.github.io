import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, model, apiKey } = await request.json()
    
    // For demo purposes, we'll just echo back the message
    // In a real app, you would call the appropriate AI API here
    
    let responseContent = ''
    
    // Simulate API call based on model
    if ((model === 'gpt' || model === 'claude') && !apiKey) {
      responseContent = `Please provide an API key for ${model === 'gpt' ? 'ChatGPT' : 'Claude'} in the settings.`
    } else {
      // Simulate a response
      responseContent = `This is a response from the ${model} model: "${message}"\n\nIn a real implementation, this would call the actual ${model} API.`
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
