
-- Create missing tables for security and compliance features

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create privacy consents table
CREATE TABLE public.privacy_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  marketing_consent BOOLEAN DEFAULT false,
  analytics_consent BOOLEAN DEFAULT false,
  data_sharing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data export requests table
CREATE TABLE public.data_export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data deletion requests table
CREATE TABLE public.data_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  scheduled_deletion_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for privacy consents
CREATE POLICY "Users can view their own consents" ON public.privacy_consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own consents" ON public.privacy_consents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own consents" ON public.privacy_consents FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for data export requests
CREATE POLICY "Users can view their own export requests" ON public.data_export_requests FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for data deletion requests
CREATE POLICY "Users can view their own deletion requests" ON public.data_deletion_requests FOR SELECT USING (auth.uid() = user_id);
