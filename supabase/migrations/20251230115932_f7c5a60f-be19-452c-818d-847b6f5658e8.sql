-- Add message_interval column to campaigns for rate limiting
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS message_interval_seconds integer DEFAULT 60;

-- Add more detailed status tracking to targets
ALTER TABLE public.targets 
ADD COLUMN IF NOT EXISTS last_message_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS error_message text,
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0;

-- Create a message_queue table for tracking outbound messages
CREATE TABLE IF NOT EXISTS public.message_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES public.targets(id) ON DELETE CASCADE,
  instagram_account_id uuid REFERENCES public.instagram_accounts(id),
  message_content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  scheduled_at timestamp with time zone DEFAULT now(),
  sent_at timestamp with time zone,
  error_message text,
  retry_count integer DEFAULT 0,
  webhook_response jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_queue
CREATE POLICY "Users can view own message queue"
ON public.message_queue FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
ON public.message_queue FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
ON public.message_queue FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON public.message_queue FOR DELETE
USING (auth.uid() = user_id);

-- Create campaign_settings table for webhook configuration
CREATE TABLE IF NOT EXISTS public.campaign_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url text,
  webhook_secret text,
  auto_retry boolean DEFAULT true,
  max_retries integer DEFAULT 3,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.campaign_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own settings"
ON public.campaign_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
ON public.campaign_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
ON public.campaign_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime for message_queue
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_queue;

-- Create index for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_message_queue_status_scheduled 
ON public.message_queue(status, scheduled_at) 
WHERE status = 'pending';