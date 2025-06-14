
-- Create push_subscriptions table for storing push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for push_subscriptions
CREATE POLICY "Users can manage their own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Add unique constraint to prevent duplicate subscriptions per user
ALTER TABLE public.push_subscriptions 
ADD CONSTRAINT unique_user_subscription UNIQUE (user_id);

-- Enable real-time updates for delivery_assignments table
ALTER TABLE public.delivery_assignments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_assignments;

-- Add missing columns to delivery_assignments for real-time tracking
ALTER TABLE public.delivery_assignments 
ADD COLUMN IF NOT EXISTS current_location_lat DECIMAL,
ADD COLUMN IF NOT EXISTS current_location_lng DECIMAL,
ADD COLUMN IF NOT EXISTS eta_minutes INTEGER;
