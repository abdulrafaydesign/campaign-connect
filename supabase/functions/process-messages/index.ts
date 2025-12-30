import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, campaign_id, user_id } = await req.json();
    console.log(`Processing action: ${action} for campaign: ${campaign_id}`);

    if (action === 'start_campaign') {
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*, campaign_settings:campaign_settings(*)')
        .eq('id', campaign_id)
        .single();

      if (campaignError || !campaign) {
        console.error('Campaign not found:', campaignError);
        return new Response(JSON.stringify({ error: 'Campaign not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get pending targets for this campaign
      const { data: targets, error: targetsError } = await supabase
        .from('targets')
        .select('*')
        .eq('campaign_id', campaign_id)
        .eq('status', 'pending');

      if (targetsError) {
        console.error('Error fetching targets:', targetsError);
        throw targetsError;
      }

      console.log(`Found ${targets?.length || 0} pending targets`);

      // Get first message sequence
      const { data: sequences } = await supabase
        .from('sequences')
        .select('*')
        .eq('campaign_id', campaign_id)
        .order('message_order', { ascending: true })
        .limit(1);

      const messageContent = sequences?.[0]?.message || 'Hello {{username}}!';

      // Queue messages for each target
      const messageInterval = campaign.message_interval_seconds || 60;
      const messages = targets?.map((target, index) => ({
        user_id: user_id,
        campaign_id: campaign_id,
        target_id: target.id,
        message_content: messageContent.replace('{{username}}', target.username),
        status: 'pending',
        scheduled_at: new Date(Date.now() + (index * messageInterval * 1000)).toISOString(),
      })) || [];

      if (messages.length > 0) {
        const { error: insertError } = await supabase
          .from('message_queue')
          .insert(messages);

        if (insertError) {
          console.error('Error queuing messages:', insertError);
          throw insertError;
        }

        // Update campaign status to active
        await supabase
          .from('campaigns')
          .update({ status: 'active' })
          .eq('id', campaign_id);

        console.log(`Queued ${messages.length} messages`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        queued: messages.length,
        message: `Queued ${messages.length} messages for processing`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'process_queue') {
      // Get user's webhook settings
      const { data: settings } = await supabase
        .from('campaign_settings')
        .select('*')
        .eq('user_id', user_id)
        .single();

      // Get next pending message
      const { data: message, error: msgError } = await supabase
        .from('message_queue')
        .select('*, targets(*), campaigns(*)')
        .eq('user_id', user_id)
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!message) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'No pending messages' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Mark as processing
      await supabase
        .from('message_queue')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', message.id);

      let webhookSuccess = false;
      let webhookResponse = null;
      let errorMessage = null;

      // If webhook URL is configured, call it
      if (settings?.webhook_url) {
        try {
          console.log(`Calling webhook: ${settings.webhook_url}`);
          const webhookRes = await fetch(settings.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(settings.webhook_secret && { 'X-Webhook-Secret': settings.webhook_secret }),
            },
            body: JSON.stringify({
              target_username: message.targets?.username,
              message_content: message.message_content,
              campaign_name: message.campaigns?.name,
              message_id: message.id,
            }),
          });

          webhookResponse = await webhookRes.json().catch(() => ({ status: webhookRes.status }));
          webhookSuccess = webhookRes.ok;
          
          if (!webhookRes.ok) {
            errorMessage = `Webhook returned ${webhookRes.status}`;
          }
          
          console.log('Webhook response:', webhookResponse);
        } catch (err: unknown) {
          console.error('Webhook error:', err);
          errorMessage = err instanceof Error ? err.message : 'Webhook failed';
        }
      } else {
        // No webhook configured - simulate success for demo
        webhookSuccess = true;
        webhookResponse = { simulated: true };
        console.log('No webhook configured - simulating success');
      }

      // Update message status
      const newStatus = webhookSuccess ? 'sent' : 'failed';
      await supabase
        .from('message_queue')
        .update({ 
          status: newStatus,
          sent_at: webhookSuccess ? new Date().toISOString() : null,
          error_message: errorMessage,
          webhook_response: webhookResponse,
          updated_at: new Date().toISOString(),
        })
        .eq('id', message.id);

      // Update target status
      await supabase
        .from('targets')
        .update({ 
          status: webhookSuccess ? 'messaged' : 'failed',
          last_message_at: webhookSuccess ? new Date().toISOString() : null,
          error_message: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', message.target_id);

      return new Response(JSON.stringify({ 
        success: true, 
        message_id: message.id,
        status: newStatus,
        target: message.targets?.username,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'pause_campaign') {
      // Cancel all pending messages for this campaign
      await supabase
        .from('message_queue')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('campaign_id', campaign_id)
        .eq('status', 'pending');

      await supabase
        .from('campaigns')
        .update({ status: 'paused' })
        .eq('id', campaign_id);

      return new Response(JSON.stringify({ success: true, message: 'Campaign paused' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_stats') {
      const { data: stats } = await supabase
        .from('message_queue')
        .select('status')
        .eq('campaign_id', campaign_id);

      const counts = {
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        cancelled: 0,
        total: stats?.length || 0,
      };

      stats?.forEach(msg => {
        counts[msg.status as keyof typeof counts]++;
      });

      return new Response(JSON.stringify({ success: true, stats: counts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});