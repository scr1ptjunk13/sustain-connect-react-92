
-- Create enum for payment types
CREATE TYPE payment_type AS ENUM ('donation_fee', 'premium_subscription', 'processing_fee');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  type payment_type NOT NULL,
  description TEXT NOT NULL,
  donation_id UUID REFERENCES public.donations(id) ON DELETE SET NULL,
  status payment_status DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax receipts table
CREATE TABLE public.tax_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receipt_number TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  description TEXT,
  tax_year INTEGER NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial analytics table
CREATE TABLE public.financial_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  payment_type payment_type NOT NULL,
  total_revenue INTEGER DEFAULT 0,
  total_fees INTEGER DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, payment_type)
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update payments" ON public.payments
  FOR UPDATE USING (true);

-- Create RLS policies for tax receipts
CREATE POLICY "Users can view their own tax receipts" ON public.tax_receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert tax receipts" ON public.tax_receipts
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for financial analytics
CREATE POLICY "Users can view financial analytics" ON public.financial_analytics
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage financial analytics" ON public.financial_analytics
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_type ON public.payments(type);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_tax_receipts_user_id ON public.tax_receipts(user_id);
CREATE INDEX idx_tax_receipts_tax_year ON public.tax_receipts(tax_year);
CREATE INDEX idx_financial_analytics_date ON public.financial_analytics(date);
