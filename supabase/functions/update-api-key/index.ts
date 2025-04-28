
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
    
    // Update the Supabase secret via API
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
    
    // Store the API key in Supabase secrets
    const secretsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/set_secret`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        name: 'OPENAI_API_KEY',
        value: apiKey
      }),
    });
    
    if (!secretsResponse.ok) {
      const error = await secretsResponse.text();
      console.error('Error updating secret:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update API key', errorType: 'SECRET_UPDATE_ERROR' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('API key updated successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating API key:', error);
    return new Response(
      JSON.stringify({ error: error.message, errorType: 'SERVER_ERROR' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
