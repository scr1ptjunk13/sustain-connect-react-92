
-- Create missing tables that might be needed for the app to function properly

-- Create NGO details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.ngo_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  description TEXT,
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create delivery details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.delivery_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  current_location_lat DECIMAL,
  current_location_lng DECIMAL,
  is_available BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the handle_new_user function to also create role-specific records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, role, full_name, email, phone)
  VALUES (
    new.id,
    (new.raw_user_meta_data ->> 'role')::user_role,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );

  -- Insert role-specific data
  IF (new.raw_user_meta_data ->> 'role') = 'ngo' THEN
    INSERT INTO public.ngo_details (
      user_id,
      organization_name,
      registration_number
    ) VALUES (
      new.id,
      new.raw_user_meta_data ->> 'organization_name',
      new.raw_user_meta_data ->> 'registration_number'
    );
  END IF;

  IF (new.raw_user_meta_data ->> 'role') = 'delivery' THEN
    INSERT INTO public.delivery_details (
      user_id,
      vehicle_type,
      license_number
    ) VALUES (
      new.id,
      new.raw_user_meta_data ->> 'vehicle_type',
      new.raw_user_meta_data ->> 'license_number'
    );
  END IF;

  RETURN new;
END;
$function$;

-- Ensure Row Level Security is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for ngo_details
DROP POLICY IF EXISTS "NGOs can view own details" ON public.ngo_details;
CREATE POLICY "NGOs can view own details" 
  ON public.ngo_details FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "NGOs can update own details" ON public.ngo_details;
CREATE POLICY "NGOs can update own details" 
  ON public.ngo_details FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for delivery_details
DROP POLICY IF EXISTS "Delivery personnel can view own details" ON public.delivery_details;
CREATE POLICY "Delivery personnel can view own details" 
  ON public.delivery_details FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Delivery personnel can update own details" ON public.delivery_details;
CREATE POLICY "Delivery personnel can update own details" 
  ON public.delivery_details FOR UPDATE 
  USING (auth.uid() = user_id);
