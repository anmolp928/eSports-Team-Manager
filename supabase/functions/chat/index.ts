
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Hardcoded fallback API key for demonstration purposes
// In production, you would use a more secure approach
const DEMO_API_KEY = "demo-sk-1234567890";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json();
    const { content, clientApiKey } = requestData;
    
    // Try to get the API key from environment variable first
    // If not available, fall back to the client-provided key (from localStorage)
    // If that's not available either, fall back to the demo key
    const apiKey = Deno.env.get('OPENAI_API_KEY') || clientApiKey || DEMO_API_KEY;
    
    // Use mock response for demo key to make sure it works without a real key
    if (apiKey === DEMO_API_KEY || !apiKey.startsWith('sk-')) {
      console.log('Using demo mode with mock response');
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return new Response(
        JSON.stringify({ 
          response: `This is a demo response to your query: "${content}"\n\nTo use the real AI, please add your OpenAI API key in the settings.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For real API key, send request to OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert eSports team management assistant. You provide strategic advice about team composition, practice schedules, tournament preparation, player development, and other aspects of managing a professional eSports team. Keep your responses focused on eSports management and be concise but informative.'
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      
      // Check for specific error types
      let errorMessage = 'Error connecting to OpenAI API';
      let errorType = 'API_ERROR';
      
      if (errorData.error) {
        errorMessage = errorData.error.message;
        
        // Check for specific error types
        if (errorData.error.type === 'insufficient_quota' || 
            errorMessage.includes('exceeded your current quota')) {
          errorType = 'QUOTA_EXCEEDED';
          errorMessage = 'You have exceeded your OpenAI API quota. Please check your billing details or update your API key.';
        } else if (errorData.error.type === 'invalid_api_key' ||
                  errorMessage.includes('invalid api key')) {
          errorType = 'INVALID_API_KEY';
          errorMessage = 'The provided API key is invalid. Please update your API key in the settings.';
        }
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage, errorType }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await openAIResponse.json()
    const response = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorType: 'SERVER_ERROR'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
