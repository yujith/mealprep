-- Create Admin User Script
-- Run this in Supabase SQL Editor

-- Step 1: Create a new user in auth.users
-- Replace 'admin@mealprep.lk' and 'Admin@123!' with your desired email and password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  recovery_token,
  confirmation_token,
  email_change,
  email_change_token_new,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mealprep.lk',
  crypt('Admin@123!', gen_salt('bf')),
  now(),
  NULL,
  '',
  '',
  '',
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  false,
  now(),
  now(),
  NULL,
  NULL,
  '',
  '',
  '',
  0,
  NULL,
  NULL,
  NULL
) RETURNING id;

-- Step 2: Update the profile to admin role
-- Replace the UUID with the one returned from Step 1, or run this after the user signs up for the first time
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@mealprep.lk'
);

-- Alternative approach: If the user already exists (e.g., signed up normally), just update their role
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@mealprep.lk'
);

-- Verify the admin user was created
SELECT 
  u.email,
  p.role,
  p.full_name,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@mealprep.lk';
