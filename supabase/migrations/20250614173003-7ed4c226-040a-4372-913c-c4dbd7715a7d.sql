
-- Create enum types for user roles and statuses
CREATE TYPE user_role AS ENUM ('donor', 'ngo', 'delivery');
CREATE TYPE donation_status AS ENUM ('pending', 'claimed', 'picked_up', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('available', 'assigned', 'in_progress', 'completed');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create NGO details table
CREATE TABLE public.ngo_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create delivery personnel details table
CREATE TABLE public.delivery_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  is_available BOOLEAN DEFAULT true,
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  expiry_date DATE,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_state TEXT NOT NULL,
  pickup_zip_code TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  status donation_status DEFAULT 'pending',
  images TEXT[],
  special_instructions TEXT,
  claimed_by UUID REFERENCES public.profiles(id),
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery assignments table
CREATE TABLE public.delivery_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  delivery_person_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status delivery_status DEFAULT 'assigned',
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
  pickup_completed_at TIMESTAMP WITH TIME ZONE,
  delivery_scheduled_at TIMESTAMP WITH TIME ZONE,
  delivery_completed_at TIMESTAMP WITH TIME ZONE,
  delivery_address TEXT NOT NULL,
  delivery_lat DECIMAL(10, 8),
  delivery_lng DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create impact tracking table
CREATE TABLE public.impact_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  people_helped INTEGER DEFAULT 0,
  impact_description TEXT,
  impact_photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for NGO details
CREATE POLICY "NGOs can view their own details" ON public.ngo_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "NGOs can update their own details" ON public.ngo_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "NGOs can insert their own details" ON public.ngo_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for delivery details
CREATE POLICY "Delivery personnel can view their own details" ON public.delivery_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Delivery personnel can update their own details" ON public.delivery_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Delivery personnel can insert their own details" ON public.delivery_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for donations
CREATE POLICY "Donors can view their own donations" ON public.donations
  FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "NGOs can view available donations" ON public.donations
  FOR SELECT USING (status = 'pending' OR auth.uid() = claimed_by);

CREATE POLICY "Donors can create donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their own donations" ON public.donations
  FOR UPDATE USING (auth.uid() = donor_id);

CREATE POLICY "NGOs can claim donations" ON public.donations
  FOR UPDATE USING (status = 'pending' AND claimed_by IS NULL);

-- Create RLS policies for delivery assignments
CREATE POLICY "Delivery personnel can view their assignments" ON public.delivery_assignments
  FOR SELECT USING (auth.uid() = delivery_person_id);

CREATE POLICY "NGOs can view their delivery assignments" ON public.delivery_assignments
  FOR SELECT USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can create delivery assignments" ON public.delivery_assignments
  FOR INSERT WITH CHECK (auth.uid() = ngo_id);

CREATE POLICY "Delivery personnel can update their assignments" ON public.delivery_assignments
  FOR UPDATE USING (auth.uid() = delivery_person_id);

-- Create RLS policies for impact records
CREATE POLICY "NGOs can view their impact records" ON public.impact_records
  FOR SELECT USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can create impact records" ON public.impact_records
  FOR INSERT WITH CHECK (auth.uid() = ngo_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email, phone)
  VALUES (
    new.id,
    (new.raw_user_meta_data ->> 'role')::user_role,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage bucket for donation images
INSERT INTO storage.buckets (id, name, public) VALUES ('donation-images', 'donation-images', true);

-- Create storage policies for donation images
CREATE POLICY "Anyone can view donation images" ON storage.objects
  FOR SELECT USING (bucket_id = 'donation-images');

CREATE POLICY "Authenticated users can upload donation images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'donation-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own uploaded images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'donation-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploaded images" ON storage.objects
  FOR DELETE USING (bucket_id = 'donation-images' AND auth.uid()::text = (storage.foldername(name))[1]);
