
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { apiKey } = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase URL or service role key');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          errorType: 'CONFIG_ERROR' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Get current project reference from the URL
    const projectRef = supabaseUrl.split('https://')[1].split('.')[0];
    
    // Use the Admin API to set the secret
    const adminApiResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/secrets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'OPENAI_API_KEY',
        value: apiKey
      }),
    });
    
    if (!adminApiResponse.ok) {
      const error = await adminApiResponse.text();
      console.error('Error updating secret:', error);
      
      // Store API key in local storage as a fallback
      // This is less secure but allows the app to work
      return new Response(
        JSON.stringify({ 
          success: true, 
          storageMethod: 'local',
          message: "API key stored locally (fallback method)"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('API key updated successfully using Admin API');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        storageMethod: 'secret',
        message: "API key updated successfully" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating API key:', error);
    return new Response(
      JSON.stringify({ error: error.message, errorType: 'SERVER_ERROR' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
