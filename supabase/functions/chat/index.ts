
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use environment variable for the API key
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()
    
    // Use the environment variable API key
    if (!openAIApiKey) {
      console.error('API key not found');
      return new Response(
        JSON.stringify({ 
          error: 'API key not found. Please add an API key in the settings.',
          errorType: 'NO_API_KEY' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
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
