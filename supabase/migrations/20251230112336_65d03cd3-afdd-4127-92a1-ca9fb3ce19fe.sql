-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Instagram accounts table
CREATE TABLE public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  session_token TEXT,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts" ON public.instagram_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON public.instagram_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.instagram_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.instagram_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  working_hours_start INTEGER DEFAULT 9,
  working_hours_end INTEGER DEFAULT 17,
  messages_per_day INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Campaign Instagram accounts junction table
CREATE TABLE public.campaign_instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, instagram_account_id)
);

ALTER TABLE public.campaign_instagram_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaign accounts" ON public.campaign_instagram_accounts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own campaign accounts" ON public.campaign_instagram_accounts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete own campaign accounts" ON public.campaign_instagram_accounts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

-- Targets table
CREATE TABLE public.targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  list_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'messaged', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own targets" ON public.targets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own targets" ON public.targets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own targets" ON public.targets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own targets" ON public.targets
  FOR DELETE USING (auth.uid() = user_id);

-- Sequences table (message templates)
CREATE TABLE public.sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  message_order INTEGER DEFAULT 0,
  delay_hours INTEGER DEFAULT 0,
  message TEXT NOT NULL,
  variant INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sequences" ON public.sequences
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own sequences" ON public.sequences
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own sequences" ON public.sequences
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete own sequences" ON public.sequences
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

-- Messages table (sent messages)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  target_id UUID REFERENCES public.targets(id) ON DELETE SET NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = user_id);

-- CRM leads table
CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'responses' CHECK (status IN ('responses', 'interested', 'not_interested')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads" ON public.crm_leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.crm_leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.crm_leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.crm_leads
  FOR DELETE USING (auth.uid() = user_id);